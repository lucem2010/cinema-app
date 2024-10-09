import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkIfUserExistsInAsyncStorage = async (): Promise<boolean> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData !== null;
  } catch (error) {
    console.error('Failed to check if user exists in AsyncStorage:', error);
    return false;
  }
};
