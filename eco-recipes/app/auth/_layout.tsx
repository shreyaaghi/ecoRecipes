import React from 'react';
import { Stack } from 'expo-router/stack';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="login"></Stack.Screen>
        </Stack>

    )
}