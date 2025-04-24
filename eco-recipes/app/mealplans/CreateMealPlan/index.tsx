import { StyleSheet, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { Text, View, ScrollView, Button, TextInput } from 'react-native';
import { SelectModal } from '../components/SelectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CreateMealPlanScreen() {
    return (
        <View>
            <Text>
                Hi
            </Text>
        </View>
    )
}
