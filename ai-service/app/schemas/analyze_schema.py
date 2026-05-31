from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class AnalyzeRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=3,
        example="Akhir-akhir ini saya merasa capek, sulit fokus, dan sering merasa gagal."
    )


class PredictionResult(BaseModel):
    label: str
    confidence: Optional[float] = None
    probabilities: Optional[Dict[str, float]] = None


class AnalyzeResponse(BaseModel):
    input_text: str
    prediction: PredictionResult
    ringkasan: str
    rekomendasi: List[str]
    pesan_dukungan: str