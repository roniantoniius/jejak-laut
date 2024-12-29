import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

type Message = {
  id: string;
  text: string;
  role: 'user' | 'jela';
  actionButtons?: { label: string; onPress: () => void }[];
};

type JelaChatProps = {};

export function JelaChat({}: JelaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Fungsi untuk menambahkan pesan dari pengguna
  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      role: 'user',
    };
    setMessages(prevMessages => [...prevMessages, newMessage, { id: (Date.now() + 1).toString(), text: 'Jela Jela Jela!', role: 'jela', actionButtons: [
      { label: 'Ubah', onPress: () => console.log('Ubah clicked') },
      { label: 'Tambah', onPress: () => console.log('Tambah clicked') },
      { label: 'Tolak', onPress: () => console.log('Tolak clicked') },
    ] }]);
    setInputText('');
  };

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (inputText.trim()) {
      addUserMessage(inputText.trim());
    }
  };

  // Efek untuk scroll otomatis ke pesan terbaru
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Render item untuk FlatList
  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.role === 'user' ? styles.userMessage : styles.jelaMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.actionButtons && (
        <View style={styles.actionButtonContainer}>
          {item.actionButtons.map((button, index) => (
            <TouchableOpacity key={index} style={styles.actionButton} onPress={button.onPress}>
              <Text style={styles.actionButtonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ketik pesan Anda..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    maxWidth: '70%',
  },
  jelaMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#052844',
    borderRadius: 5,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#052844',
    borderRadius: 5,
    marginRight: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});