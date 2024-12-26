import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type GuideStepProps = {
    stepNumber: number;
    imageSrc: string;
    description: string;
};

export const GuideStep: React.FC<GuideStepProps> = ({ stepNumber, imageSrc, description }) => {
    return (
        <View style={styles.stepContainer}>
            <Image
                source={require(`../assets/images/${imageSrc}`)}
                style={styles.image}
            />
            <Text style={styles.text}>{`${stepNumber}. ${description}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    stepContainer: {
        alignItems: 'center',
        padding: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
});