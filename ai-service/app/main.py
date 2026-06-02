from fastapi import FastAPI, HTTPException

from app.schemas.analyze_schema import AnalyzeRequest, AnalyzeResponse
from app.services.prediction_service import prediction_service
from app.services.gemini_service import gemini_service
from app.core.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI service untuk klasifikasi kondisi pengguna menggunakan model Keras dan rekomendasi Gemini.",
    version=settings.PROJECT_VERSION
)


@app.get("/")
def root():
    return {
        "message": "TweetMind AI Service is running",
        "docs": "/docs",
        "health": "/health",
        "analyze": "/analyze"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "model_path": str(settings.MODEL_PATH),
        "tokenizer_path": str(settings.TOKENIZER_PATH),
        "gemini_enabled": settings.GEMINI_API_KEY is not None
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_text(request: AnalyzeRequest):
    try:
        prediction = prediction_service.predict(request.text)

        gemini_result = gemini_service.generate_recommendation(
            user_text=request.text,
            predicted_label=prediction["label"]
        )

        return {
            "input_text": request.text,
            "prediction": {
                "label": prediction["label"],
                "confidence": prediction["confidence"],
                "probabilities": prediction["probabilities"]
            },
            "ringkasan": gemini_result["ringkasan"],
            "rekomendasi": gemini_result["rekomendasi"],
            "pesan_dukungan": gemini_result["pesan_dukungan"]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi error saat analisis: {str(e)}"
        )