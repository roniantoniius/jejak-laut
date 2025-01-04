import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import { NoteForm } from '@/components/NoteForm';
import { NoteData, RootStackParamList } from '@/components/types';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTags } from '@/components/TagContext';
import { useEffect, useState } from 'react';

export default function EditNoteScreen() {
  const { notes, updateNote } = useNotes();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tags, addTag } = useTags();

  const [preloadedData, setPreloadedData] = useState<NoteData | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteData | null>(null);

  useEffect(() => {
    const foundNote = notes.find((note) => note.id === id);
    setNoteToEdit(foundNote || null);

    if (foundNote) {
      setPreloadedData({
        id: foundNote.id,
        title: foundNote.title,
        markdown: foundNote.markdown,
        tags: foundNote.tags,
        latitude: foundNote.latitude,
        longitude: foundNote.longitude,
        lastModified: foundNote.lastModified,
      });
    } else {
      setPreloadedData(null);
    }
  }, [id, notes]);

  if (!noteToEdit || !preloadedData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  const handleUpdateNote = (data: NoteData) => {
    updateNote(id, {
      ...data,
      id: id, // Ensure we're using the correct ID
      lastModified: new Date().toISOString(),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NoteForm
        mode="edit"
        onSubmit={handleUpdateNote}
        onAddTag={(tag) => addTag(tag)}
        availableTags={tags}
        {...preloadedData}
        navigation={navigation}
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
