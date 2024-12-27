import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTags } from './TagContext';

type EditTagsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const EditTagsModal: React.FC<EditTagsModalProps> = ({ visible, onClose }) => {
  const { tags, updateTag, deleteTag } = useTags();

  const handleUpdateTag = (id: string, label: string) => {
    updateTag(id, label);
  };

  const handleDeleteTag = (id: string) => {
    deleteTag(id);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ubah Kategori</Text>
          <FlatList
            data={tags}
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
            <Text style={styles.closeButtonText}>Kembali</Text>
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
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
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
    fontFamily: 'Montserrat',
    color: '#052844',
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Montserrat',
    color: '#052844',
  },
  deleteButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  closeButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});