import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { TIER_ICONS, TIER_NAMES, TIER_DESCRIPTIONS } from '../../constants/themes';
import { TierType } from '../../types';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('TierSelection' as never);
  };

  const handleSignIn = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#2C3E50']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <Animatable.View 
            animation="fadeInDown" 
            duration={1000}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={60} color="white" />
            </View>
            <Text style={styles.title}>Three-Tier Dating</Text>
            <Text style={styles.subtitle}>
              Find your perfect match with purpose
            </Text>
          </Animatable.View>

          {/* Tier Preview */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1000}
            delay={300}
            style={styles.tiersContainer}
          >
            <Text style={styles.tiersTitle}>Choose Your Journey</Text>
            
            {Object.values(TierType).map((tier, index) => (
              <Animatable.View
                key={tier}
                animation="fadeInLeft"
                duration={800}
                delay={500 + (index * 200)}
                style={styles.tierPreview}
              >
                <Text style={styles.tierIcon}>{TIER_ICONS[tier]}</Text>
                <View style={styles.tierInfo}>
                  <Text style={styles.tierName}>{TIER_NAMES[tier]}</Text>
                  <Text style={styles.tierDescription}>
                    {TIER_DESCRIPTIONS[tier]}
                  </Text>
                </View>
              </Animatable.View>
            ))}
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1000}
            delay={1200}
            style={styles.buttonsContainer}
          >
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.05,
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
  },
  tiersContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 40,
  },
  tiersTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  tierPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    backdropFilter: 'blur(10px)',
  },
  tierIcon: {
    fontSize: 30,
    marginRight: 20,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
  },
  tierDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  buttonsContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
});

export default WelcomeScreen;