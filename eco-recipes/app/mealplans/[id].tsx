import { View, Text } from 'react-native';
import { usePathname } from 'expo-router';
const MealPlan = () => {
    const pathname = usePathname();
    return (
        <View><Text>{pathname}</Text></View>
    )
}

export default MealPlan;