import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';

export default function NoteDetail() {
  const { notes } = useNotes();
  const { id } = useLocalSearchParams(); // Ambil parameter "id" dari route

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      {note.tags.length > 0 && (
        <View style={styles.tagContainer}>
          {note.tags.map((tag) => (
            <Text
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              {tag.label}
            </Text>
          ))}
        </View>
      )}
      <Text style={styles.markdown}>{note.markdown}</Text>
      <View style={styles.locationContainer}>
        <Text style={styles.location}>
          Latitude: {note.latitude}, Longitude: {note.longitude}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 35, fontWeight: 'bold', marginBottom: 8, fontFamily: 'Montserrat-Bold', color: '#052844' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  tag: { padding: 8, borderRadius: 4, marginRight: 8, marginBottom: 8, fontFamily: 'Montserrat-Bold', color: 'white' },
  markdown: { fontSize: 16, marginBottom: 16, fontFamily: 'Montserrat-Medium' },
  locationContainer: { marginTop: 0, marginBottom: 46 },
  location: { fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#052844' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 18, color: 'red', fontFamily: 'Montserrat-Bold' },
});