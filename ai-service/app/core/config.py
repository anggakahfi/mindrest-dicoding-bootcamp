from pathlib import Path
import os
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


class Settings:
    PROJECT_NAME: str = "MindRest AI Service"
    PROJECT_VERSION: str = "1.0.0"

    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    MODEL_PATH: Path = BASE_DIR / os.getenv(
        "MODEL_PATH",
        "app/models/tweetmind_stress_classifier.keras"
    )

    TOKENIZER_PATH: Path = BASE_DIR / os.getenv(
        "TOKENIZER_PATH",
        "tokenizer.pkl"
    )

    MAX_SEQUENCE_LENGTH: int = int(os.getenv("MAX_SEQUENCE_LENGTH", "100"))


settings = Settings()