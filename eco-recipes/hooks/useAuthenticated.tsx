import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useToken } from './useToken';

function useAuthenticated() {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const api_url = process.env.EXPO_PUBLIC_API_URL || "";
    const { token, error } = useToken();

    useEffect(() => {
        const validateUser = async () => {
            if (token === null) {
                return;
            }

            if (error) {
                console.error(error);
                Alert.alert("Error", "An unexpected error occurred. Please try logging in again.");
                router.replace("/auth/login");
                return;
            }

            if (!token) {
                router.replace("/auth/login");
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp && typeof decoded.exp == 'number') {
                    const isValid = decoded.exp > currentTime

                    if (!isValid) {
                        await AsyncStorage.removeItem('userToken');
                        Alert.alert("Session Expired", "Please log in again.")
                        router.replace("/auth/login");
                        return;
                    }
                } else {
                    await AsyncStorage.removeItem('userToken');
                    Alert.alert("Invalid Token", "Please log in again.")
                    router.replace("/auth/login");
                    return;
                }

                try {
                    const { data } = await axios.get(`${api_url}/users/`, { headers: { "x-access-token": token } });
                    setUsername(data.data.username);
                } catch (fetchError) {
                    console.error("Error fetching user data:", fetchError);
                    Alert.alert("Error", "Failed to fetch user data. Please try again.");
                }

            } catch (decodeError) {
                console.error("Error decoding token:", decodeError);
                await AsyncStorage.removeItem('userToken');
                Alert.alert("Invalid Token", "Please log in again.");
                router.replace("/auth/login");
            }
        };
        validateUser();
    }, [token, error]) 
    return username;
};

export { useAuthenticated };