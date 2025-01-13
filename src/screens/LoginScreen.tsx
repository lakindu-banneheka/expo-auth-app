import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, TextInput, StyleSheet } from "react-native";
import { AuthContext } from "../contexts/AuthContext";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = React.useContext(AuthContext);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isRegistering && (!name || !phone)) {
      Alert.alert('Error', 'Please fill in all registration fields');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await auth.signUp(email, password, name, phone);
      } else {
        await auth.signIn(email, password);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      
      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button
            title={isRegistering ? "Register" : "Login"}
            onPress={handleAuth}
          />
          <Button
            title={isRegistering ? "Switch to Login" : "Switch to Register"}
            onPress={() => setIsRegistering(!isRegistering)}
          />
        </>
      )}
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});