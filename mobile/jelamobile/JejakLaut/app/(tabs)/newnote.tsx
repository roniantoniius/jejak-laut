import { StyleSheet, Text, View, Alert } from 'react-native';
import React from 'react';
import { useAsyncStorage } from '../../components/useAsyncStorage';
import { NoteForm } from '../../components/NoteForm';
import { NoteData, Tag } from '../../components/types';
import { v4 as uuidV4 } from 'uuid';
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native';

export default function NewNoteScreen() {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);
  const navigation = useNavigation();

  const handleCreateNote = (data: NoteData) => {
    const newNote = { ...data, id: uuidV4() }; // Buat catatan baru dengan ID unik
    setNotes([...notes, newNote]); // Update array catatan dengan catatan baru
    
    console.log('Catatan baru berhasil disimpan:', newNote);
    navigation.goBack(); // Kembali ke layar sebelumnya
  };

  const handleAddTag = (tag: Tag) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags); // Update tags global

    Alert.alert('Berhasil!', `Tag: ${tag} baru berhasil ditambahkan.`);
    console.log('Tag baru berhasil ditambahkan:', tag);
  };

  return (
    <View style={styles.container}>
      <NoteForm
        onSubmit={handleCreateNote}
        onAddTag={handleAddTag}
        availableTags={tags} // Pastikan tag tetap sinkron
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