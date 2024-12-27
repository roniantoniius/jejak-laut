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
    title: 'Mulai Catatan Jejak Laut Baru',
    details: `Jejak Laut adalah aplikasi sederhana yang memungkinkan para nelayan untuk mencatat kegiatan mereka di laut, seperti jenis kapal, alat tangkap yang digunakan, lokasi (garis bujur dan lintang), serta hasil tangkapan. Dengan menggunakan Jejak Laut, nelayan dapat dengan mudah merekam informasi penting yang dapat digunakan untuk analisis dan pengelolaan kegiatan perikanan.

    Untuk memulai, Anda perlu membuat catatan jejak baru. Caranya cukup mudah: klik tombol + yang terletak di tengah bawah layar. Setelah itu, Anda dapat mulai mengisi data-data yang diperlukan, seperti lokasi, jenis kapal yang digunakan, alat tangkap yang dipakai, serta hasil tangkapan. Setiap catatan yang Anda buat akan memudahkan Anda dalam melacak aktivitas perikanan di masa depan.`,
  },
  {
    id: '2',
    imageSrc: '2.png',
    title: 'Format Kategori yang Efisien',
    details:
      `Mengorganisir data dalam format kategori yang efisien sangat penting untuk memudahkan pencarian dan pengelolaan catatan Anda. Dengan format yang tepat, Anda bisa dengan cepat menemukan informasi yang dibutuhkan dan menghindari kebingungan saat mencatat aktivitas perikanan.

      Sebagai contoh, Anda bisa mengatur urutan kategori dalam catatan Anda mulai dari komoditas yang ditangkap, waktu tangkapan, alat tangkap yang digunakan, dan hasil tangkapan. Alternatif lainnya adalah mengelompokkan data berdasarkan kapal yang digunakan. Pengaturan ini akan membantu Anda mengakses data lebih cepat, baik untuk analisis atau sekadar melihat catatan lama.`,
  },
  {
    id: '3',
    imageSrc: '3.png',
    title: 'AI Mendampingi Jejak Laut Kamu!',
    details:
      `Salah satu fitur utama Jejak Laut adalah penggunaan Generative AI untuk membantu Anda melengkapi catatan yang belum lengkap dan membuat catatan Anda lebih informatif. Dengan bantuan AI, Anda bisa mendapatkan saran otomatis tentang informasi apa yang perlu ditambahkan, seperti waktu tangkapan, alat tangkap yang lebih spesifik, atau lokasi yang lebih akurat.

      Bayangkan Anda baru saja mencatat hasil tangkapan, namun beberapa detail seperti alat tangkap yang digunakan atau lokasi tangkapan terlupakan. Generative AI akan memberikan saran untuk melengkapi informasi tersebut, sehingga catatan Anda menjadi lebih lengkap dan akurat. Fitur ini sangat berguna untuk memastikan bahwa setiap catatan yang Anda buat dapat memberikan informasi yang maksimal dan bermanfaat untuk analisis atau referensi di masa depan.`,
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