import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

type PopupCardProps = {
  icon: React.ReactNode;
  title: string;
  buttons: { label: string; onPress: () => void; style?: object; textStyle?: object }[];
  children?: React.ReactNode; // Add this to accept child components
};

export function PopupCard({ icon, title, buttons, children }: PopupCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Floating Button */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setIsOpen(!isOpen)}
      >
        {icon}
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
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, button.style]}
                    onPress={() => {
                      button.onPress();
                      setIsOpen(false);
                    }}
                  >
                    <Text style={[styles.buttonText, button.textStyle]}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
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
    top: -55,
    right: 10,
    zIndex: 1100,
  },
  floatingButton: {
    backgroundColor: '#052844',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
  button: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});