import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Login: undefined,
    Signup: undefined
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;