import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNotes } from '@/components/NoteContext';
import { useLocalSearchParams } from 'expo-router';
import MarkDown from 'react-native-markdown-display';
import { PopupBawah } from '@/components/PopupBawah';
import { JelaChat } from '@/components/JelaChat';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList,  ChatbotData } from '@/components/types';

export default function NoteDetail() {
  const { notes } = useNotes();
  const { id } = useLocalSearchParams(); // Ambil parameter "id" dari route
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('edit/[id]', { id: note.id });
  };

  const handlePeriksaLokasi = () => {
    navigation.navigate('periksalokasi/[id]', { id: note.id });
  };

  const handleMarkdownLongPress = () => {
    handleEdit();
  };

  // Assuming chatbotData is somehow available or stored in Note or NoteData
  const defaultChatbotData: ChatbotData = { ai_access: 0, daftar_token: {} };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Display the image if it exists */}
        {note.gambar && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: note.gambar }} style={styles.imageInCard} />
          </View>
        )}
        <Text style={styles.title} selectable>{note.title}</Text>
        {note.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {note.tags.map((tag) => (
              <Text
                key={tag.id}
                selectable
                style={[styles.tag, { backgroundColor: tag.color }]}
              >
                {tag.label}
              </Text>
            ))}
          </View>
        )}
        <TouchableOpacity onLongPress={handleMarkdownLongPress}>
          <MarkDown style={markdownStyle}>
            {note.markdown}
          </MarkDown>
          <View style={styles.locationContainer}>
            <Text style={styles.location} selectable>
              Longlat: {note.longitude}, {note.latitude}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity onPress={handlePeriksaLokasi} style={[styles.floatingButton, styles.locationButton]}>
          <Text style={styles.floatingButtonText}>Lokasi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={[styles.floatingButton, styles.editButton]}>
          <Text style={styles.floatingButtonText}>Ubah</Text>
        </TouchableOpacity>
      </View>
      <PopupBawah
        icon={<Text style={styles.iconText}>AI</Text>}
        title="Jela"
        subtitle="Llama-3.3-70b-versatile"
        onClose={() => {}}
      >
        <View style={{ width: '100%' }}>
          <JelaChat 
            noteId={note.id} 
            chatbotData={defaultChatbotData} 
            noteData={note} 
          />
        </View>
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
    location: { fontSize: 18, fontFamily: 'Montserrat-Bold', color: '#052844' },
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
      fontSize: 15,
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
    editButton: {
      backgroundColor: '#052844',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    editButtonText: {
      color: 'white',
      fontSize: 16,
    },
    imageContainer: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
    },
    imageInCard: {
      width: '100%',
      height: 200, // Adjust height as needed
      resizeMode: 'cover',
    },
    floatingButtonsContainer: {
      position: 'absolute',
      bottom: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
    },
    floatingButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      marginHorizontal: 12,
    },
    locationButton: {
      backgroundColor: '#4CAF50',
      borderColor: '#052844',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      borderWidth: 1,
    },
    floatingButtonText: {
      color: 'white',
      fontFamily: 'Montserrat-Bold',
      fontSize: 18,
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