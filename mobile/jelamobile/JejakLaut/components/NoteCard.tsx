import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag } from './types';

type NoteCardProps = {
  id: string;
  title: string;
  tags: Tag[];
  longitude: number;
  latitude: number;
  lastModified: string;
  onPress: (id: string) => void;
};

export function NoteCard({ id, title, tags, longitude, latitude, lastModified, onPress }: NoteCardProps) {
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
      <View style={styles.cardBody}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tagContainer}>
          {tags.map((tag) => (
            <Text key={tag.id} style={[styles.tag, { backgroundColor: tag.color }]}>
              {tag.label}
            </Text>
          ))}
        </View>
        <Text style={styles.lastModified}>{formatTimeAgo(lastModified)}</Text>
        <Text style={styles.longlat}>| {longitude}, {latitude}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10, // Increased for a softer look
    marginBottom: 18,
    marginRight: 10,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // For Android, this gives a z-depth effect
    borderWidth: 1,
    borderColor: '#e4e4e4', // Softer border color
  },
  longlat: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Montserrat',
  },
  cardBody: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    padding: 4,
    height: 25,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  lastModified: {
    fontSize: 16,
    color: '#052844',
    fontFamily: 'Montserrat-Bold',
  },
});