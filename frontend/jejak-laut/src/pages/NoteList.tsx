import { useEffect, useMemo, useState } from "react";
import { Row, Col, Stack, Form, Card } from "react-bootstrap";
import ReactSelect from "react-select";
import { Tag } from "../App";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';
import { GuideStep } from "../components/GuideStep";
import { EditTagsModal } from "../components/EditTagsModel";
import { NoteCard, SimplifiedNote } from "../components/NoteCard";
import { PopupCard } from "../components/PopupCard";
import { useNavigate } from "react-router-dom";
import { calculateDistance, Location } from "../components/calculateDistance";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi pengguna:", error);
        }
      );
    }
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLocaleLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Stack direction="horizontal" gap={2}>
            <img src="/dark-nobg.svg" alt="Logo" style={{ width: '40px', height: '40px'}} />
            <h2 style={{ margin: 0 }} className="custom-judul">Jejak Laut</h2>
          </Stack>
        </Col>
        <Col xs="auto">
          <PopupCard
            icon={<img src="/dot.svg" alt="Icon" style={{ width: 24, height: 24 }} />}
            title="Menu Aksi Beranda"
            buttons={[
              {
                label: "Tambah Jejak Baru",
                className: "primary custom-button",
                onClick: () => navigate("/baru"),
              },
              {
                label: "Perbarui Kategori",
                className: "outline-secondary text",
                onClick: () => setEditTagsModalIsOpen(true),
              },
            ]}
          />
        </Col>
      </Row>
      <hr className={styles.horizontalDivider} />
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label className="custom-medium">Cari judul catatan kamu!</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="custom-medium">Kategori</Form.Label>
              <ReactSelect className="text"
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Card className={`h-100 text-reset text-decoration-none ${styles.card} ${styles.guideCard}`}>
        <Card.Body>
          <Stack gap={4} className="align-items-center justify-content-center">
            <span className="fs-2 custom-medium">Panduan Jejak Laut</span>
            <Row className="g-3 justify-content-center">
              <GuideStep stepNumber={1} imageSrc="/1.png" description="Buat Catatan Jejak Baru Kamu!" />
              <GuideStep stepNumber={2} imageSrc="/2.png" description="Format Kategori Yang Efisien" />
              <GuideStep stepNumber={3} imageSrc="/3.png" description="Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!" />
            </Row>
          </Stack>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {filteredNotes.map((note) => {
          const distance = userLocation
            ? calculateDistance(userLocation, {
                latitude: note.latitude,
                longitude: note.longitude,
              })
            : null;

          return (
            <Col xs={12} key={note.id}>
              <NoteCard
                id={note.id}
                title={note.title}
                tags={note.tags}
                latitude={note.latitude}
                longitude={note.longitude}
                gambar={note.gambar}
                distance={distance}
                lastModified={note.lastModified}
              />
            </Col>
          );
        })}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}