import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: { field: string; message: string }[];
}

/**
 * Standardized success response
 */
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standardized error response
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: { field: string; message: string }[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
