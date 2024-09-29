import { View, Text } from 'react-native';
import { usePathname } from 'expo-router';
const Recipe = () => {
    const pathname = usePathname();
    return (
        <View><Text>{pathname}</Text></View>
    )
}

export default Recipe;