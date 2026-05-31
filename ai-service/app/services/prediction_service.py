import re
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

from app.core.config import settings


class PredictionService:
    def __init__(self):
        if not settings.MODEL_PATH.exists():
            raise FileNotFoundError(f"Model tidak ditemukan: {settings.MODEL_PATH}")

        if not settings.TOKENIZER_PATH.exists():
            raise FileNotFoundError(f"Tokenizer tidak ditemukan: {settings.TOKENIZER_PATH}")

        # compile=False dipakai karena model dilatih dengan custom loss FocalLoss.
        # Untuk prediksi/inference, loss tidak perlu diload.
        self.model = load_model(settings.MODEL_PATH, compile=False)

        with open(settings.TOKENIZER_PATH, "rb") as file:
            self.tokenizer = pickle.load(file)

        self.max_sequence_length = settings.MAX_SEQUENCE_LENGTH

        self.label_mapping = {
            0: "Buruk",
            1: "Cukup",
            2: "Bagus"
        }

    def clean_text(self, text: str) -> str:
        text = text.lower()
        text = re.sub(r"http\S+|www\S+", "", text)
        text = re.sub(r"@\w+", "", text)
        text = re.sub(r"#", "", text)
        text = re.sub(r"[^a-zA-Z\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def predict(self, text: str) -> dict:
        cleaned_text = self.clean_text(text)

        sequence = self.tokenizer.texts_to_sequences([cleaned_text])

        padded = pad_sequences(
            sequence,
            maxlen=self.max_sequence_length,
            padding="post",
            truncating="post"
        )

        prediction = self.model.predict(padded, verbose=0)

        probabilities = prediction[0].tolist()
        predicted_index = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))

        label = self.label_mapping.get(predicted_index, "Cukup")

        return {
            "label": label,
            "confidence": confidence,
            "probabilities": {
                self.label_mapping.get(i, str(i)): float(probabilities[i])
                for i in range(len(probabilities))
            },
            "cleaned_text": cleaned_text
        }


prediction_service = PredictionService()