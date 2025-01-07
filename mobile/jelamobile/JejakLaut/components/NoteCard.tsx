import React, { useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LongPressGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Tag } from './types';

type NoteCardProps = {
  id: string;
  title: string;
  tags: Tag[];
  longitude: number;
  latitude: number;
  lastModified: string;
  gambar?: string;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NoteCard({ id, title, tags, longitude, latitude, lastModified, onPress, onDelete, gambar }: NoteCardProps) {
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  const handleLongPress = useCallback(async () => {
    Alert.alert(
      "Hapus Catatan",
      "Apakah Anda yakin ingin menghapus catatan ini?",
      [
        {
          text: "Batal", // Tombol untuk batal
          onPress: () => {
            console.log("Penghapusan catatan dibatalkan.");
          },
          style: "cancel", // Gaya tombol default untuk batal
        },
        // ... existing cancel button
        {
          text: "Hapus", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(id);
              console.log(`Catatan dengan id ${id} telah dihapus.`);
              // Call the onDelete prop to update the parent's state
              onDelete(id);
            } catch (error) {
              console.error('Error removing item from AsyncStorage:', error);
              Alert.alert('Error', 'Gagal menghapus catatan.');
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  }, [id, onDelete]);


  return (
    <GestureHandlerRootView>
      <LongPressGestureHandler 
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleLongPress();
          }
        }}
        minDurationMs={2000}
      >
        <View>
          <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
            <View style={styles.cardBody}>
              {gambar && <Image source={{ uri: gambar }} style={styles.imageInCard} />}
              <Text style={styles.title}>{title}</Text>
              <View style={styles.tagContainer}>
                {tags.map((tag) => (
                  <Text key={tag.id} style={[styles.tag, { backgroundColor: tag.color }]}>
                    {tag.label}
                  </Text>
                ))}
              </View>
              <Text style={styles.lastModified}>{formatTimeAgo(lastModified)}</Text>
              <Text style={styles.longlat}>| {longitude}, {latitude}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10, // Increased for a softer look
    marginBottom: 18,
    marginRight: 10,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // For Android, this gives a z-depth effect
    borderWidth: 1,
    borderColor: '#e4e4e4', // Softer border color
  },
  longlat: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  cardBody: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    padding: 4,
    height: 25,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  lastModified: {
    fontSize: 16,
    color: '#052844',
    fontFamily: 'Montserrat-Bold',
  },
  imageInCard: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
});