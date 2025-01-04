import { useNotes } from '@/components/NoteContext';
import { router, useLocalSearchParams } from 'expo-router';
import { NoteForm } from '@/components/NoteForm';
import { NoteData } from '@/components/types';
import { View, StyleSheet, Text } from 'react-native';
import { useTags } from '@/components/TagContext';
import { useEffect, useState } from 'react';

export default function EditNoteScreen() {
  // Combine all hooks at the top level
  const { notes, updateNote } = useNotes();
  const { tags, addTag } = useTags();
  const params = useLocalSearchParams<{
    id: string;
    latitude?: string;
    longitude?: string;
  }>();

  // State declarations
  const [preloadedData, setPreloadedData] = useState<NoteData | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteData | null>(null);

  // Combined useEffect for handling both initial load and location updates
  useEffect(() => {
    const foundNote = notes.find((note) => note.id === params.id);
    
    if (foundNote) {
      const noteData = {
        ...foundNote,
        // If we have new coordinates in params, use those, otherwise use existing
        latitude: params.latitude ? parseFloat(params.latitude) : foundNote.latitude,
        longitude: params.longitude ? parseFloat(params.longitude) : foundNote.longitude,
      };
      
      setNoteToEdit(noteData);
      setPreloadedData(noteData);
    } else {
      setNoteToEdit(null);
      setPreloadedData(null);
    }
  }, [params.id, params.latitude, params.longitude, notes]);

  // Early return if data isn't loaded
  if (!noteToEdit || !preloadedData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  const handleUpdateNote = (data: NoteData) => {
    updateNote(params.id, {
      ...data,
      id: params.id,
      lastModified: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <NoteForm
        mode="edit"
        onSubmit={handleUpdateNote}
        onAddTag={(tag) => addTag(tag)}
        availableTags={tags}
        {...preloadedData}
        latitude={noteToEdit.latitude}
        longitude={noteToEdit.longitude}
      />
    </View>
  );
}

// style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
});
