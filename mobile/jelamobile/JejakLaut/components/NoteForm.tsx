import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { NoteData, Tag } from './types';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
  title?: string;
  markdown?: string;
  tags?: Tag[];
  latitude?: number;
  longitude?: number;
};

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = '',
  markdown = '',
  tags = [],
  latitude = 0,
  longitude = 0,
}: NoteFormProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteMarkdown, setNoteMarkdown] = useState(markdown);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);

  const handleSubmit = () => {
    onSubmit({
      title: noteTitle,
      markdown: noteMarkdown,
      tags: selectedTags,
      longitude: lng,
      latitude: lat,
      lastModified: new Date().toISOString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={noteTitle}
        onChangeText={setNoteTitle}
      />

      <Text style={styles.label}>Badan Catatan</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        value={noteMarkdown}
        onChangeText={setNoteMarkdown}
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(lat)}
        onChangeText={(text) => setLat(parseFloat(text) || 0)}
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(lng)}
        onChangeText={(text) => setLng(parseFloat(text) || 0)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Simpan" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
