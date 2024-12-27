import React, { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoteCard } from './NoteCard';
import { NoteData, Tag } from './types';

type NoteListProps = {
  tags: Tag[];
  notes: NoteData[];
};

export function NoteList({ tags, notes }: NoteListProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTag, setSearchTag] = useState('');

  const handlePressNote = (id: string) => {
    console.log(`Note pressed: ${id}`);
  };

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const titleMatch = note.title
          .toLowerCase()
          .includes(searchTitle.toLowerCase());
        const tagMatch = note.tags.some((tag) =>
          tag.label.toLowerCase().includes(searchTag.toLowerCase())
        );
        return titleMatch && (searchTag === '' || tagMatch);
      })
      .sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );
  }, [notes, searchTitle, searchTag]);

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.iconInputContainer}>
        <Ionicons name="search" size={20} color="#052844" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cari Judul..."
          onChangeText={setSearchTitle}
          value={searchTitle}
          placeholderTextColor="#052844"
        />
      </View>
      <View style={styles.iconInputContainer}>
        <Ionicons
          name="pricetag-outline"
          size={20}
          color="#052844"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Cari Tag..."
          onChangeText={setSearchTag}
          value={searchTag}
          placeholderTextColor="#052844"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        style={styles.lisTo}
        ListHeaderComponent={renderHeader}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#052844',
  },
  lisTo: {
    padding: 10,
  },
});