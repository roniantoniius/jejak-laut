// components/JelaChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';

type ChatMessage = {
  id: number;
  role: "user" | "jela";
  message: string;
  buttonsDisabled?: boolean;
};

type JelaChatProps = {
  noteId: string;
  // Definisi fungsi callback dan data lainnya bisa ditambahkan sesuai kebutuhan
};

export function JelaChat({ noteId }: JelaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Simulasi pesan awal dari Jela jika diinginkan
    // setMessages([{ id: 1, role: "jela", message: "Halo! Saya Jela, siap membantu Anda." }]);
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      message: inputText
    };
    setMessages([...messages, newMessage]);

    // Simulasi respon dari Jela
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, {
        id: prevMessages.length + 1,
        role: "jela",
        message: "Jela Jela Jela!",
        buttonsDisabled: false
      }]);
    }, 1000);

    setInputText("");
  };

  const handleButtonClick = (messageId: number, action: string) => {
    // Logika untuk tombol-tombol, bisa dikembangkan lebih lanjut
    console.log(`Button ${action} clicked for message ${messageId}`);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View style={item.role === "user" ? styles.userMessage : styles.jelaMessage}>
      {item.role === "jela" ? (
        <>
          <Image source={require('../assets/dark-nobg.png')} style={styles.jelaProfilePic} />
          <View style={styles.messageContainer}>
            <Text style={styles.jelaText}>{item.message}</Text>
            <View style={styles.buttonContainer}>
              {['Ubah', 'Tambah', 'Tidak'].map((label, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.button, item.buttonsDisabled && styles.disabledButton]}
                  onPress={() => handleButtonClick(item.id, label.toLowerCase())}
                  disabled={item.buttonsDisabled}
                >
                  <Text style={styles.buttonText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.userText}>{item.message}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.chatContainer}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatBody}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.chatFooter}>
        {isLocked ? (
          <TouchableOpacity 
            style={styles.unlockButton}
            onPress={() => setIsLocked(false)}
          >
            <Text style={styles.unlockButtonText}>Selesaikan Dengan AI</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Tulis pesanmu..."
              value={inputText}
              onChangeText={setInputText}
              editable={!isInputDisabled}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={isInputDisabled}
            >
              <Text style={styles.sendButtonText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatBody: {
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  jelaMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  messageContainer: {
    flex: 1,
  },
  jelaProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  jelaText: {
    fontSize: 16,
    color: '#000',
  },
  userText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  unlockButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  inputField: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sendButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});