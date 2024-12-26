import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Define the images as static requires
const images = {
  '1.png': require('../assets/images/1.png'),
  '2.png': require('../assets/images/2.png'),
  '3.png': require('../assets/images/3.png'),
};

type GuideStepProps = {
  stepNumber: number;
  imageSrc: keyof typeof images; // Ensure imageSrc matches one of our keys
  description: string;
};

export const GuideStep: React.FC<GuideStepProps> = ({ stepNumber, imageSrc, description }) => {
  const imageSource = images[imageSrc];

  return (
    <View style={styles.stepContainer}>
      <Image 
        source={imageSource}
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