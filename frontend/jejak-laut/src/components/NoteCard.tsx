import { Stack, Card, Badge, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Tag } from "../App";
import styles from "../styles/NoteList.module.css";
import '../styles/Note.css';

export type SimplifiedNote = {
    tags: Tag[];
    title: string;
    id: string;
    longitude: number;
    latitude: number;
    gambar: string;
    distance?: string | null;
};

export function NoteCard({ id, title, tags, longitude, latitude, gambar, distance }: SimplifiedNote) {
  // Tentukan apakah jarak (distance) perlu ditampilkan
  const showDistance = longitude !== 0 && latitude !== 0 && distance;

  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={9}>
            <Stack gap={2}>
              <span className="fs-4 custom-medium">{title}</span>
              {tags.length > 0 && (
                <Stack gap={2} direction="horizontal" className="flex-wrap mb-1">
                  {tags.map((tag) => (
                    <Badge key={tag.id} className="custom-tag text-truncate">
                      {tag.label}
                    </Badge>
                  ))}
                </Stack>
              )}
              {showDistance && <h6 className="custom-medium-abu">{distance}</h6>}
              <h5 className="fs-5 custom-very-small">
                {latitude}, {longitude}
              </h5>
            </Stack>
          </Col>
          <Col xs={3} className="d-flex justify-content-end">
            {gambar && (
              <img
                src={gambar}
                alt="Note"
                className={`${styles.noteImage}`}
              />
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}