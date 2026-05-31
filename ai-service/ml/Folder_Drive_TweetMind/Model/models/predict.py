"""predict.py — TweetMind Inference Script (Optimized)

Digunakan oleh FastAPI endpoint /predict.

Usage:
    from predict import TweetMindPredictor
    predictor = TweetMindPredictor('path/to/model.keras', 'path/to/tokenizer.pkl')
    result = predictor.predict("I feel so stressed")
"""

import re
import pickle
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.losses import Loss
from tensorflow.keras.preprocessing.sequence import pad_sequences

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download("stopwords", quiet=True)
nltk.download("punkt", quiet=True)

STOPWORDS_EN     = set(stopwords.words("english"))
CUSTOM_STOPWORDS = {"rt", "via", "amp", "would", "could", "also", "get", "got"}
STOPWORDS_FINAL  = STOPWORDS_EN.union(CUSTOM_STOPWORDS)


class FocalLoss(Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_true  = tf.cast(y_true, tf.int32)
        y_true  = tf.one_hot(y_true, depth=tf.shape(y_pred)[-1])
        y_pred  = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        ce_loss = -tf.reduce_sum(y_true * tf.math.log(y_pred), axis=-1)
        p_t     = tf.reduce_sum(y_true * y_pred, axis=-1)
        focal_w = self.alpha * tf.pow(1.0 - p_t, self.gamma)
        return tf.reduce_mean(focal_w * ce_loss)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({"gamma": self.gamma, "alpha": self.alpha})
        return cfg


def clean_tweet(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#(\w+)", r"\1", text)
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in STOPWORDS_FINAL and len(t) > 2]
    return " ".join(tokens)


class TweetMindPredictor:
    LABEL_MAP  = {0: "Stres Tinggi", 1: "Stres Sedang", 2: "Tidak Stres"}
    STRESS_MAP = {0: "Tinggi", 1: "Sedang", 2: "Rendah"}

    def __init__(self, model_path: str, tokenizer_path: str, max_len: int = 50):
        self.max_len = max_len
        with open(tokenizer_path, "rb") as f:
            self.tokenizer = pickle.load(f)
        self.model = keras.models.load_model(
            model_path, custom_objects={"FocalLoss": FocalLoss}
        )

    def predict(self, text: str) -> dict:
        cleaned = clean_tweet(text)
        seq     = self.tokenizer.texts_to_sequences([cleaned])
        padded  = pad_sequences(seq, maxlen=self.max_len, padding="post", truncating="post")
        proba   = self.model.predict(padded, verbose=0)[0]
        label   = int(np.argmax(proba))
        return {
            "label"        : label,
            "label_text"   : self.LABEL_MAP[label],
            "stress"       : self.STRESS_MAP[label],
            "confidence"   : round(float(proba[label]), 4),
            "probabilities": {
                "Stres Tinggi": round(float(proba[0]), 4),
                "Stres Sedang": round(float(proba[1]), 4),
                "Tidak Stres": round(float(proba[2]), 4),
            }
        }
