import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#052844', borderRadius: 18 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#052844' }]}
          onPress={() => alert('You pressed a button.')}>
          <FontAwesome name="picture-o" size={18} color="white" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: 'white' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#052844',
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
    fontSize: 16,
  },
  text: {
    fontFamily: 'Montserrat',
    fontWeight: 'normal',
  },
});
