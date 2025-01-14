import { Col, Row, Form, Stack, Button } from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import '../styles/Note.css';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
  longitude = 0,
  latitude = 0,
  gambar = "",
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

  // Local states for latitude and longitude
  const [lat, setLat] = useState<number>(latitude);
  const [lng, setLng] = useState<number>(longitude);
  const navigate = useNavigate();

  const [fileBase64, setFileBase64] = useState<string>(gambar);

  async function handleFileChange(files: FileList | null) {
    if (files) {
      const fileRef = files[0];
      const formData = new FormData();
      formData.append('image', fileRef);
      try {
        const response = await fetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setFileBase64(data.imageUrl); // Simpan URL gambar
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const finalGambar = fileBase64 || gambar;

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
      longitude: lng,
      latitude: lat,
      gambar: finalGambar,
      lastModified: "",
    });

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label className="custom-small">Judul</Form.Label>
              <Form.Control className="text" ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="custom-small">Kategori</Form.Label>
              <CreatableReactSelect
                className="text"
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                value={selectedTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                options={availableTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => ({
                      label: tag.label,
                      id: tag.value,
                    }))
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Col>
          <Form.Group controlId="markdown" className="mb-3">
            <Form.Label className="text custom-small">Badan Catatan</Form.Label>
            <Form.Control
              className="text"
              defaultValue={markdown}
              required
              as="textarea"
              ref={markdownRef}
              rows={15}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="fileUpload" className="mb-3">
            <Form.Label className="text custom-small">Upload Gambar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange((e.target as HTMLInputElement).files)}
            />
          </Form.Group>
        </Col>
        <Row>
          <Col>
            <Form.Group controlId="latitude">
              <Form.Label className="custom-small">Latitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="longitude">
              <Form.Label className="custom-small">Longitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Stack direction="horizontal" gap={2} className="justify-content-end mt-3">
            <Button type="submit" variant="primary custom-button">
              Simpan
            </Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary text">
                Batal
              </Button>
            </Link>
          </Stack>
        </Row>
      </Stack>
    </Form>
  );
}