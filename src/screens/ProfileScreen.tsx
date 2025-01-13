import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { userData, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>Name: {userData?.name}</Text>
      <Text>Email: {userData?.email}</Text>
      <Text>Phone: {userData?.phoneNumber}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfileScreen;