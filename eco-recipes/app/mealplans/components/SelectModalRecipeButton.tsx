import React from 'react';
import { Text } from "@/components/Themed";
import { StyleSheet, TouchableOpacity, View, ImageBackground } from "react-native";
import { useRouter } from 'expo-router';

const SelectModalRecipeButton = ({ name, id, image, closeModal, setRecipe, recipe }: Record<string, any>) => {
    const router = useRouter();
    const imageSrc = { uri: image }
    return (
        <TouchableOpacity key={id} style={styles.row} onPress={() => {
            // grab name of recipe
            console.log(id, name)
            setRecipe();
            // change type
            closeModal();
        }}>
            <ImageBackground source={imageSrc} resizeMode="contain" style={styles.image}>
                <Text style={styles.buttonText}>{name}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: "space-around",
        paddingTop: 30,
        paddingBottom: 30,
        marginBottom: 40,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: "#4BA9FF",
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold"
    },
    image: {
        justifyContent: 'center'
    }
});

export { SelectModalRecipeButton };