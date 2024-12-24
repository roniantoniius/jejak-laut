import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PopupCard } from '@/components/PopupCard';
import { NoteList } from '@/components/NoteList';
import { useAsyncStorage } from '@/components/useAsyncStorage';
import { Tag } from '@/components/types';
import { EditTags } from '@/components/EditTags';

// Definisikan tipe navigasi
type RootStackParamList = {
  index: undefined;
  newnote: undefined; // Sesuaikan dengan Tabs.Screen
  konfigurasi: undefined;
};

export default function Index() {
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);
  const [showEditTagsModal, setShowEditTagsModal] = useState(false);

  const handleUpdateTag = (id: string, label: string) => {
    setTags((prevTags) => 
      prevTags.map((tag) => (tag.id === id ? { ...tag, label } : tag))
    );
  };

  const handleDeleteTag = (id: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

  return (
    <View style={styles.container}>
      <NoteList />
      <PopupCard
        icon={<Text style={styles.iconText}>+</Text>}
        title="Menu Aksi"
        buttons={[
          {
            label: 'Ubah Kategori',
            onPress: () => setShowEditTagsModal(true),
            style: styles.editButton,
            textStyle: styles.editButtonText,
          },

        ]}
      />
      <EditTags
        show={showEditTagsModal}
        tags={tags}
        onClose={() => setShowEditTagsModal(false)}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    paddingTop: 20,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  editButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});