import React from "react";
import { Image, Text, View } from "react-native";

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
    )
}