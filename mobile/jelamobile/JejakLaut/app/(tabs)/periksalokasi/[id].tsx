import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { MapMarker, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useNotes } from '@/components/NoteContext';
import * as Location from 'expo-location';
import { Note } from '@/components/types';
import { Dimensions } from 'react-native';

export default function PeriksaLokasiScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);
  const currentLocationMarkerRef = useRef<MapMarker | null>(null);

  const { width, height } = Dimensions.get('window');

  // Hook for finding note
  useEffect(() => {
    const foundNote = notes.find((note) => note.id === id);
    setNote(foundNote || null);
  }, [id, notes]);

  // Hook for location permission and getting current location
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

  // Hook for route calculation
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
            setDistance(route.distance / 1000);
            setDuration(route.duration / 60);
          }
        } catch (error) {
          Alert.alert('Error', 'Gagal menghitung jarak rute lokasi!');
        }
      };

      calculateRoute();
    }
  }, [currentLocation, note]);

  // Hook for map animation
  useEffect(() => {
    if (currentLocation) {
      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [currentLocation]);

  // Hook for marker callout
  useEffect(() => {
    if (currentLocationMarkerRef.current) {
      setTimeout(() => {
        currentLocationMarkerRef.current?.showCallout();
      }, 500);
    }
  }, [currentLocation]);

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Catatan tidak ditemukan</Text>
      </View>
    );
  }

  if (note && (note.longitude === undefined || note.latitude === undefined)) {
    // Handle case where location data might be missing
    console.warn('Location data is incomplete for this note');
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Data lokasi tidak lengkap untuk catatan ini</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: note?.latitude ?? 0,
          longitude: note?.longitude ?? 0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {currentLocation && (
          <Marker
            ref={currentLocationMarkerRef}
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

      <View style={styles.floatingCard}>
        <Text style={styles.titleText}>{note.title}</Text>
        
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

        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>
            Jarak: {distance ? `${distance.toFixed(2)} km` : 'Menghitung...'}
          </Text>
          <Text style={styles.routeInfoText}>
            Waktu: {duration ? `${Math.ceil(duration)} menit` : 'Menghitung...'}
          </Text>
        </View>

        <Text style={styles.contentText} numberOfLines={3}>
          {note.markdown}
        </Text>

        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Longitude: {note?.longitude?.toFixed(6) || 'Data tidak tersedia'}
          </Text>
          <Text style={styles.locationText}>
            Latitude: {note?.latitude?.toFixed(6) || 'Data tidak tersedia'}
          </Text>
        </View>

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
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
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
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  locationInfo: {
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#052844',
    lineHeight: 20,
  },
});