import React from 'react';
import { Text } from "./Themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';

const MealPlanButton = ({name, id}: Record<string, string>) => {
    const router = useRouter();
    return (
        <TouchableOpacity key={id} style={styles.row} onPress={() => router.navigate(`/mealplans/${id}`)}>
          <Text style={styles.buttonText}>{name}</Text>
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
      backgroundColor: "#41BD4B",
      borderRadius: 30
    },
    buttonText: {
      fontSize: 25,
      color: "white",
      fontWeight: "bold"
    }
  });

export {MealPlanButton};