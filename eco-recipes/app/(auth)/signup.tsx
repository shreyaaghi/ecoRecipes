import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from "react-native";
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from "@/components/Themed";
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './NavigationTypes';
type SignupProps = { navigation: AuthNavigationProp; };
import axios from "axios";

export default function SignUp() {
    const navigation = useNavigation<AuthNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const api_url = process.env.EXPO_PUBLIC_API_URL||"";

    const handleSignup = async () => {
        if (!email || !password || !username) {
            setError('Please fill in all fields');
            return;
        };
        setError("");

        try {
            const {data: signupData} = await axios.post(`${api_url}/auth/signup`, {email, password, username}, {timeout: 5000});
            if (signupData?.error) {
                setError(signupData.error);
                return;
            }
        
            if (signupData.data) {
                await AsyncStorage.setItem('userToken', signupData.data);
                navigation.navigate("Login")
            } else {
                setError('no token');
            }
        } catch (error) {
            setError(`An error occured: ${error}`);
        }
    };
    const goToLogin = () => {
        navigation.navigate("Login");
    };

    return (
        <>
            <View style={styles.body}>
                <Text style={styles.heading}>Sign Up</Text>
                <Text style={styles.titles}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize={"none"}
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
                    autoCapitalize={"none"}
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
        flex: 1
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
        marginTop:10,
        borderRadius: 15,
        width: '30%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      link: {
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
      },
      linkText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textAlign: 'center'
      },
      errorText: {
        color: 'red',
        fontSize: 13,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 10
      },
});  