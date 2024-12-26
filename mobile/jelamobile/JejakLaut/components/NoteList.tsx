import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { NoteCard } from './NoteCard';
import { NoteData, Tag } from './types';

type NoteListProps = {
  tags: Tag[];
  notes: NoteData[]; // Add this line
};

export function NoteList({ tags, notes }: NoteListProps) {
  const handlePressNote = (id: string) => {
    console.log(`Note pressed: ${id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes} // Use the notes prop directly
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
});