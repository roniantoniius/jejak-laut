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
    lastModified: string;
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
}

export function NoteCard({ id, title, tags, longitude, latitude, gambar, distance, lastModified }: SimplifiedNote) {
  // Tentukan apakah jarak (distance) perlu ditampilkan
  const showDistance = longitude !== 0 && latitude !== 0 && distance;
  const lastModifiedText = lastModified
      ? formatTimeAgo(lastModified)
      : "Tidak ada informasi waktu";

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
              <h6 className="custom-medium mb-0">{lastModifiedText}</h6>
              {showDistance && <h6 className="custom-medium-abu">{distance} | <a className="custom-very-small">{latitude}, {longitude}</a></h6>}
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