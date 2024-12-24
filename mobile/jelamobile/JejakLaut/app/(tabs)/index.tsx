import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PopupCard } from '@/components/PopupCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NoteList } from '@/components/NoteList';

// Definisikan tipe navigasi
type RootStackParamList = {
  index: undefined;
  newnote: undefined; // Sesuaikan dengan Tabs.Screen
  konfigurasi: undefined;
};

export default function Index() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <NoteList />
      <PopupCard
        icon={<Text style={styles.iconText}>+</Text>}
        title="Menu Aksi"
        buttons={[
          {
            label: 'Tambah Jejak Baru',
            onPress: () => navigation.navigate('newnote'),
            style: styles.addButton,
            textStyle: styles.addButtonText,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    paddingTop: 20,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});