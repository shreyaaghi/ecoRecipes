import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";

function useToken() {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('userToken');
                setToken(storedToken || "");
                setError(null);
            } catch (tokenError) {
                setError("Error in token validation:" + tokenError);
                setToken("")
            }
        };

        getToken();
    }, []);
    return { token, error };
}
export { useToken };
