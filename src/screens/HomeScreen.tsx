import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { userData } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {userData?.name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
  },
});

export default HomeScreen;