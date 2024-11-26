import os
from dotenv import load_dotenv
import groq

load_dotenv()

models = [
    "llama-3.1-70b-versatile",
    "llama-3.1-70b-specdec",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
]

DEFAULT_MODEL = "llama-3.1-70b-versatile"  # Set default model

def get_chatter():
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    groq_client = groq.Groq(api_key=GROQ_API_KEY)

    system_prompt = """Kamu adalah seorang asisten pada Startup Jejak Laut, dan nama kamu adalah Jela. Jejak Laut adalah aplikasi catatan sederhana yang ditujukan kepada nelayan-nelayan di Indonesia agar mereka mampu membuat catatan mengenai aktivitas-aktivitas mereka di laut.
    
    Saat ini kamu sedang berbicara dengan seorang nelayan dan akan menerima catatan mereka yang berisi judul, isi catatan, dan kategori dengan format berisi komoditas, waktu (hari), dan alat tangkap. Tujuan kamu adalah mendampingi nelayan tersebut dalam membuat catatan mengenai aktivitas mereka di laut atau melengkapi catatan mereka. Pastikan kamu menggunakan Bahasa Indonesia yang baik dan benar. 
    
    Hasil output yang Jela hasilkan harus terbagi menjadi dua bagian:
    1. **Respons kamu**: Pandangan atau pendapat Kamu Terhadap Catatan tersebut.
    2. **Hasil perbaikan catatan**: Sebuah catatan rapih yang berisikan perbaikan dari catatan yang diberikan dan tidak perlu menjelaskan ulang lagi. Fokus terhadap perbaikan catatan dan jadikan judul dan kategori sebagai konteks.

    Kamu tidak perlu menjelaskan ulang konteks yang sudah diberikan dan cukup fokus pada perbaikan catatan, juga jangan menampilkan simbol yang tidak digunakan seperti '=', '-', dan simbol lainnya. Intinya cukup buatkan hasil perbaikan catatan yang informatif dan kontekstual.

    Jika masukan tidak sesuai konteks, cukup dan selalu jawab bahwa kamu tidak mengerti pertanyaan tersebut."""

    def send_chat_request(
        model: str,
        judul: str,
        catatan: str,
        kategori: str,
        query: str,
        temperature: float = 0.7,
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