import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { tags } = useTags();
  const { notes, deleteNote } = useNotes();

  const handleDeleteNote = useCallback((id: string) => {
    deleteNote(id);
  }, [deleteNote]);
  return (
    <View style={styles.container}>
      {/* Note List */}
      <NoteList tags={tags} notes={notes} onDelete={handleDeleteNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});