import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from "@/components/Themed";
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from './NavigationTypes';

export default function Login() {
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
                router.replace('/(tabs)');
            } else {
                setError('No token received');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const goToSignup = () => {
        navigation.navigate("Signup");
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.heading}>Welcome Back</Text>
                <Text style={styles.subheading}>Sign in to continue.</Text>
                
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email</Text>
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
                        placeholder="Enter your password"
                    />
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={goToSignup}>
                            <Text style={styles.footerLink}>Sign Up</Text>
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