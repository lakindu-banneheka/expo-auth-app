// // import React, { useState } from 'react';
// // import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
// // import { useAuth } from '../contexts/AuthContext';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../types';

// // type Props = {
// //   navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
// // };

// // const LoginScreen = ({ navigation }: Props) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const { login } = useAuth();

// //   const handleLogin = async () => {
// //     try {
// //       await login(email, password);
// //     } catch (error: any) {
// //       Alert.alert('Error', error.message);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Email"
// //         value={email}
// //         onChangeText={setEmail}
// //         autoCapitalize="none"
// //         keyboardType="email-address"
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Password"
// //         value={password}
// //         onChangeText={setPassword}
// //         secureTextEntry
// //       />
// //       <Button title="Login" onPress={handleLogin} />
// //       <Button 
// //         title="Register" 
// //         onPress={() => navigation.navigate('Register')}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     padding: 10,
// //     marginBottom: 10,
// //     borderRadius: 5,
// //   },
// // });

// // export default LoginScreen;

// import React, { useState } from 'react';
// import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import { useAuth } from '../contexts/AuthContext';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../types';
// import { AppError } from '../utils/errorUtils';

// type Props = {
//   navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
// };

// const LoginScreen = ({ navigation }: Props) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//     } catch (error) {
//       if (error instanceof AppError) {
//         switch (error.code) {
//           case 'network/offline':
//             Alert.alert('No Connection', 'Please check your internet connection');
//             break;
//           case 'auth/wrong-password':
//             Alert.alert('Error', 'Incorrect password');
//             break;
//           case 'auth/biometric-failed':
//             Alert.alert('Authentication Failed', 'Biometric verification failed');
//             break;
//           default:
//             Alert.alert('Error', error.message);
//         }
//       } else {
//         // Handle any unexpected errors
//         Alert.alert('Error', 'An unexpected error occurred.');
//         console.error('Unexpected error:', error);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Login" onPress={handleLogin} />
//       <Button 
//         title="Register" 
//         onPress={() => navigation.navigate('Register')}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
// });

// export default LoginScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const { login, authenticateWithBiometrics, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricLoading, setBiometricLoading] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Success', 'You are now logged in!');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    try {
      const authenticated = await authenticateWithBiometrics();
      if (authenticated) {
        Alert.alert('Success', 'Biometric Authentication Successful!');
        // Optionally, retrieve user data or navigate to the main screen
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Biometric Authentication Failed.');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator style={styles.loading} />}
      
      <Text style={styles.orText}>OR</Text>
      
      <TouchableOpacity onPress={handleBiometricLogin} disabled={isBiometricLoading}>
        <View style={styles.biometricButton}>
          {isBiometricLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.biometricText}>Login with Biometrics</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  loading: {
    marginVertical: 10,
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#888',
  },
  biometricButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  biometricText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
