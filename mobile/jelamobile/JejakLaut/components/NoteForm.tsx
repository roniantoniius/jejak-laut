import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { NoteData, Tag } from './types';

const COLOR_OPTIONS = ['#FF5733', '#33FF57', '#3357FF', '#FFC300', '#8E44AD'];

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
  title?: string;
  markdown?: string;
  tags?: Tag[];
  latitude?: number;
  longitude?: number;
};

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = '',
  markdown = '',
  tags = [],
  latitude = 0,
  longitude = 0,
}: NoteFormProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteMarkdown, setNoteMarkdown] = useState(markdown);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tags.map((tag) => tag.id)
  );
  const [tagOptions, setTagOptions] = useState(
    availableTags.map((tag) => ({ label: tag.label, value: tag.id, color: tag.color }))
  );
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);

  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [newTagText, setNewTagText] = useState(''); // State untuk tag baru
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [pendingTag, setPendingTag] = useState<Tag | null>(null);

  const handleCreateTag = () => {
    if (!newTagText.trim()) {
      Alert.alert('Error', 'Nama tag tidak boleh kosong.');
      return;
    }

    const newTag: Tag = { id: `${Date.now()}`, label: newTagText.trim(), color: '' };
    setPendingTag(newTag);
    setIsColorPickerVisible(true); // Tampilkan modal untuk memilih warna
  };

  const handleColorSelect = (color: string) => {
    if (pendingTag) {
      const updatedTag = { ...pendingTag, color };
      onAddTag(updatedTag);
      setTagOptions((prev) => [
        ...prev,
        { label: updatedTag.label, value: updatedTag.id, color: updatedTag.color },
      ]);
      setSelectedTags((prev) => [...prev, updatedTag.id]);
      setPendingTag(null);
      setNewTagText(''); // Reset input tag baru
      Alert.alert('Tag Baru Dibuat', `Tag "${updatedTag.label}" berhasil ditambahkan.`);
    }
    setIsColorPickerVisible(false);
  };

  const handleSubmit = () => {
    const noteTags = tagOptions
      .filter((option) => selectedTags.includes(option.value))
      .map((option) => ({ id: option.value, label: option.label, color: option.color }));

    onSubmit({
      title: noteTitle,
      markdown: noteMarkdown,
      tags: noteTags,
      longitude: lng,
      latitude: lat,
      lastModified: new Date().toISOString(),
      id: ''
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={noteTitle}
        onChangeText={setNoteTitle}
      />

      <Text style={styles.label}>Kategori</Text>
      <DropDownPicker
        open={isTagPickerOpen}
        setOpen={setIsTagPickerOpen}
        items={tagOptions.map((tag) => ({
          label: tag.label,
          value: tag.value,
          icon: () => (
            <View style={[styles.tagColor, { backgroundColor: tag.color }]} />
          ),
        }))}
        value={selectedTags}
        setValue={setSelectedTags}
        setItems={setTagOptions}
        multiple={true}
        mode="BADGE"
        placeholder="Pilih tag"
        searchable={true}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {/* Input untuk tag baru */}
      <View style={styles.newTagContainer}>
        <TextInput
          style={styles.newTagInput}
          placeholder="Tambah tag baru"
          value={newTagText}
          onChangeText={setNewTagText}
        />
        <Button title="Tambah" onPress={handleCreateTag} />
      </View>

      <Text style={styles.label}>Badan Catatan</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        value={noteMarkdown}
        onChangeText={setNoteMarkdown}
      />

      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(lat)}
        onChangeText={(text) => setLat(parseFloat(text) || 0)}
      />

      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(lng)}
        onChangeText={(text) => setLng(parseFloat(text) || 0)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Simpan" onPress={handleSubmit} />
      </View>

      {/* Modal untuk memilih warna */}
      <Modal visible={isColorPickerVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Warna Tag</Text>
            <FlatList
              data={COLOR_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.colorOption, { backgroundColor: item }]}
                  onPress={() => handleColorSelect(item)}
                />
              )}
              numColumns={3}
              contentContainerStyle={styles.colorGrid}
            />
            <Button title="Batal" onPress={() => setIsColorPickerVisible(false)} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  newTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    fontSize: 16,
  },
  tagColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: '#000',
  },
  colorGrid: {
    alignItems: 'center',
    marginBottom: 16,
  },
  colorOption: {
    width: 50,
    height: 50,
    margin: 8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
});