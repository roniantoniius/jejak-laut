import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { tags } = useTags();
  const { notes, deleteNote } = useNotes();

  const reloadNotes = useCallback(() => {
  }, []);

  return (
    <View style={styles.container}>
      {/* Note List */}
      <NoteList tags={tags} notes={notes} onDelete={reloadNotes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});