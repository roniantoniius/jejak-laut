import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextStyle } from 'react-native';
import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import MarkDown from 'react-native-markdown-display';

export default function NoteDetail() {
  const { notes } = useNotes();
  const { id } = useLocalSearchParams(); // Ambil parameter "id" dari route

  const note = notes.find((note) => note.id === id);

  interface MarkdownNode {
    key: string;
    // Add other properties if known
  }
  
  type MarkdownChildren = React.ReactNode;
  
  interface MarkdownParent {
    // Define properties if needed
  }
  
  interface MarkdownStyles {
    [key: string]: TextStyle;
  }
  
  // Then update your customRules:
  
  const customRules = {
    heading1: (node: MarkdownNode, children: MarkdownChildren, parent: MarkdownParent, styles: MarkdownStyles) => (
      <Text key={node.key} style={{fontSize: 32, fontFamily: 'Montserrat-Bold', color: '#052844'}}>
        {children}
      </Text>
    ),
    heading2: (node: MarkdownNode, children: MarkdownChildren, parent: MarkdownParent, styles: MarkdownStyles) => (
      <Text key={node.key} style={{fontSize: 24, fontFamily: 'Montserrat-Bold', color: '#052844'}}>
        {children}
      </Text>
    ),
    heading3: (node: MarkdownNode, children: MarkdownChildren, parent: MarkdownParent, styles: MarkdownStyles) => (
      <Text key={node.key} style={{fontSize: 18, fontFamily: 'Montserrat-SemiBold', color: '#052844'}}>
        {children}
      </Text>
    ),
    strong: (node: MarkdownNode, children: MarkdownChildren, parent: MarkdownParent, styles: MarkdownStyles) => (
      <Text key={node.key} style={{fontFamily: 'Montserrat-Bold'}}>
        {children}
      </Text>
    ),
    em: (node: MarkdownNode, children: MarkdownChildren, parent: MarkdownParent, styles: MarkdownStyles) => (
      <Text key={node.key} style={{fontStyle: 'italic', fontFamily: 'Montserrat-Italic'}}>
        {children}
      </Text>
    ),
  };
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
  );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: 'white' },
    title: { fontSize: 38, marginBottom: 18, fontFamily: 'Montserrat-Bold', color: '#052844', textAlign: 'center' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, justifyContent: 'center' },
    tag: { fontSize: 16, padding: 8, borderRadius: 4, marginRight: 8, marginBottom: 8, fontFamily: 'Montserrat-Bold', color: 'white' },
    locationContainer: { marginTop: 0, marginBottom: 46 },
    location: { fontSize: 14, fontFamily: 'Montserrat-Bold', color: '#052844' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    error: { fontSize: 18, color: 'red', fontFamily: 'Montserrat-Bold' },
    closeButton: {
        backgroundColor: '#B6E5FF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        borderColor: '#052844',
        borderWidth: 1,
    },
    closeButtonText: {
      fontFamily: 'Montserrat-Bold',
      color: '#052844',
      fontSize: 20,
    },
});

const markdownStyle = StyleSheet.create({
  body: {fontFamily: 'Montserrat', color: '#052844'},
});