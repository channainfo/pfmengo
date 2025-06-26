import React, { useState, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';

import { register, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store';
import { TierType } from '../../types';
import { getThemeForTier, TIER_NAMES } from '../../constants/themes';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const selectedTier = (route.params as any)?.selectedTier || TierType.CONNECT;
  const theme = getThemeForTier(selectedTier);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: new Date(2000, 0, 1),
    tier: selectedTier,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }

    // Age validation
    const age = new Date().getFullYear() - formData.birthDate.getFullYear();
    if (age < 18) {
      errors.birthDate = 'You must be at least 18 years old';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        tier: formData.tier,
        birthDate: formData.birthDate.toISOString().split('T')[0],
        phone: formData.phone || undefined,
      };

      await dispatch(register(registrationData)).unwrap();
    } catch (err) {
      console.log('Registration error:', err);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignIn = () => {
    navigation.navigate('Login' as never);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('birthDate', selectedDate);
    }
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animatable.View animation="fadeInDown" duration={800}>
            <Text style={styles.title}>Join {TIER_NAMES[selectedTier]}</Text>
            <Text style={styles.subtitle}>
              Let's get you started on your dating journey
            </Text>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUp" 
            duration={800}
            delay={200}
            style={styles.form}
          >
            {/* Name Inputs */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'firstName' && styles.inputWrapperFocused,
                  formErrors.firstName && styles.inputWrapperError
                ]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="John"
                    placeholderTextColor="#BDC3C7"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                {formErrors.firstName && (
                  <Text style={styles.errorText}>{formErrors.firstName}</Text>
                )}
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'lastName' && styles.inputWrapperFocused
                ]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Doe"
                    placeholderTextColor="#BDC3C7"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'email' && styles.inputWrapperFocused,
                formErrors.email && styles.inputWrapperError
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={focusedField === 'email' ? theme.colors.primary : '#7F8C8D'} 
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
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'phone' && styles.inputWrapperFocused
              ]}>
                <Ionicons 
                  name="call-outline" 
                  size={20} 
                  color={focusedField === 'phone' ? theme.colors.primary : '#7F8C8D'} 
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#BDC3C7"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Birth Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Birth Date *</Text>
              <TouchableOpacity
                style={[
                  styles.inputWrapper,
                  formErrors.birthDate && styles.inputWrapperError
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#7F8C8D" />
                <Text style={styles.dateText}>
                  {formData.birthDate.toLocaleDateString()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7F8C8D" />
              </TouchableOpacity>
              {formErrors.birthDate && (
                <Text style={styles.errorText}>{formErrors.birthDate}</Text>
              )}
            </View>

            {/* Password Inputs */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
                formErrors.password && styles.inputWrapperError
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedField === 'password' ? theme.colors.primary : '#7F8C8D'} 
                />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Create a strong password"
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
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <View style={[
                styles.inputWrapper,
                focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                formErrors.confirmPassword && styles.inputWrapperError
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={focusedField === 'confirmPassword' ? theme.colors.primary : '#7F8C8D'} 
                />
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  placeholder="Confirm your password"
                  placeholderTextColor="#BDC3C7"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#7F8C8D" 
                  />
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword && (
                <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <Animatable.View animation="shake" style={styles.globalErrorContainer}>
                <Ionicons name="alert-circle" size={16} color="#E74C3C" />
                <Text style={styles.globalErrorText}>{error}</Text>
              </Animatable.View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: theme.colors.primary },
                isLoading && styles.registerButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                Privacy Policy
              </Text>
            </Text>
          </Animatable.View>

          {/* Sign In Link */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={800}
            delay={400}
            style={styles.signInContainer}
          >
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={[styles.signInLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1950, 0, 1)}
          />
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
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
  inputWrapperError: {
    borderColor: '#E74C3C',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '400',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '400',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 4,
  },
  globalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FADBD8',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  globalErrorText: {
    fontSize: 14,
    color: '#E74C3C',
    flex: 1,
  },
  registerButton: {
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  termsText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signInText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;