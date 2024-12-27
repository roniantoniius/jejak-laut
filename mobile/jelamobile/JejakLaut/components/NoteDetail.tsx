import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNotes } from './NoteContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Tag } from './types';

type NoteDetailParams = {
  NoteDetail: { id: string };
};

export default function NoteDetail() {
  const { notes } = useNotes();
  const route = useRoute<RouteProp<NoteDetailParams, 'NoteDetail'>>();
  const { id } = route.params;

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Note not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{note.title}</Text>

      {/* Tags */}
      {note.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {note.tags.map((tag: Tag) => (
            <Text
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              {tag.label}
            </Text>
          ))}
        </View>
      )}

      {/* Markdown */}
      <Text style={styles.markdown}>{note.markdown}</Text>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Text style={styles.location}>
          Latitude: {note.latitude}, Longitude: {note.longitude}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    color: 'white',
    fontWeight: '600',
  },
  markdown: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  locationContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});