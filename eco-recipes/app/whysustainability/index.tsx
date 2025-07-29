import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const sustainabilityFacts = [
    "Enough food is produced to feed the world’s 7 billion people, yet 309 million people in 72 countries face acute food insecurity",
    "28% percent of the world’s arable land produces food that is wasted",
    "Around one fifth of food produced for human consumption is either lost or wasted (~1.3 billion tons, valued at US$1 trillion",
    "Food loss and waste account for about 4.4 gigatonnes of greenhouse gas emissions annually"
];

const WhySustainabilityScreen = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [currentFact, setCurrentFact] = useState(0);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        // Rotate facts every 5 seconds
        const interval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % sustainabilityFacts.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const toggleCard = (cardId: string) => {
        setExpandedCard(expandedCard === cardId ? null : cardId);
    };

    const handleBack = () => {
        router.back();
    };

    const renderImpactMeter = (title: string, value: number, color: string) => (
        <View style={styles.meterContainer}>
            <Text style={styles.meterTitle}>{title}</Text>
            <View style={styles.meterBackground}>
                <View style={[styles.meterFill, { width: `${value}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.meterValue}>{value}% reduction</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.textHeader}>
                    <Text style={styles.title}>Why Sustainability?</Text>
                    <Text style={styles.subtitle}>Make a difference with every bite.</Text>
                </View>
            </View>

            <View style={styles.factBanner}>
                <MaterialIcons name="eco" size={24} color="#41BD4B" />
                <Text style={styles.factText}>{sustainabilityFacts[currentFact]}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
                <TouchableOpacity
                    style={[styles.card, styles.definitionCard]}
                    onPress={() => toggleCard('definition')}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="lightbulb" size={24} color="white" />
                        <Text style={styles.cardTitle}>Define Sustainability</Text>
                        <MaterialIcons
                            name={expandedCard === 'definition' ? 'expand-less' : 'expand-more'}
                            size={28}
                            color="white"
                        />
                    </View>

                    <Text style={styles.cardContent}>
                        Sustainability means meeting our current needs without compromising future generations' ability to meet theirs...
                    </Text>

                    {expandedCard === 'definition' && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.cardContent}>
                                In food, this means choosing options that are good for the environment, support local economies, and are healthy for consumers. It involves considering the entire lifecycle of food—from how it's grown and processed to how it's packaged and transported—with minimal negative impact on our planet.
                            </Text>
                            <View style={styles.actionTip}>
                                <Text style={styles.tipText}>🌍 Every sustainable choice helps protect our planet's future</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.card, styles.healthCard]}
                    onPress={() => toggleCard('health')}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardHeader}>
                        <FontAwesome5 name="heartbeat" size={24} color="white" />
                        <Text style={styles.cardTitle}>Health Benefits</Text>
                        <MaterialIcons
                            name={expandedCard === 'health' ? 'expand-less' : 'expand-more'}
                            size={28}
                            color="white"
                        />
                    </View>

                    <Text style={styles.cardContent}>
                        Eating sustainably isn't just good for the planet—it's great for your health too...
                    </Text>

                    {expandedCard === 'health' && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.cardContent}>
                                By choosing foods that are produced with eco-friendly methods, you're likely to consume fewer pesticides and more nutrients. Sustainable eating often means opting for seasonal, locally-grown produce and whole foods over processed alternatives.
                            </Text>
                            <View style={styles.actionTip}>
                                <Text style={styles.tipText}>🌱 Try adding one more plant-based meal to your week</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, styles.planetCard]}
                    onPress={() => toggleCard('planet')}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardHeader}>
                        <Ionicons name="earth" size={24} color="white" />
                        <Text style={styles.cardTitle}>For The Planet</Text>
                        <MaterialIcons
                            name={expandedCard === 'planet' ? 'expand-less' : 'expand-more'}
                            size={28}
                            color="white"
                        />
                    </View>

                    <Text style={styles.cardContent}>
                        Sustainable eating practices are a powerful way to reduce our environmental footprint...
                    </Text>

                    {expandedCard === 'planet' && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.cardContent}>
                                By choosing locally sourced, seasonal foods and minimizing meat consumption, we can significantly cut down on greenhouse gas emissions from transportation and livestock production.
                            </Text>
                            {renderImpactMeter('Carbon Footprint', 73, '#FFD700')}
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, styles.impactCard]}
                    onPress={() => toggleCard('impact')}
                    activeOpacity={0.9}
                >
                    <View style={styles.cardHeader}>
                        <FontAwesome5 name="hands-helping" size={24} color="white" />
                        <Text style={styles.cardTitle}>The Impact</Text>
                        <MaterialIcons
                            name={expandedCard === 'impact' ? 'expand-less' : 'expand-more'}
                            size={28}
                            color="white"
                        />
                    </View>

                    <Text style={styles.cardContent}>
                        Every individual's food choices can create a ripple effect of positive change...
                    </Text>

                    {expandedCard === 'impact' && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.cardContent}>
                                When you opt for sustainable eating, you're not just making a personal choice—you're influencing market demand. Your choices also inspire friends and family, potentially changing their habits too.
                            </Text>
                            <View style={styles.challengeBox}>
                                <Text style={styles.challengeTitle}>Weekly Challenge</Text>
                                <Text style={styles.challengeText}>Try one new seasonal vegetable this week</Text>
                                <TouchableOpacity style={styles.challengeButton}>
                                    <Text style={styles.challengeButtonText}>I'll try it!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 20,
    },
    textHeader: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        elevation: 2,
    },
    backButtonText: {
        color: '#4BA9FF',
        fontWeight: '600',
        marginLeft: 4,
    },
    factBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
    },
    factText: {
        marginLeft: 12,
        flex: 1,
        color: '#2d3748',
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 12,
        flex: 1,
    },
    cardContent: {
        fontSize: 15,
        lineHeight: 22,
        color: 'white',
        marginTop: 8,
    },
    definitionCard: {
        backgroundColor: '#41BD4B',
    },
    healthCard: {
        backgroundColor: '#41BD4B',
    },
    planetCard: {
        backgroundColor: '#41BD4B',
    },
    impactCard: {
        backgroundColor: '#41BD4B',
    },
    expandedContent: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.3)',
    },
    actionTip: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    tipText: {
        color: 'white',
        fontWeight: '600',
    },
    meterContainer: {
        marginTop: 16,
    },
    meterTitle: {
        color: 'white',
        marginBottom: 6,
        fontWeight: '600',
    },
    meterBackground: {
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 4,
    },
    meterFill: {
        height: '100%',
        borderRadius: 6,
    },
    meterValue: {
        color: 'white',
        fontSize: 12,
        textAlign: 'right',
    },
    challengeBox: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    challengeTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    challengeText: {
        color: 'white',
        marginBottom: 12,
    },
    challengeButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    challengeButtonText: {
        color: '#4BA9FF',
        fontWeight: '600',
    },
});

export default WhySustainabilityScreen;