import React, { createContext, useContext } from 'react';
import { NoteData } from './types';
import { useAsyncStorage } from './useAsyncStorage';

type NoteContextType = {
  notes: NoteData[];
  addNote: (note: NoteData) => void;
  updateNote: (id: string, updatedNote: NoteData) => void;
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);

  const addNote = (note: NoteData) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
  };

  const updateNote = (id: string, updatedNote: NoteData) => {
    const updatedNotes = notes.map(note => note.id === id ? updatedNote : note);
    setNotes(updatedNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote }}>
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