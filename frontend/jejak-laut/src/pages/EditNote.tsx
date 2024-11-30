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
          <h1 className="custom-medium">{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate custom-tag">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
      </Row>
      <hr className={styles.horizontalDivider} />
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        longitude={note.longitude}
        latitude={note.latitude}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}
