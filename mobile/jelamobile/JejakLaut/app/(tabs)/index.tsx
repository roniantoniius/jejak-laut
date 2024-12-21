import { View, StyleSheet } from 'react-native';

import Button from '@/components/Button';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    paddingTop: 30,
    alignItems: 'center',
  },
});
