import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, View, StyleSheet, Alert } from 'react-native';
import { NoteCard } from './NoteCard';
import { NoteData, Tag } from './types';
import { SearchBar } from './SearchBar';
import { router, useNavigation } from 'expo-router';


type NoteListProps = {
  tags: Tag[];
  notes: NoteData[];
  onDelete: (id: string) => void;
};

export function NoteList({ notes, onDelete }: NoteListProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTag, setSearchTag] = useState('');

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

  const handlePressNote = useCallback((id: string) => {
    router.push({
      pathname: '/note/[id]', // Sesuai struktur folder dynamic route
      params: { id }, // Kirim parameter id
    });
  }, []);
  
  
  return (
    <FlatList
      data={filteredNotes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteCard
          id={item.id}
          title={item.title}
          gambar={item.gambar}
          tags={item.tags}
          longitude={item.longitude}
          latitude={item.latitude}
          lastModified={item.lastModified}
          onPress={() => handlePressNote(item.id)}
          onDelete={onDelete}
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
    marginBottom: 70,
  },
});