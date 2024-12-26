import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { EditTagsModal } from '@/components/EditTagsModal';
import { PopupCard } from '@/components/PopupCard';
import { useTags } from '@/components/TagContext';
import { useNotes } from '@/components/NoteContext';

export default function Index() {
  const { tags } = useTags();
  const { notes } = useNotes();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
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
});