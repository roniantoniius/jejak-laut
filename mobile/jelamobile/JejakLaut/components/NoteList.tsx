import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useAsyncStorage } from './useAsyncStorage';
import { NoteCard } from './NoteCard';
import { NoteData } from './types';

export function NoteList() {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);

  const handlePressNote = (id: string) => {
    // Navigasi atau aksi lain ketika catatan diklik
    console.log(`Note pressed: ${id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
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
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
});