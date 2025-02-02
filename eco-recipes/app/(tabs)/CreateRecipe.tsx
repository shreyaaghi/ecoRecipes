import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import { HomeNavButton } from '@/components/HomeNavButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FormInput } from "./components"
import { IngredientInput } from "./components"

interface Ingredient {
    name: string;
    amount: string|number;
    comments: string;
}

export default function CreateRecipeScreen() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        {name: "", amount: 0, comments:""},
        {name: "", amount: 0, comments:""}
    ]);

    const handleSubmit = () => {
        console.log("Title:", title);
        console.log("Description:", description);
    };

    const addIngredientInput = () => {
        // TODO HW: when add ingredient button clicked, new IngredientInput component goes below
        console.info("New ingredient")
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.textHeader}>
                        <Text style={styles.title}>Create Recipe</Text>
                        <Text style={styles.subtitle}>Create your own recipe</Text>
                    </View>
                </View>
                <ScrollView style={styles.form}>
                    <FormInput name="Title" value={title} onChangeText={setTitle} />
                    <FormInput name="Description" value={description} onChangeText={setDescription} />
                    <TouchableOpacity style={styles.ingredientButton} onPress={addIngredientInput}>
                        <Text style={styles.buttonText}>Add Ingredient</Text>
                    </TouchableOpacity>
                    <IngredientInput index={0} setIngredients={setIngredients} ingredients={ingredients} />
                    <IngredientInput index={1} setIngredients={setIngredients} ingredients={ingredients} />
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    back: {
        paddingTop: 7,
        paddingRight: 5
    },
    textHeader: {
        width: '80%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 20,
        // flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        // marginBottom: 10,
        // paddingBottom: 25
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        // maxWidth: '80%',
        // paddingBottom: 20,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        width: width * 0.25,
        alignSelf: 'center',
        alignItems: 'center',
    },
    ingredientButton: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        width: width * 0.8 - 5,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchImageContainer: {
        // padding: 15,
    },
    form: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
});  