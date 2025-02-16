import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./pages/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./pages/NoteList";
import { Note } from "./pages/Note";
import { NoteLayout } from "./layouts/NoteLayout";
import { EditNote } from "./pages/EditNote";
import { NoteLokasi } from "./pages/NoteLokasi";
import { PickLocation } from "./pages/PickLocation";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ChatbotData = {
  ai_access: number;
  daftar_token: Record<string, string>;
};

export type Note = {
  id: string;
} & NoteData & ChatbotData;

export type RawNote = {
  id: string;
  lastModified: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
  longitude: number;
  latitude: number;
  gambar: string;
};


export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
  longitude: number;
  latitude: number;
  gambar: string;
  lastModified: string;
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
        ai_access: 0,
        daftar_token: {},
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, longitude, latitude, ...data }: NoteData) {
    setNotes((prevNotes) => [
      ...prevNotes,
      {
        id: uuidV4(),
        ...data,
        longitude,
        latitude,
        tagIds: tags.map((tag) => tag.id),
        lastModified: new Date().toISOString(),
      },
    ]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData, callback?: () => void) {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
            lastModified: new Date().toISOString(),
          };
        } else {
          return note;
        }
      });
  
      // Jika callback disediakan, panggil callback setelah setNotes
      if (callback) callback();
  
      return updatedNotes;
    });
  }  

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <>
      <Container className="my-4">
        <Routes>
          <Route
            path="/"
            element={
              <NoteList
                notes={notesWithTags}
                availableTags={tags}
                onUpdateTag={updateTag}
                onDeleteTag={deleteTag}
              />
            }
          />
          <Route
            path="/baru"
            element={
              <NewNote
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDelete={onDeleteNote} />} />
            <Route
              path="ubah"
              element={
                <EditNote
                  onSubmit={onUpdateNote}
                  onAddTag={addTag}
                  availableTags={tags}
                />
              }
            />
            <Route path="lokasi" element={<NoteLokasi />} />
          </Route>
          <Route path="/pilihlokasi" element={<PickLocation />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
      <ToastContainer />
    </>
  );
}

export default App;