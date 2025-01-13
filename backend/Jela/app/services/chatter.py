import os
from dotenv import load_dotenv
import groq
import json
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

models = [
    "llama-3.3-70b-versatile",
    "llama-3.3-70b-specdec",
    "llama3-70b-8192",
]

DEFAULT_MODEL = "llama-3.3-70b-versatile"

def get_chatter():
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    groq_client = groq.Groq(api_key=GROQ_API_KEY)

    system_prompt = """Kamu adalah Jela dengan kepribadian yang Kritis dan penuh Ide (kreatif), kamu juga merupakan asisten untuk Jejak Laut, aplikasi catatan bagi nelayan Indonesia. Saat ini kamu sedang berbicara dengan seorang nelayan dan akan menerima catatan mereka yang berisi judul, isi catatan, dan kategori catatan. Tujuan kamu adalah mendampingi nelayan tersebut dalam membuat catatan lengkap dan panjang mengenai aktivitas mereka di laut atau melengkapi catatan mereka. Pastikan kamu menggunakan Bahasa Indonesia yang baik dan benar.
    
    Hasil output yang Jela hasilkan harus berupa JSON dengan dua properti (HANYA DUA PROPERTI):
    "response": {
      "response": Pendapat Kamu Terhadap Catatan yang Nelayan lampirkan yang ditampung pada key response.
      "result": Versi catatan sesuai dengan permintaan nelayan (query) yang ditampung pada key result, isinya berupa teks markdown laporan panjang berdasarkan informasi yang nelayan berikan dan kamu bisa melakukan improvement atau adaptasi dengan menambah beberapa hal untuk melengkapi catatan tersebut. Jika nelayan memasukkan suatu tabel atau hal lainnya, usahakan itu tetap ada.
    }

    Pastikan ketika kamu menghasilkan output atau response, kamu jangan mengulang lagi informasi yang sudah ada pada catatan nelayan, tapi tambahkan informasi yang relevan dan penting untuk melengkapi catatan tersebut.

    Jika masukan tidak sesuai konteks, cukup dan selalu jawab bahwa kamu tidak mengerti pertanyaan tersebut."""

    def send_chat_request(
        model: str,
        judul: str,
        catatan: str,
        kategori: str,
        query: str,
        temperature: float = 0.8,
    ):
        user_prompt = f"""Halo Jela, berikut catatan saya yang berjudul '{judul}' dengan kategori '{kategori}':
        "{catatan}"

        Lalu saya ingin bertanya, {query}"""

        try:
            # Chat request ke Groq API
            response = groq_client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=temperature,
            )

            # Mengambil content dari response
            chatbot_response = response.choices[0].message.content
            
            # Mengembalikan JSON yang sudah di-parse
            try:
                return json.loads(chatbot_response)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON response: {chatbot_response}")
                return {
                    "response": "Maaf, terjadi kesalahan dalam memproses respons.",
                    "result": "Hasil perbaikan catatan tidak ditemukan."
                }
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return {
                "response": "Maaf, terjadi kesalahan di server.",
                "result": "Tidak ada hasil yang dapat diberikan."
            }

    return send_chat_request