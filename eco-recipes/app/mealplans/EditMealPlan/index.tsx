import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions, FlatList, TextInput, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RecipeRow } from '../components/RecipeRow';
import { useNavigation } from 'expo-router';
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

export default function EditMealPlanScreen() {
    const [text, setText] = useState<string>('');
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [dayRecipes, setDayRecipes] = useState<{ [key: string]: Recipe[] }>({});
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, []);

    const daysOfWeek: DayItem[] = [
        { id: '1', name: 'Monday' },
        { id: '2', name: 'Tuesday' },
        { id: '3', name: 'Wednesday' },
        { id: '4', name: 'Thursday' },
        { id: '5', name: 'Friday' },
        { id: '6', name: 'Saturday' },
        { id: '7', name: 'Sunday' }
    ];
    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    Alert.alert("Error", "Please log in again");
                    router.push('/auth/login');
                    return;
                }

                const { data: result } = await axios.get(`${api_url}/mealplans/${id}/recipes`, {
                    headers: { "x-access-token": token }
                });

                const data = result.data;

                setText(data.name || '');

                const formattedDayRecipes: { [key: string]: Recipe[] } = {};

                if (data.days && Array.isArray(data.days)) {
                    data.days.forEach((day: any) => {
                        const dayItem = daysOfWeek.find(d => d.name === day.dayName);
                        if (dayItem && day.recipes) {
                            formattedDayRecipes[dayItem.id] = day.recipes.map((recipe: any) => ({
                                time: recipe.time || '',
                                recipeName: recipe.title || '',
                                recipeId: recipe.id ? recipe.id.toString() : ''
                            }));
                        }
                    });
                }

                setDayRecipes(formattedDayRecipes);

            } catch (error) {
                console.error("Error fetching meal plan:", error);
                Alert.alert("Error", "Failed to load meal plan data");
            }
        };

        if (id && id !== 'edit') {
            fetchMealPlan();
        }
    }, [id]);


    const updateMealPlan = async () => {
        if (!text.trim()) {
            Alert.alert("Error", "Enter a meal plan name");
            return;
        }

        const hasRecipes = Object.values(dayRecipes).some(recipes => recipes.length > 0);
        if (!hasRecipes) {
            Alert.alert("Error", "Please add at least one recipe to your meal plan");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert("Error", "Please log in again");
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
                            recipe.recipeName && recipe.time && recipe.recipeId // only include completed recipes
                        )
                    };
                }).filter(day => day.recipes.length > 0) // only include days with recipes
            };

            const response = await axios.put(`${api_url}/mealplans/${id}`, mealPlanData, {
                headers: { "x-access-token": token }
            });

            Alert.alert(
                "Success",
                "Meal plan updated successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.back(); 
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Error updating meal plan:", error);
            Alert.alert("Error", "Failed to update meal plan. Please try again.");
        }
    };

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

    const handleBack = () => {
        router.back();
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.textHeader}>
                        <Text style={styles.title}>Edit Meal Plan</Text>
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
                    style={styles.flatList}
                />

                <TouchableOpacity style={styles.createButton} onPress={updateMealPlan}>
                    <Text style={styles.createButtonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#4BA9FF",
    },
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    backButton: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    backButtonText: {
        color: '#4BA9FF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textHeader: {
        flex: 1,
        alignItems: 'center',
        marginRight: 60, // Offset for back button to center title
    },
    title: {
        fontSize: 28,
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
    flatList: {
        flex: 1,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});  
