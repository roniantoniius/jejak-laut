import React, { createContext, useContext } from 'react';
import { NoteData } from './types';
import { useAsyncStorage } from './useAsyncStorage';

type NoteContextType = {
  notes: NoteData[];
  addNote: (note: NoteData) => void;
  updateNote: (id: string, updatedNote: NoteData) => void;
  deleteNote: (id: string) => void;
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);

  const addNote = (note: NoteData) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
  };

  const updateNote = (id: string, updatedNote: NoteData) => {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = {
        ...updatedNote,
        id: id // Ensure ID remains the same
      };
      setNotes(updatedNotes);
    }
  };
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };
  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};