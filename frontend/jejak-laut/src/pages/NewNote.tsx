import { Col, Stack, Button, Row } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { NoteForm } from "../components/NoteForm";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect } from "react";

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  const navigate = useNavigate();
  
  const [selectedLat, setSelectedLat] = useLocalStorage<number | null>("selectedLatitude", null);
  const [selectedLng, setSelectedLng] = useLocalStorage<number | null>("selectedLongitude", null);

  useEffect(() => {
    const storedLatitude = localStorage.getItem("selectedLatitude");
    const storedLongitude = localStorage.getItem("selectedLongitude");

    if (storedLatitude) {
      setSelectedLat(JSON.parse(storedLatitude));
    }
    if (storedLongitude) {
      setSelectedLng(JSON.parse(storedLongitude));
    }
  }, [setSelectedLat, setSelectedLng]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Stack direction="horizontal" gap={2} className="align-items-center mb-4">
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
                src="/dark-nobg.svg"
                alt="Logo"
                style={{ width: '50px', height: '50px' }}
              />
              <h3 className="custom-medium" style={{ margin: 0 }}>Bikin Jejak Catatan Kamu!</h3>
            </Link>

          </Stack>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary text" onClick={() => navigate("/pilihlokasi")}>Pilih lokasi di Peta</Button>
        </Col>
      </Row>
      <hr className={styles.horizontalDivider} />

      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        latitude={selectedLat || 0}
        longitude={selectedLng || 0}
        gambar=""
      />
    </>
  );
}