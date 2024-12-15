import { Badge, Col, Row, Stack } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { NoteForm } from "../components/NoteForm";
import { useNote } from "../layouts/NoteLayout";
import styles from "../styles/NoteList.module.css";
import { Link } from "react-router-dom";


type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
  const note = useNote();
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <Link
            to=".."
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
      </Row>
      <hr className={styles.horizontalDivider} />
      <Row className="align-items-center mt-3 mb-5">
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
          <p className="mt-2"><strong>Gambar:</strong> {note.gambar.split('/').pop() || 'Tidak ada gambar'}</p>
        </Col>
      </Row>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        longitude={note.longitude}
        latitude={note.latitude}
        gambar={note.gambar}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}