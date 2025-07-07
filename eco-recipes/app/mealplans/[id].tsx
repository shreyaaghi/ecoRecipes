import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { usePathname, useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigation } from 'expo-router';

interface Recipe {
    id: number;
    title: string;
    time: string;
}

interface Day {
    dayName: string;
    recipes: Recipe[];
}

interface MealPlan {
    id: number;
    name: string;
    days: Day[];
}

const MealPlanView = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, []);

    useEffect(() => {
        const fetchMealPlan = async () => {
            if (!id || id === 'edit') {
                return;
            }
            try {
                const { data } = await axios.get(`${api_url}/mealplans/${id}/recipes`);
                setMealPlan(data.data);
            } catch (err) {
                console.error("Error fetching meal plan:", err);
            }
        };
            fetchMealPlan();
    }, [id]);

    const handleRecipePress = (recipeId: number) => {
        router.push(`/recipes/${recipeId}`);
    };

    const handleBack = () => {
        router.back();
    };

    const handleEdit = () => {
        router.push(`/mealplans/EditMealPlan?id=${mealPlan?.id}`); 
    };

    if (!mealPlan) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <Text style={styles.loadingText}>Loading meal plan...</Text>
                </View>
            </SafeAreaView>
        );
    }


    const renderDay = (day: Day, index: number) => (
        <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{day.dayName}</Text>
            
            {day.recipes.length > 0 ? (
                day.recipes.map((recipe, recipeIndex) => (
                    <TouchableOpacity 
                        key={recipeIndex} 
                        style={styles.recipeItem}
                        onPress={() => handleRecipePress(recipe.id)}
                    >
                        <Text style={styles.recipeText}>
                            {recipe.time}: {recipe.title}
                        </Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.emptyText}>
                    No recipes yet! (Click "edit" in the top right corner to add one)
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.mealPlanTitle}>{mealPlan.name}</Text>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {mealPlan.days.map((day, index) => renderDay(day, index))}
            </ScrollView>
        </SafeAreaView>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#4BA9FF",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backButtonText: {
        color: '#4BA9FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    editButtonText: {
        color: '#4BA9FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    mealPlanTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    dayContainer: {
        backgroundColor: '#41BD4B',
        borderRadius: 20,
        marginBottom: 15,
        padding: 20,
    },
    dayTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    recipeItem: {
        marginBottom: 8,
    },
    recipeText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
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

export default MealPlanView;