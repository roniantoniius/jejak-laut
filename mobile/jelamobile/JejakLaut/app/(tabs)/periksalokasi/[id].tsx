import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useNotes } from '@/components/NoteContext';
import * as Location from 'expo-location';
import { Note } from '@/components/types';
import SlidingUpPanel from 'rn-sliding-up-panel';

export default function PeriksaLokasiScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const foundNote = notes.find((note) => note.id === id);
    setNote(foundNote || null);
  }, [id, notes]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation && note) {
      const calculateRoute = async () => {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${currentLocation.longitude},${currentLocation.latitude};${note.longitude},${note.latitude}?overview=full`
        );
        const data = await response.json();
        if (data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          }));
          setRouteCoordinates(coordinates);
          setDistance(data.routes[0].distance / 1000); // Distance in kilometers
        }
      };

      calculateRoute();
    }
  }, [currentLocation, note]);

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: note.latitude,
          longitude: note.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {currentLocation && <Marker coordinate={currentLocation} title="Lokasi Anda" />}
        <Marker coordinate={{ latitude: note.latitude, longitude: note.longitude }} title={note.title} />
        {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} strokeColor="#0000FF" strokeWidth={3} />}
      </MapView>
      <SlidingUpPanel>
        {(dragHandler) => (
          <View style={styles.panel}>
            <View style={styles.panelHeader} {...dragHandler}>
              <Text style={styles.panelTitle}>{note.title}</Text>
              <Text style={styles.distance}>Jarak: {distance ? `${distance.toFixed(2)} km` : 'Menghitung...'}</Text>
            </View>
            <View style={styles.panelContent}>
              <Text>{note.markdown}</Text>
            </View>
          </View>
        )}
      </SlidingUpPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  panel: {
    height: 300,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
  },
  panelHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 16,
    marginTop: 5,
  },
  panelContent: {
    marginTop: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});