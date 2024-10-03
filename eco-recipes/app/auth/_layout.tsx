import React from 'react';
import { Stack } from 'expo-router/stack';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="signup" options={{ headerShown: false }}></Stack.Screen>
        </Stack>
    )
}