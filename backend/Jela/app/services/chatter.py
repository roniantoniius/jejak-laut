import os
from dotenv import load_dotenv
import groq

load_dotenv()

models = [
    "llama3-groq-70b-8192-tool-use-preview",
    "llama-3.1-70b-versatile",
    "gemma2-9b-it",
]

DEFAULT_MODEL = "llama3-groq-70b-8192-tool-use-preview"

def get_chatter():
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    groq_client = groq.Groq(api_key=GROQ_API_KEY)

    system_prompt = """Kamu adalah Jela, asisten untuk Jejak Laut, aplikasi catatan bagi nelayan Indonesia. Saat ini kamu sedang berbicara dengan seorang nelayan dan akan menerima catatan mereka yang berisi judul, isi catatan, dan kategori catatan. Tujuan kamu adalah mendampingi nelayan tersebut dalam membuat catatan lengkap dan panjang mengenai aktivitas mereka di laut atau melengkapi catatan mereka. Pastikan kamu menggunakan Bahasa Indonesia yang baik dan benar.
    
    Hasil output yang Jela hasilkan harus terbagi menjadi dua bagian:
    1. **Respons kamu**:Pendapat Kamu Terhadap Catatan tersebut.
    2. **Hasil Perubahan catatan**: Versi catatan yang lebih lengkap dan rapi sesuai dengan permintaan nelayan, berupa laporan panjang berdasarkan informasi yang nelayan berikan dan kamu wajib melakukan improvement atau adaptasi dengan menambah beberapa hal baru yang berkaitan dengan catatan tersebut. Fokus pada perbaikan tanpa simbol tambahan yang tidak diperlukan dan penjelasan ulang. Jika nelayan memasukan suatu tabel atau hal lainnya, usahakan itu tetap ada.

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

        # Chat request ke Groq API
        response = groq_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "text"},
            temperature=temperature,
        )

        # Pecah respons berdasarkan sistem format
        chatbot_response = response.choices[0].message.content

        # Pisahkan respons menjadi dua bagian
        if "\n\n" in chatbot_response:
            parts = chatbot_response.split("\n\n", 1)
            response_main = parts[0].strip()  # Bagian respons utama
            response_result = parts[1].strip()  # Bagian hasil Markdown

            response_main = response_main.replace("=", "").strip()
        else:
            response_main = chatbot_response.replace("=", "").strip()
            response_result = "Hasil perbaikan catatan tidak ditemukan."

        # Pastikan respons terstruktur
        return {
            "response": response_main,
            "result": f"{response_result}"  # Dibungkus Markdown
        }

    return send_chat_request