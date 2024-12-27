import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { EditTagsModal } from '@/components/EditTagsModal';
import { GuideModal } from '@/components/GuideModal';
import { PopupCard } from '@/components/PopupCard';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';

export default function Index() {
  const { tags } = useTags();
  const { notes } = useNotes();
  const [isEditTagsVisible, setEditTagsVisible] = useState(false);
  const [isGuideVisible, setGuideVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Note List */}
      <NoteList tags={tags} notes={notes} />

      {/* Edit Tags Modal */}
      <EditTagsModal
        visible={isEditTagsVisible}
        onClose={() => setEditTagsVisible(false)}
      />

      {/* Guide Modal */}
      <GuideModal
        visible={isGuideVisible}
        onClose={() => setGuideVisible(false)}
      />

      {/* Unified Popup Card */}
      <PopupCard
        icon={<Text style={styles.iconText}>?</Text>}
        title="Menu Jejak Laut"
        buttons={[
          {
            label: 'Ubah Kategori',
            onPress: () => setEditTagsVisible(true),
            style: styles.addButton,
            textStyle: styles.addButtonText,
          },
          {
            label: 'Panduan',
            onPress: () => setGuideVisible(true),
            style: styles.guideButton,
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
  guideButton: {
    backgroundColor: '#4CAF50', // Green button for guide
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
});