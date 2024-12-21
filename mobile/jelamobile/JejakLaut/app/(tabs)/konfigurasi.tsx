import { StyleSheet, Text, View } from "react-native";

export default function KonfigurasiScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Konfigurasi jejak Laut</Text>
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
})