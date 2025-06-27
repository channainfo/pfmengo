import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { login, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      // Navigation will be handled by the navigation container
      // based on authentication state
    } catch (err) {
      // Error is handled by the slice
      console.log('Login error:', err);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    Alert.alert('Forgot Password', 'This feature will be available soon.');
  };

  const handleSignUp = () => {
    navigation.navigate('TierSelection' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <Animatable.View animation="fadeInDown" duration={800}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Continue your dating journey
            </Text>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUp" 
            duration={800}
            delay={200}
            style={styles.form}
          >
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedField === 'email' ? '#4ECDC4' : '#7F8C8D'} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#BDC3C7"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedField === 'password' ? '#4ECDC4' : '#7F8C8D'} 
                />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#BDC3C7"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#7F8C8D" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <Animatable.View animation="shake" style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#E74C3C" />
                <Text style={styles.errorText}>{error}</Text>
              </Animatable.View>
            )}

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </Animatable.View>

          {/* Sign Up Link */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={800}
            delay={400}
            style={styles.signUpContainer}
          >
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '400',
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FADBD8',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#E74C3C',
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signUpText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  signUpLink: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
});

export default LoginScreen;