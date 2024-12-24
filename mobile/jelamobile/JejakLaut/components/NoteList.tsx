import React, { useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useAsyncStorage } from './useAsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoteCard } from './NoteCard';
import { NoteData } from './types';
import { useFocusEffect } from '@react-navigation/native';

export function NoteList() {
  const [notes, setNotes] = useAsyncStorage<NoteData[]>('NOTES', []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const storedNotes = await AsyncStorage.getItem('NOTES');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      })();
    }, [])
  );

  const handlePressNote = (id: string) => {
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
    backgroundColor: 'white',
  },
});
