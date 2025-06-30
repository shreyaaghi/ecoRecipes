import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';


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
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          marginTop: 6,
          color: 'black',
          fontSize: 12,
        },
        headerShown: false,
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home Screen',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={"black"}/>,
        }}
      />
      <Tabs.Screen
        name="CreateRecipe"
        options={{
          title: 'Create Recipe',
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="pluscircle"
              color="#4CAF50"
              size={30}
              style={{ marginBottom: -10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => <FontAwesome5 name="door-open" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
