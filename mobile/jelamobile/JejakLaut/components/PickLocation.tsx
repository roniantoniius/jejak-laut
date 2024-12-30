import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const PickLocation = ({ navigation }: any) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const onMapPress = useCallback((event: any) => {
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
          latitude: -2.5,
          longitude: 118,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Simpan Lokasi" onPress={saveLocationHandler} />
        <Button title="Batal" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default PickLocation;