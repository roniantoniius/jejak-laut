import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

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
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.popup}>
                <Text style={styles.title}>{title}</Text>
                {children && <View style={styles.content}>{children}</View>}
              </View>
            </TouchableWithoutFeedback>
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
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonShape: {
    backgroundColor: '#052844',
    width: 60,
    height: 60,
    // Mengatur borderRadius untuk membentuk bentuk yang diinginkan
    borderTopLeftRadius: 30, // Sudut kiri atas bulat
    borderTopRightRadius: 30, // Sudut kanan atas bulat
    borderBottomLeftRadius: 30, // Sudut kiri bawah bulat
    borderBottomRightRadius: 8, // Sudut kanan bawah hampir persegi
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 60,
    marginRight: 10,
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: 220,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
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