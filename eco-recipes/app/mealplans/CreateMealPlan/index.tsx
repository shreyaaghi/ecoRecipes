import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import { SelectModal } from '../components/SelectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreateMealPlanScreen() {
    const [text, setText] = useState('');
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#4BA9FF" }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.textHeader}>
                        <Text style={styles.title}>Create Meal Plan</Text>
                    </View>
                </View>
                <ScrollView>
                    <View>
                        <View style={styles.container}>
                            <Text style={styles.titles}>Meal Plan Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter meal plan name here (ex. paleo diet) `}
                                onChangeText={(text => setText(text))}
                            />
                        </View>
                    </View>

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
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        height: 40,
        width: width * 0.8 - 5,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        color: "black",
        marginVertical:5
    },
    titles: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        width: width * 0.25,
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
