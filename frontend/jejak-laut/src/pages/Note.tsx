import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "../layouts/NoteLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "../styles/NoteList.module.css";
import remarkGfm from "remark-gfm";
import '../styles/Note.css';
import { PopupCard } from "../components/PopupCard";
import { JelaChat } from "../components/JelaChat";
import { useEffect } from "react";
import { ChatbotData } from "../App";


type NoteProps = {
  onDelete: (id: string) => void;
};

export function Note({ onDelete }: NoteProps) {
  const note = useNote();
  const navigate = useNavigate();

  const onUpdateChatbotData = (noteId: string, data: Partial<ChatbotData>) => {
    console.log(`Update chatbot data for note ${noteId}`, data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <img
              src="/back.svg"
              alt="Logo"
              style={{ width: '65px', height: '40px' }}
            />
            <h3 className="custom-medium" style={{ margin: 0 }}>Kembali</h3>
          </Link>
        </Col>
          
        <Col xs="auto">
          <PopupCard
            icon={<img src="/dot.svg" alt="Icon" style={{ width: 24, height: 24 }} />}
            // membuat variabel title beserta {note.title} beserta string Judul adalah
            title = {`Menu Untuk Catatan ${note.title}`}
            buttons={[
              {
                label: "Ubah",
                className: "primary custom-button",
                onClick: () => navigate(`/${note.id}/ubah`),
              },
              {
                label: "Hapus",
                className: "outline-danger text",
                onClick: () => {
                  onDelete(note.id);
                  navigate("/");},
              },
            ]}
          />
        </Col>
      </Row>

      <hr className={styles.horizontalDivider} />

      <Row className="align-items-center mt-3">
        <Col xs={3}>
          {note.gambar && (
            <img
              src={note.gambar}
              alt="Note"
              style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
            />
          )}
        </Col>
        <Col xs={9}>
          <h1 className="custom-medium" style={{ fontSize: '3em', margin: 0 }}>
            {note.title}
          </h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap mt-2">
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate custom-tag-besar">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="mb-3 mt-5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.markdown}
            </ReactMarkdown>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="mb-1">
            <strong>Latitude, Longitude:</strong> {note.latitude}, {note.longitude}
          </p>
        </Col>
      </Row>
      <div>
          <Link to={`/${note.id}/lokasi`} style={{ textDecoration: 'none' }}>
            <Button variant="primary custom-button-2 text w-20">
              Periksa Lokasi
            </Button>
          </Link>
      </div>
      
      <div className="d-flex align-items-center mt-3">
        <div className="flex-grow-1 me-2">
          <JelaChat 
            noteId={note.id} 
            onUpdateChatbotData={onUpdateChatbotData} 
            chatbotData={{ ai_access: note.ai_access, daftar_token: note.daftar_token }} 
            noteData={{
              title: note.title,
              kategori: note.tags.map(tag => tag.label).join(", "),
              catatan: note.markdown,
            }}
          />
        </div>
    </div>
    </>
  );
}