import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { EditTagsModal } from '@/components/EditTagsModal';
import { PopupCard } from '@/components/PopupCard';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';
import { GuideStep } from '@/components/GuideStep';
import { TouchableOpacity } from 'react-native';

export default function Index() {
  const { tags } = useTags();
  const { notes } = useNotes();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsGuideExpanded(!isGuideExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Accordion for Guide */}
      <TouchableOpacity onPress={toggleAccordion}>
        <Text style={styles.accordionTitle}>Panduan Jejak Laut</Text>
      </TouchableOpacity>
      {isGuideExpanded && (
        <View style={styles.guideStepsContainer}>
          <GuideStep stepNumber={1} imageSrc="1.png" description='Buat Catatan Jejak Baru Kamu!' />
          <GuideStep stepNumber={2} imageSrc="2.png" description='Format Kategori Yang Efisien' />
          <GuideStep stepNumber={3} imageSrc="3.png" description='Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!' />
        </View>
      )}

      {/* Note List */}
      <NoteList tags={tags} notes={notes} />

      {/* Edit Tags Modal */}
      <EditTagsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Existing Menu Popup Card */}
      <PopupCard
        icon={<Text style={styles.iconText}>+</Text>}
        title="Menu Jejak Laut"
        buttons={[
          {
            label: 'Ubah Kategori',
            onPress: () => setModalVisible(true),
            style: styles.addButton,
            textStyle: styles.addButtonText,
          },
        ]}
      />

      {/* New Guide Popup Card */}
      <PopupCard
        icon={<Text style={[styles.iconText, { right: 0, bottom: 0, position: 'absolute' }]}>?</Text>}
        title="Panduan Jejak Laut"
        buttons={[
          {
            label: 'Tutup',
            onPress: () => {}, // No action, just close the modal
            style: { ...styles.addButton, backgroundColor: '#4CAF50' }, // Green for contrast
            textStyle: styles.addButtonText,
          },
        ]}
      >
        {/* Content of the Guide in Popup */}
        <View style={styles.guidePopupContent}>
          <GuideStep stepNumber={1} imageSrc="1.png" description='Buat Catatan Jejak Baru Kamu!' />
          <GuideStep stepNumber={2} imageSrc="2.png" description='Format Kategori Yang Efisien' />
          <GuideStep stepNumber={3} imageSrc="3.png" description='Gunakan AI Untuk Melengkapi Catatan Jejak Laut Kamu!' />
        </View>
      </PopupCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
  accordionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  guideStepsContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  guidePopupContent: {
    backgroundColor: 'white',
    padding: 10,
    maxHeight: '80%', // Adjust if needed
    overflow: 'scroll',
  },
});