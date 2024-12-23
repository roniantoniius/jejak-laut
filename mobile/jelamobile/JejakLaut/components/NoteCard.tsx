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
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  longlat: {
    fontSize: 12,
    color: '#999',
  },
  cardBody: {
    flexDirection: 'column',
  },
  title: {
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
    padding: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    color: 'white',
  },
  lastModified: {
    fontSize: 12,
    color: '#999',
  },
});
