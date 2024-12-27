import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  searchTitle: string;
  setSearchTitle: (value: string) => void;
  searchTag: string;
  setSearchTag: (value: string) => void;
};

export function SearchBar({
  searchTitle,
  setSearchTitle,
  searchTag,
  setSearchTag,
}: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      {/* Search Title Input */}
      <View style={styles.iconInputContainer}>
        <Ionicons name="search" size={20} color="#052844" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cari Judul..."
          onChangeText={setSearchTitle}
          value={searchTitle}
          placeholderTextColor="#052844"
        />
      </View>

      {/* Search Tag Input */}
      <View style={styles.iconInputContainer}>
        <Ionicons
          name="pricetag-outline"
          size={20}
          color="#052844"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Cari Tag..."
          onChangeText={setSearchTag}
          value={searchTag}
          placeholderTextColor="#052844"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#052844',
  },
});
