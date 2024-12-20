import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Waduh halaman ini tidak ditemukan" }} />
            <View style={styles.container}>
                <Link href="/" style={styles.button}>
                    Pergi Ke Beranda!
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        color: "white",
        marginTop: 10
    },
});