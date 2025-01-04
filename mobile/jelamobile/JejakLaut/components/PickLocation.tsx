import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

type NavigationProps = StackNavigationProp<RootStackParamList>;

const PickLocation = () => {
  const params = useLocalSearchParams<{ 
    sourceScreen: string;
    noteId: string;
  }>();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get the source screen and note ID if it exists
  const sourceScreen = (route.params as any)?.sourceScreen || 'newnote';
  const noteId = (route.params as any)?.noteId;

  const onMapPress = useCallback((event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  }, []);

  const saveLocationHandler = () => {
    if (selectedLocation) {
      if (params.sourceScreen === 'edit' && params.noteId) {
        // Corrected navigation for edit mode
        router.push({
          pathname: '/(tabs)/edit/[id]' as const,
          params: {
            id: params.noteId,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
          }
        });
      } else {
        // Navigation for new note
        router.push({
          pathname: '/(tabs)/newnote' as const,
          params: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
          }
        });
      }
    } else {
      Alert.alert('Lokasi Belum Dipilih', 'Silakan pilih lokasi terlebih dahulu.');
    }
  };
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        onPress={onMapPress}
        initialRegion={{
          latitude: -7.25,
          longitude: 115.33,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={saveLocationHandler}>
          <Text style={styles.addButtonText}>Simpan Lokasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: '#052844',
    fontFamily: 'Montserrat-Bold',
    bottom: 20,
    left: 20,
    right: 20,
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
});

export default PickLocation;