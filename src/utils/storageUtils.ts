import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  BIOMETRIC_ENABLED: '@biometric_enabled',
  OFFLINE_QUEUE: '@offline_queue',
  LAST_SYNC: '@last_sync',
  USER_ID: '@user_id'
};

export const storage = {
  async get(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  },

  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }
};