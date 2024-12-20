import { View, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library';
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import { useRef, useState } from 'react';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import { ImageSource } from 'expo-image';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);
  
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('Kamu tidak memilih gambar!');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    // Add sticker
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    // later
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    // Save image later
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
  
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Gambar berhasil disimpan!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }

  };

  if (status === null) {
    requestPermission();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Pilih gambar" onPress={pickImageAsync} />
          <Button label="Gunakan gambar ini" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* Sticker list component */}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 40,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});