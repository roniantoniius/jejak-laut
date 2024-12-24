import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Tag } from '@/components/types';

type EditTagsProps = {
  show: boolean;
  tags: Tag[];
  onClose: () => void;
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
  visible: boolean;
};

export function EditTags({ show, tags, onClose, onUpdateTag, onDeleteTag }: EditTagsProps) {
  const [editedTags, setEditedTags] = useState<Tag[]>(tags);

  const handleUpdateTag = (id: string, label: string) => {
    onUpdateTag(id, label);
    setEditedTags((prevTags) =>
      prevTags.map((tag) => (tag.id === id ? { ...tag, label } : tag))
    );
  };

  const handleDeleteTag = (id: string) => {
    onDeleteTag(id);
    setEditedTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

  return (
    <Modal visible={show} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ubah Kategori</Text>
          <FlatList
            data={editedTags}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tagContainer}>
                <TextInput
                  style={styles.tagInput}
                  value={item.label}
                  onChangeText={(text) => handleUpdateTag(item.id, text)}
                />
                <TouchableOpacity onPress={() => handleDeleteTag(item.id)}>
                  <Text style={styles.deleteButton}>&times;</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginRight: 10,
    flex: 1,
  },
  deleteButton: {
    color: 'red',
    fontSize: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
