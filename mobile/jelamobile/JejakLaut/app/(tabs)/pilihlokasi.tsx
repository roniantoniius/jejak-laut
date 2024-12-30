// app/(tabs)/pilihlokasi.tsx
import React from 'react';
import { View } from 'react-native';
import PickLocation from '../../components/PickLocation';

const PilihLokasiScreen = ({ navigation }: any) => (
  <View style={{ flex: 1 }}>
    <PickLocation navigation={navigation} />
  </View>
);

export default PilihLokasiScreen;