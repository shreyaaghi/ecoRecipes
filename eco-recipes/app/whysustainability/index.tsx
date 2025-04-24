import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Link } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const WhySustainabilityScreen = () => {
    const router = useRouter();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.textHeader}>
                    <Text style={styles.title}>Why Sustainability?</Text>
                    <Text style={styles.subtitle}>Learn how you can make more eco-friendly food choices.</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Health Benefits</Text>
                    <Text style={styles.cardContent}>
                        Eating sustainably isn't just good for the planet—it's great for your health too. By choosing foods that are produced with eco-friendly methods, you're likely to consume fewer pesticides and more nutrients. Sustainable eating often means opting for seasonal, locally-grown produce and whole foods over processed alternatives. This approach not only provides a wider variety of essential vitamins and minerals but also supports a healthier ecosystem. In turn, this contributes to cleaner air and water, creating a positive cycle that benefits both your personal well-being and the environment around you.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>For The Planet</Text>
                    <Text style={styles.cardContent}>
                        Sustainable eating practices are a powerful way to reduce our environmental footprint. By choosing locally sourced, seasonal foods and minimizing meat consumption, we can significantly cut down on greenhouse gas emissions from transportation and livestock production. Sustainable agriculture also promotes biodiversity, conserves water, and reduces soil degradation. These practices help maintain ecosystem balance, protect wildlife habitats, and mitigate climate change. Ultimately, eating sustainably helps preserve our planet's resources for future generations, ensuring a healthier and more resilient Earth.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>The Impact</Text>
                    <Text style={styles.cardContent}>
                        Every individual's food choices can create a ripple effect of positive change. When you opt for sustainable eating, you're not just making a personal choice—you're influencing market demand. As more people choose sustainably produced foods, it encourages farmers and food companies to adopt eco-friendly practices. Your choices also inspire friends and family, potentially changing their habits too. Over time, these individual actions add up, reducing food waste, supporting local economies, and decreasing the carbon footprint of our food systems. By eating sustainably, you become part of a larger movement pushing for a more environmentally responsible food industry.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 40, 
        paddingTop: 10,    
    },
    back: {
        marginTop: 30,
    },
    textHeader: {
        width: '80%'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 25,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
    },
    card: {
        borderRadius: 20,
        padding: 25,
        marginVertical: 15,
        marginHorizontal: 5,
        backgroundColor: '#41BD4B',
    },
    cardTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
    },
    cardContent: {
        fontSize: 16,
        lineHeight: 24,
        color: 'white',
    },
});

export default WhySustainabilityScreen;