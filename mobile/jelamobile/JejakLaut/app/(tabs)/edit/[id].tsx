import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import { NoteForm } from '@/components/NoteForm';
import { NoteData, RootStackParamList, Tag } from '@/components/types';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTags } from '@/components/TagContext';
import { useEffect, useState } from 'react';

export default function EditNoteScreen() {
  const { notes, updateNote } = useNotes();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const noteToEdit = notes.find((note) => note.id === id);
  const { tags, addTag } = useTags();
  const [preloadedData, setPreloadedData] = useState<NoteData | null>(null);

  if (!noteToEdit) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  useEffect(() => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setPreloadedData({
        id: noteToEdit.id,
        title: noteToEdit.title,
        markdown: noteToEdit.markdown,
        tags: noteToEdit.tags,
        latitude: noteToEdit.latitude,
        longitude: noteToEdit.longitude,
        lastModified: noteToEdit.lastModified,
      });
    } else {
      setPreloadedData(null);
    }
  }, [id, notes]);

  if (!preloadedData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

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
        mode="edit"
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