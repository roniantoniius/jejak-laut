import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import { NoteForm } from '@/components/NoteForm';
import { NoteData, Tag } from '@/components/types';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditNoteScreen() {
  const { notes, updateNote } = useNotes();
  const { id } = useLocalSearchParams();

  // Find the note to edit
  const noteToEdit = notes.find((note) => note.id === id);

  if (!noteToEdit) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  // Function to handle the update of the note
  const handleUpdateNote = (data: NoteData) => {
    updateNote(id as string, {
      ...noteToEdit,
      ...data,
      lastModified: new Date().toISOString(),
    });
    // After updating, navigate back (assuming navigation prop is passed down)
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NoteForm 
        onSubmit={handleUpdateNote}
        onAddTag={() => {}} // You might want to implement this if needed for editing
        availableTags={[]} // Assuming you're not adding new tags while editing
        title={noteToEdit.title}
        markdown={noteToEdit.markdown}
        tags={noteToEdit.tags}
        latitude={noteToEdit.latitude}
        longitude={noteToEdit.longitude}
        navigation={useNavigation()} // Assuming you're using react-navigation
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
    fontSize: 18,
    color: 'red',
  },
});