import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import MarkDown from 'react-native-markdown-display';
import { PopupBawah } from '@/components/PopupBawah';
import { JelaChat } from '@/components/JelaChat';

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
    <>
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
        <MarkDown style={markdownStyle}>
          {note.markdown}
        </MarkDown>
        <View style={styles.locationContainer}>
          <Text style={styles.location}>
            Longitude: {note.longitude}, Latitude: {note.latitude}
          </Text>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Periksa Lokasi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <PopupBawah
        icon={<Text style={styles.iconText}>AI</Text>}
        title="Jela"
        onClose={() => console.log('Popup closed')}
      >
        <JelaChat />
      </PopupBawah>
    </>
  );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: 'white' },
    title: { fontSize: 38, marginBottom: 18, fontFamily: 'Montserrat-Bold', color: '#052844', textAlign: 'center' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center' },
    tag: { fontSize: 16, padding: 8, borderRadius: 4, marginRight: 8, marginBottom: 8, fontFamily: 'Montserrat-Bold', color: 'white' },
    markdown: { fontSize: 16, marginBottom: 16, fontFamily: 'Montserrat-Medium' },
    locationContainer: { marginTop: 0, marginBottom: 46 },
    location: { fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#052844' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    error: { fontSize: 18, color: 'red', fontFamily: 'Montserrat-Bold' },
    closeButton: {
        backgroundColor: '#B6E5FF',
        padding: 6,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#052844',
        borderWidth: 1,
    },
    closeButtonText: {
      fontFamily: 'Montserrat-Bold',
      color: '#052844',
      fontSize: 18,
    },
    iconText: {
      fontSize: 24,
      color: 'white',
      fontFamily: 'Montserrat-Bold',
    },
    placeholderText: {
      textAlign: 'center',
      color: 'gray',
      fontFamily: 'Montserrat-Medium',
    },
});

const markdownStyle = StyleSheet.create({
    body: {
      fontSize: 16,
      color: '#333',
    },
    heading1: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    heading2: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    paragraph: {
      marginBottom: 10,
    },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
  });