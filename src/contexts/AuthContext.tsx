// import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { 
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   User
// } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as SplashScreen from 'expo-splash-screen';
// import { UserData } from '../types';
// import { auth, db } from '../config/firebase';

// // Keep splash screen visible while we fetch the token
// SplashScreen.preventAutoHideAsync();

// type AuthContextType = {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   register: (email: string, password: string, name: string, phoneNumber: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const USER_DATA_STORAGE_KEY = '@user_data';
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load cached user data
//   const loadCachedUserData = async (uid: string) => {
//     try {
//       const cachedData = await AsyncStorage.getItem(`${USER_DATA_STORAGE_KEY}_${uid}`);
//       if (cachedData) {
//         setUserData(JSON.parse(cachedData));
//         return JSON.parse(cachedData);
//       }
//       return null;
//     } catch (error) {
//       console.error('Error loading cached user data:', error);
//       return null;
//     }
//   };

//   // Cache user data
//   const cacheUserData = async (uid: string, data: UserData) => {
//     try {
//       await AsyncStorage.setItem(`${USER_DATA_STORAGE_KEY}_${uid}`, JSON.stringify(data));
//     } catch (error) {
//       console.error('Error caching user data:', error);
//     }
//   };

//   // Fetch fresh user data from Firestore
//   const fetchUserData = async (uid: string) => {
//     try {
//       const userDoc = await getDoc(doc(db, 'users', uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data() as UserData;
//         setUserData(data);
//         await cacheUserData(uid, data);
//         return data;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);
      
//       if (user) {
//         // Try to load cached data first for instant UI update
//         const cachedData = await loadCachedUserData(user.uid);
        
//         // Fetch fresh data from Firestore
//         await fetchUserData(user.uid);
        
//         // Update last login timestamp
//         const timestamp = new Date().toISOString();
//         await setDoc(doc(db, 'users', user.uid), 
//           { lastLoginAt: timestamp }, 
//           { merge: true }
//         );
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//       // Hide splash screen once we're done loading
//       await SplashScreen.hideAsync();
//     });

//     return unsubscribe;
//   }, []);

//   const register = async (email: string, password: string, name: string, phoneNumber: string) => {
//     try {
//       const { user } = await createUserWithEmailAndPassword(auth, email, password);
//       const timestamp = new Date().toISOString();
//       const userData: UserData = {
//         email,
//         name,
//         phoneNumber,
//         createdAt: timestamp,
//         lastLoginAt: timestamp,
//       };
//       await setDoc(doc(db, 'users', user.uid), userData);
//       await cacheUserData(user.uid, userData);
//       setUserData(userData);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       const uid = user?.uid;
//       if (uid) {
//         await AsyncStorage.removeItem(`${USER_DATA_STORAGE_KEY}_${uid}`);
//       }
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, userData, loading, register, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as LocalAuthentication from 'expo-local-authentication';
import NetInfo from '@react-native-community/netinfo';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { checkConnectivity } from '../utils/networkUtils';
import { AppError, handleError } from '../utils/errorUtils';
import { auth, db } from '../config/firebase';

SplashScreen.preventAutoHideAsync();

type UserData = {
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  lastLoginAt: string;
  lastSyncedAt?: string;
  offlineData?: any;
};

type OfflineQueueAction = {
  type: string;
  data: any;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  register: (email: string, password: string, name: string, phoneNumber: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
  syncOfflineData: () => Promise<void>;
};

const USER_DATA_STORAGE_KEY = '@user_data';
const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';
const OFFLINE_QUEUE_KEY = '@offline_queue';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const setupBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
        setBiometricEnabled(enabled === 'true');
      }
    } catch (error) {
      console.error('Error setting up biometrics:', error);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access the app',
        fallbackLabel: 'Use password',
      });
      return result.success;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  };

  const loadCachedUserData = async (uid: string) => {
    try {
      const cachedData = await AsyncStorage.getItem(`${USER_DATA_STORAGE_KEY}_${uid}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setUserData(parsedData);
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Error loading cached user data:', error);
      return null;
    }
  };

  const cacheUserData = async (uid: string, data: UserData) => {
    try {
      await AsyncStorage.setItem(`${USER_DATA_STORAGE_KEY}_${uid}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching user data:', error);
    }
  };

  const fetchUserData = async (uid: string) => {
    try {
      const isConnected = await checkConnectivity();
      if (!isConnected) throw new AppError('No internet connection', 'network/offline');

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        await cacheUserData(uid, data);
        return data;
      }
      return null;
    } catch (error) {
      throw handleError(error);
    }
  };

  const syncOfflineData = async () => {
    if (isOffline) return;

    try {
      const queue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (queue) {
        const queueData: OfflineQueueAction[] = JSON.parse(queue);
        for (const action of queueData) {
          if (action.type === 'UPDATE_PROFILE' && user) {
            await setDoc(doc(db, 'users', user.uid), action.data, { merge: true });
          }
        }
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
        const timestamp = new Date().toISOString();
        if (user) {
          await setDoc(doc(db, 'users', user.uid), { lastSyncedAt: timestamp }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  };

  useEffect(() => {
    setupBiometrics();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadCachedUserData(currentUser.uid);
        try {
          await fetchUserData(currentUser.uid);
          await syncOfflineData();
        } catch (error) {
          if (error instanceof AppError && error.code === 'network/offline') {
            console.log('Operating in offline mode');
          } else {
            console.error('Error during auth state handling:', error);
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
      await SplashScreen.hideAsync();
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (biometricEnabled) {
        const authenticated = await authenticateWithBiometrics();
        if (!authenticated) throw new AppError('Biometric auth failed', 'auth/biometric-failed');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  const register = async (email: string, password: string, name: string, phoneNumber: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const data: UserData = {
        email,
        name,
        phoneNumber,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', uid), data);
      setUserData(data);
      await cacheUserData(uid, data);
    } catch (error) {
      throw handleError(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isOffline,
        register,
        login,
        logout,
        authenticateWithBiometrics,
        syncOfflineData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
