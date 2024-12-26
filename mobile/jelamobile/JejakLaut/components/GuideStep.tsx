import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';

type GuideStepProps = {
  stepNumber: number;
  imageSrc: string;
  description: string;
};

export const GuideStep: React.FC<GuideStepProps> = ({ stepNumber, imageSrc, description }) => {
  // Use expo-asset to load the image dynamically
  const image = Asset.fromModule(require(`../assets/images/${imageSrc}`));

  return (
    <View style={styles.stepContainer}>
      <Image 
        source={image}
        style={styles.image}
      />
      <Text style={styles.text}>{`${stepNumber}. ${description}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});