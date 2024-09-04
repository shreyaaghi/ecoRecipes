import { Text } from "react-native";
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from "@/components/Themed";
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from "axios";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const api_url = process.env.EXPO_PUBLIC_API_URL||"";

    const handleSignup = async () => {
        const {data: signupData} = await axios.post(`${api_url}/auth/signup`, {email, password, username});
        if (signupData?.error) {
            setError(signupData.error);
            return;
        }
        // todo - save token to async storage 
        router.replace('/(tabs)');
      };
    const goToLogin = () => {
        router.replace('/auth/login');
    }
    return (
        <>
            <View style={styles.body}>
                <Text style={styles.heading}>Sign Up</Text>
                <Text style={styles.titles}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                />
                <Text style={styles.titles}>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                <Text style={styles.titles}>Username</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUsername}
                    value={username}
                />
                <TouchableOpacity style={styles.link} onPress={goToLogin}>
                    <Text style={styles.linkText}>Already have an account? Login here.</Text>
                </TouchableOpacity>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 50,
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 60,
        color: "#fff"
    },
    body: {
        backgroundColor: '#4BA9FF',
        width: 500,
        height: 1000
    },
    input: {
        height: 40,
        width:360,
        borderRadius: 10,
        margin: 15,
        borderWidth: 2,
        padding: 10,
        backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        color: "black"
    },
    titles: {
        paddingTop: 30,
        paddingBottom: 0,
        paddingLeft: 17,
        color: "#ffffff",
        backgroundColor: '#4BA9FF'
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 15,
        width: '25%',
        marginLeft: 125,
        marginTop: 25,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      link: {
        width: '80%',
        marginLeft: 65,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
      },
      linkText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
      },
      errorText: {
        color: 'red',
        fontSize: 13,
        marginLeft: 140,
        marginTop: 20
      },
});  