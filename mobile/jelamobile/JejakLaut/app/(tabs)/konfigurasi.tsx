import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function KonfigurasiScreen() {
    const deleteMemori = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Data cleared, logged out.');
            // Lakukan navigasi atau tindakan lain setelah logout
        } catch(e) {
            console.error('Error during logout:', e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Konfigurasi jejak Laut</Text>
            <TouchableOpacity style={styles.addButtonSmall} onPress={deleteMemori}>
                <Text style={styles.addButtonSmallText}>Hapus</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#052844",
        fontFamily: 'Montserrat', // Use the font family name you've specified
        fontWeight: 'normal' // If you want to use different weights, specify here
    },
    addButtonSmall: {
        backgroundColor: '#052844',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '25%',
    },
    addButtonSmallText: {
      fontFamily: 'Montserrat-Bold',
      color: 'white',
      fontSize: 16,
    },
})