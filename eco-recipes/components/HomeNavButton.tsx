import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './Themed';

interface HomeNavButtonProps {
  title: string;
  icon: string;
  location: string;
  onPress?: () => void;
}

const HomeNavButton: React.FC<HomeNavButtonProps> = ({
  title,
  icon,
  location,
  onPress
}) => {
  return (
    <TouchableOpacity 
      onPress={() => {
        console.info(`pressed ${location}`);
        if (onPress) {
          onPress();
        }
      }} 
      style={styles.row}
    >
      <>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.icon}>{icon}</Text>
      </>
    </TouchableOpacity>
  );
};

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
  icon: {
    color: "white"
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: 'white'
  }
});

export { HomeNavButton };