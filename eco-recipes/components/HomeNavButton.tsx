import React from 'react';
import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import { Text } from './Themed';

const HomeNavButton = ({
    title, icon, location
}: Record<string, string>) => {
    return (
        <TouchableOpacity onPress={() => {console.info(`pressed ${location}`)}} style={styles.row}>
            <>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.icon}>{icon}</Text>
            </>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: "space-around",
        paddingTop: 30,
        paddingBottom: 30,
        marginBottom: 40,
        marginHorizontal: 20,
        backgroundColor:"#41BD4B",
        borderRadius:30
    },
    icon:{

    },
    title: {
        fontSize: 25
    }
})

export { HomeNavButton };