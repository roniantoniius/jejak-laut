import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { Text } from 'react-native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'newnote' | 'edit/[id]'>

interface PickLocationProps {
  mode: 'create' | 'edit';
  noteId?: string;
  initialLat?: number;
  initialLng?: number;
}

const PickLocation: React.FC<PickLocationProps> = ({ mode, noteId, initialLat = -7.25, initialLng = 115.33 }) => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>({
    latitude: initialLat,
    longitude: initialLng,
  });

  const onMapPress = useCallback((event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  }, []);

  const saveLocationHandler = () => {
    if (selectedLocation) {
      if (mode === 'create') {
        navigation.navigate('newnote', {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
      } else if (mode === 'edit' && noteId) {
        navigation.navigate('edit/[id]', {
          id: noteId,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
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
          latitude: initialLat,
          longitude: initialLng,
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