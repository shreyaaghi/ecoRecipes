import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions, FlatList, TextInput, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { RecipeRow } from '../components/RecipeRow';
import { SelectModal } from '../components/SelectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface DayItem {
    id: string;
    name: string;
}

interface Recipe {
    time: string,
    recipeName: string,
    recipeId: string
}

export default function CreateMealPlanScreen() {
    const [text, setText] = useState<string>('');
    const router = useRouter();
    const [dayRecipes, setDayRecipes] = useState<{ [key: string]: Recipe[] }>({});
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";

    const createMealPlan = async () => {
        // checks: at least one recipe
        if (!text) {
            Alert.alert("Error", "enter a meal plan name")
            return;
        }

        const hasRecipes = Object.values(dayRecipes).some(recipes => recipes.length > 0);
        if (!hasRecipes) {
            Alert.alert("Error", "please add at least one recipe to your meal plan");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                // reroute, send em home!
                Alert.alert("Error", "please log in again");
                return;
            }
            const mealPlanData = {
                name: text,
                days: Object.keys(dayRecipes).map(dayId => {
                    const dayName = daysOfWeek.find(day => day.id === dayId)?.name;
                    return {
                        dayId: dayId,
                        dayName: dayName,
                        recipes: dayRecipes[dayId].filter(recipe =>
                            recipe.recipeName && recipe.time // Only include completed recipes
                        )
                    };
                }).filter(day => day.recipes.length > 0) // only include days w/ recipes
            };

            console.log("Sending meal plan data:", mealPlanData);

            const response = await axios.post(`${api_url}/meal-plans/create`, mealPlanData, {headers: {"x-access-token": token, "Content-Type": "application/json"}});

            console.log("Meal plan created successfully:", response.data);

            Alert.alert(
                "Success",
                "Meal plan created successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.push('/mealplans');
                        }
                    }
                ]
            );


        } catch (error) {
            console.error("Error creating meal plan:", error);
            Alert.alert("Error", "Failed to create meal plan. Please try again.");
        }

    };

    const daysOfWeek: DayItem[] = [
        { id: '1', name: 'Monday' },
        { id: '2', name: 'Tuesday' },
        { id: '3', name: 'Wednesday' },
        { id: '4', name: 'Thursday' },
        { id: '5', name: 'Friday' },
        { id: '6', name: 'Saturday' },
        { id: '7', name: 'Sunday' }
    ];

    const addRecipe = (dayId: string) => {
        const newRecipes = [...(dayRecipes[dayId] || []), { time: '', recipeName: '', recipeId: '' }];
        setDayRecipes({
            ...dayRecipes,
            [dayId]: newRecipes
        });
    };

    const updateDayRecipes = (dayId: string, updatedRecipes: Recipe[]) => {
        setDayRecipes({
            ...dayRecipes,
            [dayId]: updatedRecipes
        });
    };

    const renderDay = ({ item }: { item: DayItem }) => {
        const recipes = dayRecipes[item.id] || [];

        return (
            <View style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{item.name}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => addRecipe(item.id)}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dayContent}>
                    {recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                            <RecipeRow
                                key={index}
                                index={index}
                                recipes={recipes}
                                setRecipes={(updatedRecipes: Recipe[]) => updateDayRecipes(item.id, updatedRecipes)}
                                day={item.name}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>
                            No recipes yet! (Click the + in the top right corner to add one)
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.textHeader}>
                        <Text style={styles.title}>Create Meal Plan</Text>
                    </View>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.titles}>Meal Plan Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter meal plan name here (ex. paleo diet)"
                        onChangeText={(text) => setText(text)}
                        value={text}
                    />
                </View>

                <FlatList
                    data={daysOfWeek}
                    renderItem={renderDay}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={true}
                />

                <TouchableOpacity style={styles.createButton} onPress={createMealPlan}>
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
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
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    inputSection: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        width: width * 0.9 - 40,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        color: "black",
        marginVertical: 5,
        paddingHorizontal: 15,
    },
    titles: {
        color: "#ffffff",
        fontWeight: "bold",
        marginBottom: 5,
    },
    dayContainer: {
        backgroundColor: '#41BD4B',
        borderRadius: 20,
        marginBottom: 15,
        padding: 20,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dayTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    dayContent: {
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 40,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4BA9FF',
    },
    footerStyle: {
        marginTop: 15,
    }
});  
