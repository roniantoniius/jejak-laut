// app/(tabs)/newnote.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTags } from '../../components/TagContext';
import { useNotes } from '../../components/NoteContext';
import { NoteForm } from '../../components/NoteForm';
import { NoteData, NewNoteRouteProp } from '../../components/types';
import { v4 as uuidV4 } from 'uuid';
import 'react-native-get-random-values';

export default function NewNoteScreen() {
  const { tags, addTag } = useTags();
  const { addNote } = useNotes();
  const navigation = useNavigation();
  const route = useRoute<NewNoteRouteProp>();

  const handleCreateNote = (data: NoteData) => {
    const newNote = { ...data, id: uuidV4() };
    addNote(newNote);
    console.log('Catatan baru berhasil disimpan:', newNote);
    navigation.goBack();
  };

  const latitude = route.params?.latitude || 0;
  const longitude = route.params?.longitude || 0;

  return (
    <View style={styles.container}>
      <NoteForm 
        onSubmit={handleCreateNote}
        onAddTag={(tag) => addTag(tag)} 
        availableTags={tags}
        latitude={latitude}
        longitude={longitude}
        navigation={navigation}
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