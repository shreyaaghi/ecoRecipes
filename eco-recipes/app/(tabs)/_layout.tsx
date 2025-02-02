import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabOneScreen from '.';
import TabTwoScreen from './two';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import CreateRecipeScreen from './CreateRecipe';

const Tabs = createBottomTabNavigator();

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#4BA9FF',
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
      
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        // headerShown: useClientOnlyValue(false, true),
        headerShown: false,
        // tabBarStyle: {{
        //   backgroun
        // }}
      }}>
      <Tabs.Screen
        name="index"
        component={TabOneScreen}
        options={{
          title: 'Home Screen',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CreateRecipe"
        component={CreateRecipeScreen}
        options={{
          title: 'Create Recipe',
          tabBarIcon: ({ color, size }) => <AntDesign name="pluscircle" style={{ marginBottom: -3 }} color={'#4CAF50'} size={30} />
        }}
      />
      <Tabs.Screen
        name="two"
        component={TabTwoScreen}
        options={{
          title: 'Information',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}
