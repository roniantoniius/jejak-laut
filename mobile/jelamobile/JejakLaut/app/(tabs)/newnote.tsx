import { StyleSheet, Text, View } from "react-native";

export default function NewNoteScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tambah Jejak Baru</Text>
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
        fontFamily: 'Montserrat',
        fontWeight: 'normal'
    },
})