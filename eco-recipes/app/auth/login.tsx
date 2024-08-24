import { Text } from "react-native";
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { View } from "@/components/Themed";
import { useState, useEffect } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <View style={styles.body}>
                <Text style={styles.heading}>Login</Text>
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
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 50,
        paddingTop: 10,
        paddingLeft: 20,
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
        margin: 15,
        borderWidth: 2,
        padding: 10,
        borderColor: "#ffffff"
    },
    titles: {
        paddingTop: 30,
        paddingBottom: 0,
        paddingLeft: 17,
        color: "#ffffff",
        backgroundColor: '#4BA9FF'
    },
});  