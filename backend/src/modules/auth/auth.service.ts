import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female';
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: Partial<IUser>;
  token: string;
}

const SALT_ROUNDS = 12;

/**
 * Generate JWT token
 */
const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ userId, email }, secret, { expiresIn });
};

/**
 * Format user object for response (exclude sensitive fields)
 */
const formatUser = (user: IUser): Partial<IUser> => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user.age,
  gender: user.gender,
  createdAt: user.createdAt,
});

/**
 * Register a new user
 */
export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  // Check if email already exists
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    const error = new Error('Email sudah terdaftar');
    (error as any).statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create user
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    age: input.age,
    gender: input.gender,
  });

  // Generate token
  const token = generateToken(user._id as string, user.email);

  return {
    user: formatUser(user),
    token,
  };
};

/**
 * Login user with email and password
 * Uses generic error message to prevent email enumeration (US-02)
 */
export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    const error = new Error('Email atau password salah');
    (error as any).statusCode = 401;
    throw error;
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Email atau password salah');
    (error as any).statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id as string, user.email);

  return {
    user: formatUser(user),
    token,
  };
};

/**
 * Get user profile by ID
 */
export const getUserById = async (userId: string): Promise<Partial<IUser>> => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User tidak ditemukan');
    (error as any).statusCode = 404;
    throw error;
  }

  return formatUser(user);
};
