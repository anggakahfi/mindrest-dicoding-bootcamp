import json
import re
from google import genai

from app.core.config import settings


class GeminiService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            self.client = None
        else:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def clean_json_response(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"^```json", "", text)
        text = re.sub(r"^```", "", text)
        text = re.sub(r"```$", "", text)
        return text.strip()

    def generate_recommendation(self, user_text: str, predicted_label: str) -> dict:
        if self.client is None:
            return self.default_recommendation(predicted_label)

        prompt = f"""
Kamu adalah asisten pendukung emosional ringan untuk aplikasi MindRest.

Input pengguna:
"{user_text}"

Hasil klasifikasi model machine learning:
"{predicted_label}"

Tugas:
Buat ringkasan dan rekomendasi berdasarkan input pengguna dan hasil klasifikasi model.

Aturan:
1. Jangan memberikan diagnosis medis.
2. Jangan menyebut pengguna pasti mengalami gangguan mental tertentu.
3. Gunakan bahasa Indonesia yang empatik, natural, dan mudah dipahami.
4. Jika kondisi pengguna terlihat berat, arahkan untuk menghubungi orang terdekat atau profesional.
5. Output wajib JSON valid saja.
6. Jangan pakai markdown.
7. Jangan pakai ```json.

Format output:
{{
  "ringkasan": "Ringkasan singkat kondisi pengguna.",
  "rekomendasi": [
    "Rekomendasi pertama",
    "Rekomendasi kedua",
    "Rekomendasi ketiga"
  ],
  "pesan_dukungan": "Kalimat dukungan singkat."
}}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            result_text = self.clean_json_response(response.text)
            result_json = json.loads(result_text)

            return {
                "ringkasan": result_json.get("ringkasan", "Belum ada ringkasan."),
                "rekomendasi": result_json.get("rekomendasi", []),
                "pesan_dukungan": result_json.get(
                    "pesan_dukungan",
                    "Kamu tidak harus menghadapi semuanya sendirian."
                )
            }

        except Exception:
            return self.default_recommendation(predicted_label)

    def default_recommendation(self, label: str) -> dict:
        if label == "Buruk":
            return {
                "ringkasan": "Kondisi pengguna menunjukkan adanya tekanan emosional yang cukup tinggi.",
                "rekomendasi": [
                    "Coba ceritakan perasaanmu kepada orang yang kamu percaya.",
                    "Berikan waktu untuk istirahat dan kurangi aktivitas yang terlalu membebani.",
                    "Jika perasaan ini terus berlanjut, pertimbangkan untuk menghubungi konselor atau profesional."
                ],
                "pesan_dukungan": "Kamu tidak harus menghadapi semuanya sendirian."
            }

        if label == "Bagus":
            return {
                "ringkasan": "Kondisi pengguna terlihat cukup positif dan stabil.",
                "rekomendasi": [
                    "Pertahankan kebiasaan baik yang membuatmu merasa nyaman.",
                    "Tetap jaga pola tidur, makan, dan aktivitas harian.",
                    "Luangkan waktu untuk hal-hal yang membuatmu merasa lebih tenang."
                ],
                "pesan_dukungan": "Senang melihat kamu berada dalam kondisi yang cukup baik."
            }

        return {
            "ringkasan": "Kondisi pengguna terlihat cukup netral, namun tetap perlu menjaga keseimbangan diri.",
            "rekomendasi": [
                "Coba luangkan waktu untuk memahami perasaanmu hari ini.",
                "Jaga rutinitas sederhana seperti tidur cukup dan makan teratur.",
                "Lakukan aktivitas ringan yang bisa membantu menenangkan pikiran."
            ],
            "pesan_dukungan": "Tidak apa-apa mengambil waktu untuk dirimu sendiri."
        }


gemini_service = GeminiService()