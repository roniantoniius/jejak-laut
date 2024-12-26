import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Asset } from 'expo-asset';

type GuideStepProps = {
  stepNumber: number;
  imageSrc: string;
  description: string;
};

export const GuideStep: React.FC<GuideStepProps> = ({ stepNumber, imageSrc, description }) => {
  // Use expo-asset to load the image dynamically
  const imageAsset = Asset.fromModule(require(`../assets/images/${imageSrc}`));
  
  // Ensure we have an image source that matches ImageSourcePropType
  const source: ImageSourcePropType = imageAsset.localUri 
    ? { uri: imageAsset.localUri } 
    : require(`../assets/images/${imageSrc}`);

  return (
    <View style={styles.stepContainer}>
      <Image 
        source={source}
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