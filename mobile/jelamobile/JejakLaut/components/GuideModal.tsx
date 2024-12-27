import React from 'react';
import { Modal, View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const images = {
  '1.png': require('../assets/images/1.png'),
  '2.png': require('../assets/images/2.png'),
  '3.png': require('../assets/images/3.png'),
};

type GuideModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Step = {
  id: string;
  imageSrc: keyof typeof images; // Ensures imageSrc matches a key in images
  description: string;
};

const steps: Step[] = [
  { id: '1', imageSrc: '1.png', description: 'Buat Catatan Jejak Baru Kamu!' },
  { id: '2', imageSrc: '2.png', description: 'Format Kategori Yang Efisien' },
  { id: '3', imageSrc: '3.png', description: 'Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!' },
];

export const GuideModal: React.FC<GuideModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Panduan Jejak Laut</Text>
          <FlatList
            data={steps}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.stepContainer}>
                <Image source={images[item.imageSrc]} style={styles.image} />
                <Text style={styles.stepText}>{`${item.id}. ${item.description}`}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});