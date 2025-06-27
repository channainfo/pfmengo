import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConnectCompatibilityScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect Compatibility Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConnectCompatibilityScreen;