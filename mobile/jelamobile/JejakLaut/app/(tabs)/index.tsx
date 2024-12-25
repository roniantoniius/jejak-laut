import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NoteList } from '@/components/NoteList';
import { useAsyncStorage } from '@/components/useAsyncStorage';
import { Tag } from '@/components/types';
import { EditTagsModal } from '@/components/EditTagsModal';
import { PopupCard } from '@/components/PopupCard';

export default function Index() {
  const [tags, setTags] = useAsyncStorage<Tag[]>('TAGS', []);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleUpdateTag = (id: string, label: string) => {
    const updatedTags = tags.map((tag) =>
      tag.id === id ? { ...tag, label } : tag
    );
    setTags(updatedTags);
  };

  const handleDeleteTag = (id: string) => {
    const filteredTags = tags.filter((tag) => tag.id !== id);
    setTags(filteredTags);
  };

  return (
    <View style={styles.container}>
      <NoteList />
      <EditTagsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        tags={tags}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
      <PopupCard
        icon={<Text style={styles.iconText}>+</Text>}
        title="Menu Aksi"
        buttons={[
          {
            label: 'Edit Tags',
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
    position: 'relative',
    paddingTop: 20,
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