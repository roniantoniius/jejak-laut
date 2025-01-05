import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useNotes } from '@/components/NoteContext';
import * as Location from 'expo-location';
import { Note } from '@/components/types';

const { width, height } = Dimensions.get('window');

export default function PeriksaLokasiScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${currentLocation.longitude},${currentLocation.latitude};${note.longitude},${note.latitude}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lng,
            }));
            
            setRouteCoordinates(coordinates);
            setDistance(route.distance / 1000); // Convert to kilometers
            setDuration(route.duration / 60); // Convert to minutes
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to calculate route');
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
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: note.latitude,
          longitude: note.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Lokasi Anda"
            pinColor="blue"
          />
        )}
        <Marker
          coordinate={{ latitude: note.latitude, longitude: note.longitude }}
          title={note.title}
          pinColor="orange"
        />
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2196F3"
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      {/* Floating Card */}
      <View style={styles.floatingCard}>
        <Text style={styles.titleText}>{note.title}</Text>
        
        {/* Tags */}
        <View style={styles.tagContainer}>
          {note.tags.map((tag) => (
            <View
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              <Text style={styles.tagText}>{tag.label}</Text>
            </View>
          ))}
        </View>

        {/* Route Info */}
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>
            Jarak: {distance ? `${distance.toFixed(2)} km` : 'Menghitung...'}
          </Text>
          <Text style={styles.routeInfoText}>
            Waktu: {duration ? `${Math.ceil(duration)} menit` : 'Menghitung...'}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Longitude: {note.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Latitude: {note.latitude.toFixed(6)}
          </Text>
        </View>

        {/* Note Content */}
        <Text style={styles.contentText} numberOfLines={3}>
          {note.markdown}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  routeInfoText: {
    fontSize: 14,
    color: '#333',
  },
  locationInfo: {
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
  },
  contentText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});