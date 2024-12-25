import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useAsyncStorage } from '../../components/useAsyncStorage';
import { NoteForm } from '../../components/NoteForm';
import { NoteData, Tag } from '../../components/types';
import { v4 as uuidV4 } from 'uuid';
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native';
import { EditTagsModal } from '../../components/EditTagsModal';
import { TouchableOpacity } from 'react-native';

export default function NewNoteScreen() {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleCreateNote = (data: NoteData) => {
    const newNote = { ...data, id: uuidV4() };
    setNotes([...notes, newNote]);
    navigation.goBack();
  };

  const handleAddTag = (tag: Tag) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags); // This will update tags in both components
  };

  const handleUpdateTag = (id: string, label: string) => {
    const newTags = tags.map((tag: Tag) => 
      tag.id === id ? { ...tag, label } : tag
    );
    setTags(newTags);
  };

  const handleDeleteTag = (id: string) => {
    const newTags = tags.filter((tag: Tag) => tag.id !== id);
    setTags(newTags);
  };

  return (
    <View style={styles.container}>
      <NoteForm
        onSubmit={handleCreateNote}
        onAddTag={handleAddTag}
        availableTags={tags}
      />
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text>Edit Tags</Text>
      </TouchableOpacity>
      <EditTagsModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        tags={tags}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
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