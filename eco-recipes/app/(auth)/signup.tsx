import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from "@/components/Themed";
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './NavigationTypes';
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
                navigation.navigate("Login");
            } else {
                setError('No token received');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const goToLogin = () => {
        navigation.navigate("Login");
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.heading}>Create Account</Text>
                <Text style={styles.subheading}>Join us to get started.</Text>
                
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        autoCapitalize="none"
                        placeholder="Choose a username"
                    />
                    
                    <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="Enter your email"
                    />
                    
                    <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Create a password"
                    />
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={goToLogin}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4BA9FF',
    },
    innerContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    subheading: {
        fontSize: 16,
        color: 'white',
        marginBottom: 32,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: 'white',
        fontSize: 14,
    },
    footerLink: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    errorText: {
        color: '#ff3b30',
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
    },
});