import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { NoteCard } from './NoteCard';
import { NoteData, Tag } from './types';
import { SearchBar } from './SearchBar';
import { useNavigation } from 'expo-router';

type NoteListProps = {
  tags: Tag[];
  notes: NoteData[];
};

export function NoteList({ tags, notes }: NoteListProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const navigation = useNavigation<any>();

  // Filter Notes Using useMemo
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

  const handlePressNote = useCallback(
    (id: string) => {
      navigation.navigate('NoteDetail', { id }); // Navigasi ke NoteDetail dengan ID
    },
    [navigation]
  );
  
  return (
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
      ListHeaderComponent={
        <SearchBar
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          searchTag={searchTag}
          setSearchTag={setSearchTag}
        />
      }
      keyboardShouldPersistTaps="handled"
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
});