import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './Themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface HomeNavButtonProps {
  title: string;
  icon: string;
  location: string;
  color: string;
  size: number;
  onPress?: () => void;
}

const HomeNavButton: React.FC<HomeNavButtonProps> = ({
  title,
  icon,
  size,
  color,
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
        <View style={styles.icon}>
          <MaterialCommunityIcons name={icon} size={size} color={color}/>
        </View>
      </>
    </TouchableOpacity>
  );
};

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
    paddingVertical: 30,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 25,
    backgroundColor: "#41BD4B",
    borderRadius: 30
  },
  icon: {
    marginLeft: "auto"
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: 'white',
    paddingTop: 5
  }
});

export { HomeNavButton };