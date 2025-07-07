import React from 'react';
// import { Stack } from 'expo-router/stack';
import Login from './login';
import SignUp from './signup';

import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStackParamList } from "./NavigationTypes";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function Layout() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}