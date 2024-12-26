import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTags } from '../../components/TagContext';
import { useNotes } from '../../components/NoteContext'; // Import the new context
import { NoteForm } from '../../components/NoteForm';
import { NoteData } from '../../components/types';
import { v4 as uuidV4 } from 'uuid';
import 'react-native-get-random-values';

export default function NewNoteScreen() {
  const { tags, addTag } = useTags();
  const { addNote } = useNotes(); // Use the new context for adding notes
  const navigation = useNavigation();

  const handleCreateNote = (data: NoteData) => {
    const newNote = { ...data, id: uuidV4() };
    addNote(newNote); // Add the note via context
    console.log('Catatan baru berhasil disimpan:', newNote);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NoteForm 
        onSubmit={handleCreateNote}
        onAddTag={(tag) => addTag(tag)} 
        availableTags={tags}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  text: {
    color: '#052844',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});