import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Tag } from './types';

type EditTagsModalProps = {
  visible: boolean;
  onClose: () => void;
  tags: Tag[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

export const EditTagsModal: React.FC<EditTagsModalProps> = ({ visible, onClose, tags, onUpdateTag, onDeleteTag }) => {
  const [localTags, setLocalTags] = useState<Tag[]>(tags);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleUpdateTag = (id: string, label: string) => {
    setLocalTags((prev) => prev.map(tag => (tag.id === id ? { ...tag, label } : tag)));
    onUpdateTag(id, label);
  };

  const handleDeleteTag = (id: string) => {
    setLocalTags((prev) => prev.filter(tag => tag.id !== id));
    onDeleteTag(id);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Tags</Text>
          <FlatList
            data={localTags}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tagRow}>
                <TextInput
                  style={styles.input}
                  value={item.label}
                  onChangeText={(text) => handleUpdateTag(item.id, text)}
                />
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTag(item.id)}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});