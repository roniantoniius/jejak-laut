import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, Alert, TouchableOpacity, Modal, FlatList, Platform} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { NewNoteRouteProp, NoteData, Tag } from './types';
import { useRoute } from '@react-navigation/native';

const COLOR_OPTIONS = ['#FF5733', '#ed9e2f', '#052844', '#B6E5FF', '#18de8c'];

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
  title?: string;
  markdown?: string;
  tags?: Tag[];
  latitude?: number;
  longitude?: number;
  navigation?: any;
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
  navigation,
}: NoteFormProps) {
  const [noteTitle, setNoteTitle] = useState(title);
  const [noteMarkdown, setNoteMarkdown] = useState(markdown);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tags.map((tag) => tag.id)
  );
  const [tagOptions, setTagOptions] = useState(
    availableTags.map((tag) => ({ label: tag.label, value: tag.id, color: tag.color }))
  );
  const initialLat = latitude ?? 0;
  const initialLng = longitude ?? 0;
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [newTagText, setNewTagText] = useState(''); // State untuk tag baru
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [pendingTag, setPendingTag] = useState<Tag | null>(null);

  const route = useRoute<NewNoteRouteProp>(); // Menangkap route params

  useEffect(() => {
    if (route.params?.latitude !== undefined && route.params?.longitude !== undefined) {
      setLat(route.params.latitude);
      setLng(route.params.longitude);
    }
  }, [route.params]);

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
      id: '',
    });
  
    // Reset form setelah submit
    setNoteTitle('');
    setNoteMarkdown('');
    setSelectedTags([]);
    setLat(0);
    setLng(0);
  };

  const handlePickLocation = () => {
    if (navigation) {
      navigation.navigate('pilihlokasi');
    } else {
      Alert.alert('Error', 'Navigation not available.');
    }
  };

  useEffect(() => {
    // Mengisi state dengan data yang dikirim dari PickLocation
    if (navigation && navigation.getParam) {
      const lat = navigation.getParam('latitude');
      const lng = navigation.getParam('longitude');
      if (lat !== undefined && lng !== undefined) {
        setLat(lat);
        setLng(lng);
      }
    }
  }, [navigation]);

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
        placeholderStyle={styles.placeholder}
      />

      {/* Input untuk tag baru */}
      <View style={styles.newTagContainer}>
        <TextInput
          style={styles.newTagInput}
          placeholder="Tambah tag baru"
          value={newTagText}
          onChangeText={setNewTagText}
        />
        <TouchableOpacity style={styles.addButtonSmall} onPress={handleCreateTag}>
          <Text style={styles.addButtonSmallText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Badan Catatan</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        value={noteMarkdown}
        onChangeText={setNoteMarkdown}
      />

      <View style={styles.locationContainer}>
        <View style={styles.locationInputContainer}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(lng)}
            onChangeText={(text) => setLng(parseFloat(text) || 0)}
          />
        </View>

        <View style={styles.locationInputContainer}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(lat)}
            onChangeText={(text) => setLat(parseFloat(text) || 0)}
          />
        </View>

        <TouchableOpacity style={styles.pickLocationButton} onPress={handlePickLocation}>
          <Text style={styles.pickLocationButtonText}>Lokasi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Simpan</Text>
      </TouchableOpacity>

      {/* Modal untuk memilih warna */}
      <Modal visible={isColorPickerVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Warna Kategori</Text>
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
            <TouchableOpacity style={styles.addButton} onPress={() => setIsColorPickerVisible(false)}>
              <Text style={styles.addButtonText}>Batal</Text>
            </TouchableOpacity>
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
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Montserrat',
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  newTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'Montserrat',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    fontFamily: 'Montserrat-Bold',
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
  addButton: {
    backgroundColor: '#052844',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 20,
  },
  addButtonSmall: {
    backgroundColor: '#052844',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '25%',
  },
  addButtonSmallText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
  placeholder: {
    fontFamily: 'Montserrat',
    color: '#052844',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  pickLocationButton: {
    backgroundColor: '#052844',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '25%',
    marginTop: 14,
  },
  pickLocationButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});