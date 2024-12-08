import { useState, useRef, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios"; // Tambahkan axios untuk mengirim request ke backend
import styles from "../styles/JelaChat.module.css";
import { ChatbotData } from "../App";

type ChatMessage = {
  id: number;
  role: "user" | "jela";
  message: string;
};

export type JelaChatProps = {
  noteId: string; // ID dari catatan yang sedang dibuka
  onUpdateChatbotData: (noteId: string, data: Partial<ChatbotData>) => void; // Fungsi untuk memperbarui data chatbot di catatan
  chatbotData: ChatbotData; // Data terkait sesi chatbot dari catatan
};

export function JelaChat({ noteId, onUpdateChatbotData, chatbotData }: JelaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(""); 
  const [isLocked, setIsLocked] = useState<boolean>(true); 
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false); 
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
    } catch (error) {
      console.error("Gagal membuat token:", error);
    }
  };

  // Fungsi untuk mengirim prompt ke AI
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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
          judul: "Judul Catatan",
          kategori: "Kategori",
          catatan: "Isi catatan", 
          query: inputText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jelaResponse: ChatMessage = {
        id: messages.length + 2,
        role: "jela",
        message: response.data.response,
      };

      setMessages((prev) => [...prev, jelaResponse]);

      if (chatbotData.ai_access >= 5) {
        setIsInputDisabled(true); 
      }
    } catch (error) {
      console.error("Gagal mengirim prompt ke AI:", error);
    }
  };

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
              variant="primary custom-button d-flex align-items-center justify-content-center w-100" 
              className={styles.unlockButton} 
              onClick={handleUnlockChat}
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
