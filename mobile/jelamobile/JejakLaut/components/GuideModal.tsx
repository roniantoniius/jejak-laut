import React, { useState } from 'react';
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
  imageSrc: keyof typeof images;
  title: string;
  details: string;
};

const steps: Step[] = [
  {
    id: '1',
    imageSrc: '1.png',
    title: 'Buat Catatan Jejak Baru Kamu!',
    details:
      'Panduan ini membantu kamu membuat catatan jejak baru. Kamu dapat memulai dengan menambahkan detail seperti lokasi, jenis kapal, alat tangkap yang digunakan, dan hasil tangkapan.',
  },
  {
    id: '2',
    imageSrc: '2.png',
    title: 'Format Kategori Yang Efisien',
    details:
      'Pelajari cara mengorganisasi data catatan kamu dengan format kategori yang efisien. Ini akan mempermudah pengelolaan data untuk diakses kembali di kemudian hari.',
  },
  {
    id: '3',
    imageSrc: '3.png',
    title: 'Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!',
    details:
      'Manfaatkan fitur AI untuk memberikan saran otomatis terkait informasi yang perlu kamu tambahkan ke catatan. Ini membantu memastikan catatanmu lengkap dan akurat.',
  },
];

export const GuideModal: React.FC<GuideModalProps> = ({ visible, onClose }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Panduan Jejak Laut</Text>
          <FlatList
            data={steps}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.accordionContainer}>
                <TouchableOpacity
                  onPress={() => toggleAccordion(item.id)}
                  style={styles.accordionHeader}
                >
                  <Image source={images[item.imageSrc]} style={styles.image} />
                  <Text style={styles.stepTitle}>{item.title}</Text>
                </TouchableOpacity>
                {expanded === item.id && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.detailsText}>{item.details}</Text>
                  </View>
                )}
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
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#333',
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