import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { EditTagsModal } from '@/components/EditTagsModal';
import { PopupCard } from '@/components/PopupCard';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';
import { GuideStep } from '@/components/GuideStep';

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
      <NoteList tags={tags} notes={notes} />
      <EditTagsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
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
});