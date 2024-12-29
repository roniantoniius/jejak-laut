import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';

type PopupBawahProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export function PopupBawah({ icon, title, children }: PopupBawahProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Floating Button */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <View style={styles.buttonShape}>
          {icon}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{title}</Text>
              {children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    zIndex: 900,
  },
  floatingButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 15,
  },
  buttonShape: {
    backgroundColor: '#052844',
    width: 60,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center', // Mengubah ini untuk memusatkan modal
    alignItems: 'center', // Mengubah ini untuk memusatkan modal
    backgroundColor: 'rgba(0,0,0,0.5)', // Background semi-transparan untuk modal
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%', // Lebar modal sesuai dengan kebutuhan, di sini 80% dari lebar layar
    maxWidth: 400, // Maksimal lebar modal
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  content: {
    marginBottom: 15,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
});