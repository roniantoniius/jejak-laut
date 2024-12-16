import { useState, useRef, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/JelaChat.module.css";
import { ChatbotData } from "../App";
import ReactMarkdown from "react-markdown";
import { Alert } from "./Alert";

type ChatMessage = {
  id: number;
  role: "user" | "jela";
  message: string;
  buttonsDisabled?: boolean;
};

export type JelaChatProps = {
  noteId: string;
  onUpdateChatbotData: (noteId: string, data: Partial<ChatbotData>) => void;
  onUpdateNote: (id: string, data: Partial<{ markdown: string }>) => void;
  chatbotData: ChatbotData;
  noteData: {
    title: string;
    kategori: string;
    catatan: string;
  }
};

export function JelaChat({ noteId, onUpdateChatbotData, onUpdateNote, chatbotData, noteData }: JelaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(""); 
  const [isLocked, setIsLocked] = useState<boolean>(true); 
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false); 
  const [jumlahResponsJela, setJumlahResponsJela] = useState<number>(0); 
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ai_access, daftar_token } = chatbotData;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUnlockChat = async () => {
    try {
      let token: string;
      if (!daftar_token[noteId]) {
        const response = await axios.post("http://localhost:5212/api/session/redis/generate_token");
        token = response.data.token;

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
      setJumlahResponsJela(0);
    } catch (error) {
      console.error("Gagal membuat token:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isInputDisabled) return;

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

      const { response: apiResponse, result } = response.data.response;

      const jelaResponse: ChatMessage = {
        id: messages.length + 2,
        role: "jela",
        message: `${apiResponse}\n\n${result}`,
        buttonsDisabled: false  
      };

      setMessages((prev) => [...prev, jelaResponse].map(msg => {
        if (msg.role === 'jela' && msg.id !== jelaResponse.id) {
          return { ...msg, buttonsDisabled: true }; 
        }
        return msg;
      }));
      setJumlahResponsJela((prev) => prev + 1);

      if (jumlahResponsJela + 1 >= 5) {
        setIsInputDisabled(true);
      }
    } catch (error) {
      console.error("Gagal mengirim prompt ke AI:", error);
      const errorJelaResponse: ChatMessage = {
        id: messages.length + 2,
        role: "jela",
        message: "Maaf, kami mengalami kesulitan menghubungi Jela. Silakan coba lagi nanti.",
        buttonsDisabled: true
      };
      setMessages(prev => [...prev, errorJelaResponse]);
    }
  };

  const handleButtonClick = (messageId: number, buttonType: 'change' | 'add' | 'reject') => {
    const selectedMessage = messages.find(msg => msg.id === messageId);
    if (!selectedMessage) return;

    setMessages(currentMessages => 
      currentMessages.map(msg => 
        msg.id === messageId ? { ...msg, buttonsDisabled: true } : msg
      )
    );

    if (buttonType === 'change' || buttonType === 'add') {
      const changeOrAddMarkdown = buttonType === 'change' ? selectedMessage.message : noteData.catatan + "\n" + selectedMessage.message;
      onUpdateNote(noteId, { markdown: changeOrAddMarkdown });

      setAlertMessage(`Proses ${buttonType === 'change' ? 'Ubah' : 'Tambah'} data berhasil!`);
      setShowAlert(true); // Trigger the alert
    } else if (buttonType === 'reject') {
      return;
    }
  };

  const isFinishButtonDisabled = isLocked || jumlahResponsJela < 5;

  return (
    <Card className={styles.chatContainer}>
      <Card.Body className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? styles.userMessage : styles.jelaMessage}
          >
            {msg.role === "jela" ? (
              <>
                <img 
                  src="/dark-nobg.svg" 
                  alt="Jela Profile" 
                  className={styles.jelaProfilePic} 
                />
                <div className={styles.markdownContainer}>
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                  <Row className={styles.buttonContainer1}>
                    <Col xs="auto">
                      <Button 
                        variant="primary custom-button" 
                        className="mr-2" 
                        onClick={() => handleButtonClick(msg.id, 'change')}
                        disabled={msg.buttonsDisabled}
                      >
                        Ubah
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        variant="warning text" 
                        className="mr-2" 
                        onClick={() => handleButtonClick(msg.id, 'add')}
                        disabled={msg.buttonsDisabled}
                      >
                        Tambah
                      </Button>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        variant="danger text" 
                        className="mr-2" 
                        onClick={() => handleButtonClick(msg.id, 'reject')}
                        disabled={msg.buttonsDisabled}
                      >
                        Tidak
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              msg.message
            )}
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
                disabled={isInputDisabled}
              />
              <Button
                className={styles.floatingButton}
                onClick={handleSendMessage}
                disabled={isInputDisabled}
              >
                <img src="/arrow-up-white.svg" alt="Icon" style={{ width: 24, height: 24 }} />
              </Button>
            </div>
            <Button 
              variant="primary custom-button d-flex align-items-center justify-content-center w-100 mt-3" 
              className={styles.unlockButton} 
              onClick={handleUnlockChat}
              disabled={isFinishButtonDisabled}
            >
              <img src="/christmas-stars.png" alt="stars" style={{ width: "20px", height: "20px" }} />
              Selesaikan Dengan AI
            </Button>
          </>
        )}
      </Card.Footer>
      <Alert 
        message={alertMessage} 
        onNavigate={() => { 
          setShowAlert(false);
          window.location.href = '/'; 
        }} 
        show={showAlert} 
      />
    </Card>
  );
}