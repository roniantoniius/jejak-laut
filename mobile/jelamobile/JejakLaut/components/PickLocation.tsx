import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Menambahkan tipe navigasi
type NavigationProps = StackNavigationProp<RootStackParamList, 'newnote'>;

const PickLocation = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const onMapPress = useCallback((event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  }, []);

  const saveLocationHandler = () => {
    if (selectedLocation) {
      navigation.navigate('newnote', {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
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
        <Button title="Simpan Lokasi" onPress={saveLocationHandler} />
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
});

export default PickLocation;