import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ChatbotData, NoteData } from './types';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';

type Message = {
  id: string;
  text: string;
  role: 'user' | 'jela';
  actionButtons?: { label: string; onPress: () => void }[];
};

type JelaChatProps = {
  noteId: string;
  chatbotData: ChatbotData;
  noteData: NoteData;
};

export function JelaChat({ noteId, chatbotData, noteData }: JelaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { ai_access, daftar_token } = chatbotData;

  const getToken = async () => {
    if (!daftar_token[noteId]) {
      try {
        const response = await axios.post("http://192.168.100.6:5212/api/session/redis/generate_token");
        return response.data.token;
      } catch (error) {
        console.error("Gagal membuat token:", error);
        return null;
      }
    }
    return daftar_token[noteId];
  };

  const addUserMessage = (text: string) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: Date.now().toString(), text: text, role: 'user' },
    ]);
    setInputText('');
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      addUserMessage(inputText.trim());
      const token = await getToken();
      if (token) {
        try {
          const response = await axios.post(
            "http://192.168.100.6:5212/api/jela/chat",
            {
              judul: noteData.title,
              kategori: noteData.tags.map(tag => tag.label).join(", "),
              catatan: noteData.markdown,
              query: inputText.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { apiResponse, result } = response.data.response;
          const fullResponse = `${apiResponse}\n\n${result}`;
          setMessages(prevMessages => [
            ...prevMessages,
            {
              id: (Date.now() + 1).toString(),
              text: fullResponse,
              role: 'jela',
              actionButtons: [
                { label: 'Ubah', onPress: () => console.log('Ubah clicked') },
                { label: 'Tambah', onPress: () => console.log('Tambah clicked') },
                { label: 'Tolak', onPress: () => console.log('Tolak clicked') },
              ],
            },
          ]);
        } catch (error) {
          console.error("Gagal mengirim prompt ke AI:", error);
          setMessages(prev => [
            ...prev,
            { 
              id: (Date.now() + 1).toString(),
              text: "Maaf, kami mengalami kesulitan menghubungi Jela. Silakan coba lagi nanti.",
              role: 'jela'
            }
          ]);
        }
      }
    }
  };

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      text: 'Selamat datang 😁! Kamu lagi ngobrol sama Jela ⛵, yang siap bantu optimalkan catatanmu serta menemani selama diskusi ini.',
      role: 'jela',
    }]);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Render item untuk FlatList
  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.jelaMessage,
      ]}
    >
      {item.role === 'jela' ? (
        <Markdown>
          {item.text}
        </Markdown>
      ) : (
        <Text style={styles.messageText}>{item.text}</Text>
      )}
      {item.actionButtons && (
        <View style={styles.actionButtonContainer}>
          {item.actionButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={button.onPress}
            >
              <Text style={styles.actionButtonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.chatContainer}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatBody}
      />
      <View style={styles.chatFooter}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ketik pesan Anda..."
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    chatContainer: {
      maxHeight: 550,
      borderRadius: 10,
      backgroundColor: '#f5f5f5',
    },
    chatBody: {
      padding: 10,
      flexGrow: 1,
      fontFamily: 'Montserrat',
    },
    messageContainer: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 8,
      maxWidth: '82%',
      fontFamily: 'Montserrat',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#DCF8C6',
      fontFamily: 'Montserrat',
    },
    jelaMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#E0E0E0',
      fontFamily: 'Montserrat',
    },
    messageText: {
      fontSize: 16,
      fontFamily: 'Montserrat-Medium',
    },
    chatFooter: {
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      fontFamily: 'Montserrat',
    },
    inputContainer: {
      flexDirection: 'row',
      fontFamily: 'Montserrat',
      position: 'relative',
    },
    inputField: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginRight: 10,
      fontFamily: 'Montserrat-Medium',
      backgroundColor: '#fff',
    },
    sendButton: {
      padding: 12,
      backgroundColor: '#052844',
      borderRadius: 5,
      justifyContent: 'center',
      fontFamily: 'Montserrat',
    },
    sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Montserrat-Medium',
    },
    actionButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 5,
      fontFamily: 'Montserrat',
    },
    actionButton: {
      padding: 5,
      backgroundColor: '#052844',
      borderRadius: 5,
      marginRight: 5,
      fontFamily: 'Montserrat-Medium',
    },
    actionButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily: 'Montserrat',
    },
  });