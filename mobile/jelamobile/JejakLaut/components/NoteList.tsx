import React, { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, TextInput, Text } from 'react-native';
import { NoteCard } from './NoteCard';
import { NoteData, Tag } from './types';

type NoteListProps = {
  tags: Tag[];
  notes: NoteData[];
};

export function NoteList({ tags, notes }: NoteListProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTag, setSearchTag] = useState('');

  // Function to handle note press
  const handlePressNote = (id: string) => {
    console.log(`Note pressed: ${id}`);
  };

  // Filter notes based on search criteria
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(searchTitle.toLowerCase());
      const tagMatch = note.tags.some(tag => tag.label.toLowerCase().includes(searchTag.toLowerCase()));
      return titleMatch && (searchTag === '' || tagMatch);
    }).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  }, [notes, searchTitle, searchTag]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Cari Judul..." 
          onChangeText={setSearchTitle} 
          value={searchTitle}
          placeholderTextColor={'#052844'}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Cari Tag..." 
          onChangeText={setSearchTag} 
          value={searchTag}
          placeholderTextColor={'#052844'}
        />
      </View>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            id={item.id}
            title={item.title}
            tags={item.tags}
            longitude={item.longitude}
            latitude={item.latitude}
            lastModified={item.lastModified}
            onPress={handlePressNote}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 63,
  },
  searchContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#e4e4e4',
  },
});