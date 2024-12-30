import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import { NoteForm } from '@/components/NoteForm';
import { NoteData, Tag } from '@/components/types';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTags } from '@/components/TagContext';

export default function EditNoteScreen() {
  const { notes, updateNote } = useNotes();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const noteToEdit = notes.find((note) => note.id === id);
  const { tags, addTag } = useTags();

  if (!noteToEdit) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  // Here we're preparing the data for the NoteForm
  const preloadedData = {
    title: noteToEdit.title,
    markdown: noteToEdit.markdown,
    tags: noteToEdit.tags,
    latitude: noteToEdit.latitude,
    longitude: noteToEdit.longitude,
  };

  const handleUpdateNote = (data: NoteData) => {
    updateNote(id as string, {
      ...noteToEdit,
      ...data,
      lastModified: new Date().toISOString(),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NoteForm
        onSubmit={handleUpdateNote}
        onAddTag={(tag) => addTag(tag)}
        availableTags={tags} // This should be populated if tags aren't part of the note directly
        {...preloadedData}
        navigation={navigation}
        latitude={noteToEdit.latitude}
        longitude={noteToEdit.longitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 20,
    color: 'red',
  },
});