import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TahunBaruScreen() {
    const pencetTombol = async () => {
        try {
            console.log("Selamat Tahun Baru 2025!");
        } catch(e) {
            console.log("Waduh error di tahun baru :((", e);
        }
    };

    return (
        <View style={styles.kontainer}>
            <Text style={styles.teks}>Tahun Baru 2025</Text>
            <TouchableOpacity style={styles.tombol} onPress={pencetTombol}>
                <Text style={styles.teksTombol}>Klik</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    kontainer: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    teks: {
        color: "#052844",
        fontFamily: 'Montserrat', // Use the font family name you've specified
        fontWeight: 'normal' // If you want to use different weights, specify here
    },
    tombol: {
        backgroundColor: '#052844',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '25%',
    },
    teksTombol: {
      fontFamily: 'Montserrat-Bold',
      color: 'white',
      fontSize: 16,
    },
})