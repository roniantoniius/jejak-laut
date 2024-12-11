import { useState, useRef, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/JelaChat.module.css";
import { ChatbotData } from "../App";

type ChatMessage = {
  id: number;
  role: "user" | "jela";
  message: string;
};

export type JelaChatProps = {
  noteId: string;
  onUpdateChatbotData: (noteId: string, data: Partial<ChatbotData>) => void;
  chatbotData: ChatbotData;
  noteData: {
    title: string;
    kategori: string;
    catatan: string;
  }
};

export function JelaChat({ noteId, onUpdateChatbotData, chatbotData, noteData }: JelaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(""); 
  const [isLocked, setIsLocked] = useState<boolean>(true); 
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false); 
  const [jumlahResponsJela, setJumlahResponsJela] = useState<number>(0); // State untuk menghitung respons dari Jela
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ai_access, daftar_token } = chatbotData;

  // Scroll otomatis ke bawah setiap kali pesan baru masuk
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fungsi untuk mendapatkan token baru atau mengambil token dari daftar
  const handleUnlockChat = async () => {
    try {
      let token: string;
      if (!daftar_token[noteId]) {
        // Buat token baru
        const response = await axios.post("http://localhost:5212/api/session/redis/generate_token");
        token = response.data.token;

        // Perbarui data chatbot
        onUpdateChatbotData(noteId, {
          ai_access: ai_access + 1,
          daftar_token: { ...daftar_token, [noteId]: token }
        });
      } else {
        token = daftar_token[noteId];
      }

      setIsLocked(false);
      setMessages([]); 
      setIsInputDisabled(false); 
      setJumlahResponsJela(0); // Reset jumlah respons Jela saat chat dibuka
    } catch (error) {
      console.error("Gagal membuat token:", error);
    }
  };

  // Fungsi untuk mengirim prompt ke AI
  const handleSendMessage = async () => {
    if (!inputText.trim() || isInputDisabled) return; // Cek jika input dinonaktifkan

    const newMessage: ChatMessage = {
        id: messages.length + 1,
        role: "user",
        message: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    const token = daftar_token[noteId];
    try {
        const response = await axios.post(
            "http://localhost:5212/api/jela/chat",
            {
                judul: noteData.title,
                kategori: noteData.kategori,
                catatan: noteData.catatan,
                query: inputText.trim(),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Ambil response dan result dari respons API
        const { response: apiResponse } = response.data.response;
        const { result } = response.data.response;

        // Gabungkan apiResponse dan result menjadi satu string
        const combinedMessage = `${apiResponse}\n\n${result}`;

        const jelaResponse: ChatMessage = {
            id: messages.length + 2,
            role: "jela",
            message: combinedMessage,
        };

        setMessages((prev) => [...prev, jelaResponse]);
        setJumlahResponsJela((prev) => prev + 1); // Tambah jumlah respons Jela

        // Cek jika jumlah respons Jela sudah mencapai 5
        if (jumlahResponsJela + 1 >= 5) {
            setIsInputDisabled(true); // Kunci input dan tombol kirim
        }
    } catch (error) {
        console.error("Gagal mengirim prompt ke AI:", error);
    }
  };

  // Status tombol 'Selesaikan Dengan AI'
  const isFinishButtonDisabled = isLocked || jumlahResponsJela < 5;

  return (
    <Card className={styles.chatContainer}>
      <Card.Body className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? styles.userMessage : styles.jelaMessage}
          >
            {msg.role === "jela" && (
              <img 
                src="/dark-nobg.svg" 
                alt="Jela Profile" 
                className={styles.jelaProfilePic} 
              />
            )}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </Card.Body>

      <Card.Footer className={styles.chatFooter}>
        {isLocked ? (
          <Button 
            variant="primary custom-button d-flex align-items-center justify-content-center w-100" 
            className={styles.unlockButton} 
            onClick={handleUnlockChat}
          >
            <img src="/christmas-stars.png" alt="stars" style={{ width: "20px", height: "20px" }} />
            Selesaikan Dengan AI
          </Button>
        ) : (
          <>
            <div className={styles.inputContainer}>
              <Form.Control
                type="text"
                placeholder="Tulis pesanmu..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.inputField}
                disabled={isInputDisabled} // Menonaktifkan input ketika isInputDisabled true
              />
              <Button
                className={styles.floatingButton}
                onClick={handleSendMessage}
                disabled={isInputDisabled} // Menonaktifkan tombol kirim
              >
                <img src="/arrow-up-white.svg" alt="Icon" style={{ width: 24, height: 24 }} />
              </Button>
            </div>
            <Button 
              variant="primary custom-button d-flex align-items-center justify-content-center w-100 mt-3" 
              className={styles.unlockButton} 
              onClick={handleUnlockChat}
              disabled={isFinishButtonDisabled} // Tombol ini hanya aktif jika sudah 5 respons
            >
              <img src="/christmas-stars.png" alt="stars" style={{ width: "20px", height: "20px" }} />
              Selesaikan Dengan AI
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}