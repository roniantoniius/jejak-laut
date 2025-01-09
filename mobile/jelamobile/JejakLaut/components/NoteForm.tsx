import { View, Text, TextInput, KeyboardAvoidingView, StyleSheet, Alert, TouchableOpacity, Platform, FlatList, Button} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { NewNoteRouteProp, NoteData, Tag } from './types';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { router } from 'expo-router';

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
  navigation?: any;
  mode?: 'create' | 'edit';
};

export function NoteForm({
  mode = 'create',
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
  const [newTagText, setNewTagText] = useState('');
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [pendingTag, setPendingTag] = useState<Tag | null>(null);

  const route = useRoute<NewNoteRouteProp>();
  const [params, setParams] = useState(route.params);
  const [hasReceivedLocation, setHasReceivedLocation] = useState(false);

  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const resetImage = () => {
    setImageUri(undefined);
  };

  useEffect(() => {
      setParams(route.params);
  }, [route.params]);

  useEffect(() => {
    if (
      route.params?.latitude !== undefined &&
      route.params?.longitude !== undefined &&
      !hasReceivedLocation
    ) {
      setLat(route.params.latitude);
      setLng(route.params.longitude);
      setHasReceivedLocation(true);
    }
  }, [route.params, hasReceivedLocation]);

  useEffect(() => {
      console.log('Route params:', route.params);
      console.log('Latitude state:', lat);
      console.log('Longitude state:', lng);
      console.log('Gambar:', imageUri);
  }, [route.params, lat, lng, imageUri]);

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

  useEffect(() => {
    if (mode === 'edit') {
      setNoteTitle(title);
      setNoteMarkdown(markdown);
      setSelectedTags(tags.map((tag) => tag.id));
      setLat(latitude);
      setLng(longitude);
    }
  }, [title, markdown, tags, latitude, longitude, mode]);

  const handleSubmit = () => {
    const noteTags = availableTags
      .filter((tag) => selectedTags.includes(tag.id))
      .map((tag) => ({ id: tag.id, label: tag.label, color: tag.color }));

    onSubmit({
      id: mode === 'edit' ? title : '', // Keep existing ID in edit mode
      title: noteTitle,
      markdown: noteMarkdown,
      tags: noteTags,
      latitude: lat,
      longitude: lng,
      lastModified: new Date().toISOString(),
      gambar: imageUri,
    });

    // Only reset form if it's not in edit mode
    if (mode !== 'edit') {
      setNoteTitle('');
      setNoteMarkdown('');
      setSelectedTags([]);
      setLat(0);
      setLng(0);
      setHasReceivedLocation(false);
      setImageUri(undefined);
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
      <TextInput
        style={styles.titleInput}
        value={noteTitle}
        onChangeText={setNoteTitle}
        placeholder="Ada apa hari ini?"
        placeholderTextColor="#9DA3B4"
      />

      <DropDownPicker
        open={isTagPickerOpen}
        setOpen={setIsTagPickerOpen}
        items={availableTags.map((tag) => ({
          label: tag.label,
          value: tag.id,
          icon: () => (
            <View style={[styles.tagColor, { backgroundColor: tag.color }]} />
          ),
        }))}
        value={selectedTags}
        setValue={setSelectedTags}
        setItems={setTagOptions}
        multiple={true}
        mode="BADGE"
        placeholder="Tentukan Kategori Catatan"
        searchable={true}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
      />

      <View style={styles.newTagContainer}>
        <TextInput
          style={styles.newTagInput}
          placeholder="Tambah Kategori baru"
          value={newTagText}
          onChangeText={setNewTagText}
          placeholderTextColor="#9DA3B4"
        />
        <TouchableOpacity style={styles.addButtonSmall} onPress={handleCreateTag}>
          <Text style={styles.addButtonSmallText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageSelectionContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
          <Ionicons name="reload" size={24} color="red" />
        </TouchableOpacity>
        {imageUri && (
          <Text style={styles.imagePathText}>{imageUri.split('/').pop()}</Text>
        )}
        <TouchableOpacity style={styles.addButtonSmall} onPress={selectImage}>
          <Text style={styles.addButtonSmallText}>Gambar</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.markdownInput}
        multiline
        value={noteMarkdown}
        onChangeText={setNoteMarkdown}
        placeholder="Tulis catatan anda disini..."
        placeholderTextColor="#9DA3B4"
        textAlignVertical="top"
      />

      <View style={styles.locationContainer}>
        <View style={styles.locationInputContainer}>
          <TextInput
            style={styles.locationInput}
            keyboardType="numeric"
            value={String(lng)}
            onChangeText={(text) => setLng(parseFloat(text) || 0)}
          />
        </View>

        <View style={styles.locationInputContainer}>
          <TextInput
            style={styles.locationInput}
            keyboardType="numeric"
            value={String(lat)}
            onChangeText={(text) => setLat(parseFloat(text) || 0)}
          />
        </View>

        <TouchableOpacity 
          style={styles.pickLocationButton} 
          onPress={() => {
            if (mode === 'edit') {
              router.push({
                pathname: '/pilihlokasi',
                params: {
                  sourceScreen: 'edit',
                  noteId: title
                }
              });
            } else {
              router.push('/pilihlokasi');
            }
          }}
        >
          <Text style={styles.pickLocationButtonText}>Lokasi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {mode === 'edit' ? 'Perbarui Catatan' : 'Buat Catatan'}
        </Text>
      </TouchableOpacity>

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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titleInput: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
    marginBottom: 24,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  dropdown: {
    borderWidth: 0,
    fontSize: 28,
    marginBottom: 24,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  dropdownContainer: {
    borderWidth: 0,
    borderRadius: 8,
    elevation: 3,
  },
  newTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newTagInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    marginBottom: 24,
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  markdownInput: {
    fontSize: 20,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    marginBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  locationInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
    marginBottom: 8,
  },
  locationInput: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    padding: 12,
    marginBottom: 24,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F0F0',
  },
  pickLocationButton: {
    backgroundColor: '#052844',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  pickLocationButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#052844',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 18,
  },
  tagColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  placeholder: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#9DA3B4',
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
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePathText: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  resetButton: {
    padding: 10,
  },
});