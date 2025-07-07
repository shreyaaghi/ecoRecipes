import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { FormInput } from "./components"
import { IngredientInput } from "./components"
import { StepInput } from "./components";
import { SustainabilityPointInput } from "./components";
import { RecipeCategory } from './components/types';
import { CategoryInput } from "./components/CategoryInput";
import { ImageInput } from './components/ImageInput';

interface Ingredient {
    name: string;
    amount: string | number;
    comments: string;
}

export default function CreateRecipeScreen() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: "", amount: 0, comments: "" },
    ]);
    const [steps, setSteps] = useState<string[]>([""]);
    const [sustainabilityInformation, setSustainabilityInformation] = useState<string[]>([""]);
    const [category, setCategory] = useState<RecipeCategory>('Breakfast');
    const [recipeImage, setRecipeImage] = useState<string | null>(null);
    const [recipeMimeType, setRecipeMimeType] = useState<string | undefined>(undefined);
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";

    const handleSubmit = async () => {
        try {
            const recipeBody: any = {
                title: title,
                description: description,
                steps: steps.join("```"),
                category: category,
                sustainability_info: sustainabilityInformation.join("```"),
                recipe_photo: recipeImage,
                mime_type: recipeMimeType,
                user_generated: "true"
            };

            const recipeResponse = await axios.post(`${api_url}/recipes/`, recipeBody);


            const data = recipeResponse.data.data;
            const recipeId = data[0].id;

            for (const ingredient of ingredients) {
                if (!ingredient.name.trim())
                    continue; // skip empty ingredients

                // check if ingredient exists, create if not
                let ingredientId;
                try {
                    // get the ingredient by name
                    const ingredientResponse = await axios.get(`${api_url}/ingredients/${ingredient.name}`);
                    // const ingredientResponse = await axios.get(`${api_url}/ingredients/${encodeURIComponent(ingredient.name)}`);
                    ingredientId = ingredientResponse.data.data[0].id;
                    // NOTE data.data[0] will likely show up more...
                } catch (error) {
                    // ingredient doesn't exist --> create it
                    const newIngredientResponse = await axios.post(`${api_url}/ingredients/`, { name: ingredient.name.trim() });
                    ingredientId = newIngredientResponse.data.data[0].id;
                }

                // create recipe-ingredient pair
                const pairBody = {
                    recipeId: recipeId,
                    ingredientId: ingredientId,
                    amount: ingredient.amount.toString(),
                    comments: ingredient.comments
                };

                await axios.post(`${api_url}/recipe-ingredients/`, pairBody);
            }
            router.navigate('/recipes');

        } catch (error) {
            console.error('Error in recipe creation process:', error);
        }
    };

    const addIngredientInput = () => {
        setIngredients([...ingredients, { name: "", amount: "", comments: "" }]);
    }

    const addStepInput = () => {
        setSteps([...steps, ""])
    }

    const addSustainabilityPointInput = () => {
        setSustainabilityInformation([...sustainabilityInformation, ""])
    }

    const removeIngredient = (indexToRemove: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
        }
    }

    const removeStep = (indexToRemove: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, index) => index !== indexToRemove));
        }
    }

    const removeSustainabilityInfo = (indexToRemove: number) => {
        if (sustainabilityInformation.length > 1) {
            setSustainabilityInformation(sustainabilityInformation.filter((_, index) => index !== indexToRemove));
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Recipe</Text>
                    <MaterialCommunityIcons
                        name="bowl-mix"
                        size={50}
                        color="white"
                        style={styles.bowlIcon}
                    />
                    <Text style={styles.subtitle}>Create your own recipe</Text>
                </View>

                <ScrollView style={styles.form}>
                    <FormInput name="Title" value={title} onChangeText={setTitle} />
                    <FormInput name="Description" value={description} onChangeText={setDescription} />
                    <TouchableOpacity style={styles.ingredientButton} onPress={addIngredientInput}>
                        <Text style={styles.buttonText}>Add Ingredient</Text>
                    </TouchableOpacity>

                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientContainer}>
                            <IngredientInput
                                index={index}
                                setIngredients={setIngredients}
                                ingredients={ingredients}
                            />
                            {index > 0 && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeIngredient(index)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.ingredientButton} onPress={addStepInput}>
                        <Text style={styles.buttonText}>Add Step</Text>
                    </TouchableOpacity>

                    {steps.map((step, index) => (
                        <View key={index} style={styles.ingredientContainer}>
                            <StepInput
                                index={index}
                                setSteps={setSteps}
                                steps={steps}
                            />
                            {index > 0 && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeStep(index)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <TouchableOpacity style={styles.ingredientButton} onPress={addSustainabilityPointInput}>
                        <Text style={styles.buttonText}>Add Sustainability Point</Text>
                    </TouchableOpacity>

                    {sustainabilityInformation.map((sustainabilityPoint, index) => (
                        <View key={index} style={styles.ingredientContainer}>
                            <SustainabilityPointInput
                                index={index}
                                setSustainabilityInformation={setSustainabilityInformation}
                                sustainabilityInformation={sustainabilityInformation}
                            />
                            {index > 0 && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeSustainabilityInfo(index)}
                                >
                                    <Text style={styles.removeButtonText}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <CategoryInput
                        category={category}
                        setCategory={setCategory}
                    />

                    <ImageInput image={recipeImage}
                        setImage={setRecipeImage} mimeType={recipeMimeType} setMimeType={setRecipeMimeType} />

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
        paddingBottom: 20,
        position: 'relative',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        paddingRight: 40, // create space for the bowl
    },

    subtitle: {
        fontSize: 16,
        color: 'white',
        marginTop: 4,
    },

    bowlIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
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
    ingredientContainer: {
        position: 'relative',
        width: '100%',
        paddingRight: 40,
    },
    removeButton: {
        position: 'absolute',
        right: 5,
        top: 15,
        backgroundColor: '#ff4444',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});  