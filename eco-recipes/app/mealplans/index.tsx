import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, SafeAreaView } from 'react-native';
import { MealPlanButton } from '@/components/MealPlanButton';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MealPlansScreen: React.FC = () => {
    const router = useRouter();
    const [mealPlans, setMealPlans] = useState<any[]>([]);
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, []);

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const response = await axios.get(`${api_url}/mealplans/user`, {
                headers: { "x-access-token": token },
                validateStatus: (status) => status < 500 
            });

            if (response.status === 200) {
                setMealPlans(response.data?.data || []);
            } else if (response.status === 404) {
                setMealPlans([]);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setMealPlans([]);
            } else {
                console.error("Error fetching meal plans:", error);
            }
            setMealPlans([]);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
                No meal plans yet! Create your first meal plan to get started.
            </Text>
        </View>
    );

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Your Meal Plans</Text>
                        <Text style={styles.subtitle}>
                            View and edit your existing meal plans or create a new one.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/mealplans/CreateMealPlan')}
                >
                    <Text style={styles.buttonText}>Create Meal Plan</Text>
                </TouchableOpacity>
                <FlatList
                    data={mealPlans}
                    renderItem={({ item }: any) => (
                        <MealPlanButton id={item.id} name={item.name} />
                    )}
                    keyExtractor={(plan: any) => plan.id.toString()}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4BA9FF',
    },
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
        padding: 20,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        maxWidth: '80%',
    },
    button: {
        flexDirection: 'row',
        justifyContent: "space-around",
        paddingTop: 30,
        paddingBottom: 30,
        marginBottom: 40,
        marginHorizontal: 20,
        backgroundColor: "#41BD4B",
        borderRadius: 30
    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default MealPlansScreen;