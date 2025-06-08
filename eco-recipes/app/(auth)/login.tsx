import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from "react-native";
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from "@/components/Themed";
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './NavigationTypes';
type SignupProps = { navigation: AuthNavigationProp; };

export default function Login() {
    // React.useEffect(() => {
    //     console.info("Made it to Login")
    // }, []);
    const navigation = useNavigation<AuthNavigationProp>();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const api_url = process.env.EXPO_PUBLIC_API_URL||"";

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        };

        try {
            const {data: loginData} = await axios.post(`${api_url}/auth/login`, {email, password}, {timeout: 5000});
            if (loginData?.error) {
                setError(loginData.error);
                return;
            }
        
            if (loginData.data) {
                await AsyncStorage.setItem('userToken', loginData.data);
                console.info(`Token: ${await AsyncStorage.getItem('userToken')}`);
                router.replace('/(tabs)');
            } else {
                setError('no token');
            }
        } catch (error) {
            setError(`An error occured: ${error}`);
        }
      };
    const goToSignup = () => {
        // router.replace("/(auth)/Signup");
        navigation.navigate("Signup")
    };


    return (
        <>
            <View style={styles.body}>
                <Text style={styles.heading}>Login</Text>
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
                <TouchableOpacity style={styles.link} onPress={goToSignup}>
                    <Text style={styles.linkText}>Don't have an account? Sign up here.</Text>
                </TouchableOpacity>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
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
        // width: 500,
        // height: 1000,
        // flex: "auto",
        flex: 1,
        paddingTop: 40
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
        width: '25%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
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
        textAlign: 'center',
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