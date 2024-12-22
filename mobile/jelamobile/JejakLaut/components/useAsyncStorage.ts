import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useAsyncStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        (async () => {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue) {
                setValue(JSON.parse(jsonValue));
            }
        })();
    }, [key]);

    const saveValue = async (newNvalue: T) => {
        setValue(newNvalue);
        await AsyncStorage.setItem(key, JSON.stringify(newNvalue));
    };
    
    return [value, saveValue] as [T, typeof saveValue];
}