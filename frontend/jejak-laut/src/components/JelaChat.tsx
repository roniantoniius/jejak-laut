import { useState, useRef, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import styles from "../styles/JelaChat.module.css";

type ChatMessage = {
  id: number;
  role: "user" | "jela";
  message: string;
};

export function JelaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(""); 
  const [isLocked, setIsLocked] = useState<boolean>(true); // Awalnya terkunci
  const [jumlahPercobaanPrompt, setJumlahPercobaanPrompt] = useState<number>(0);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false); // Status input terkunci
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll ke bawah setiap kali ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      message: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Hitung percobaan prompt dari user
    setJumlahPercobaanPrompt((prev) => prev + 1);

    // Simulasikan respons dari Jela
    const jelaResponse: ChatMessage = {
      id: messages.length + 2,
      role: "jela",
      message: "Ini adalah balasan dari Jela, bantuannya sedang diproses...",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, jelaResponse]);
      // Setelah 5 pesan dan respons diterima, disable input dan tombol kirim
      if (jumlahPercobaanPrompt + 1 >= 5) {
        setIsInputDisabled(true); // Menonaktifkan input teks
      }
    }, 1000);
  };

  const handleUnlockChat = () => {
    setIsLocked(false);
    setJumlahPercobaanPrompt(0); // Reset jumlah percobaan prompt
    setMessages([]); // Reset chat
    setIsInputDisabled(false); // Mengaktifkan kembali input
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
              variant="primary mb-3 mt-3" 
              className={styles.unlockButton} 
              onClick={handleUnlockChat} 
              disabled={jumlahPercobaanPrompt < 5} // Tombol ini hanya dikunci jika belum mencapai 5 percakapan
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
