import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';

export default function Index() {
  const { tags } = useTags();
  const { notes } = useNotes();

  return (
    <View style={styles.container}>
      {/* Note List */}
      <NoteList tags={tags} notes={notes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});