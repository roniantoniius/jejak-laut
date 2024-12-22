import { StyleSheet, Text, View, Alert } from 'react-native';
import React from 'react';
import { useAsyncStorage } from '../../components/useAsyncStorage';
import { NoteForm } from '../../components/NoteForm';
import { NoteData, Tag } from '../../components/types';
import { v4 as uuidV4 } from 'uuid';
import 'react-native-get-random-values';

export default function NewNoteScreen() {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);

  const handleCreateNote = (data: NoteData) => {
    const newNote = { ...data, id: uuidV4() }; // Buat catatan baru dengan ID unik
    setNotes([...notes, newNote]); // Update array catatan dengan catatan baru
    
    Alert.alert('Berhasil!', 'Catatan baru berhasil disimpan.');
    console.log('Catatan baru berhasil disimpan:', newNote);
  };

  const handleAddTag = (tag: Tag) => {
    const newTags = [...tags, tag]; // Tambahkan tag baru ke array tag
    setTags(newTags); // Update array tag

    Alert.alert('Berhasil!', 'Tag baru berhasil ditambahkan.');
    console.log('Tag baru berhasil ditambahkan:', tag);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tambah Jejak Baru</Text>
      <NoteForm
        onSubmit={handleCreateNote}
        onAddTag={handleAddTag}
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
