import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { 
  TIER_ICONS, 
  TIER_NAMES, 
  TIER_DESCRIPTIONS,
  getThemeForTier,
  SPARK_THEME,
  CONNECT_THEME,
  FOREVER_THEME
} from '../../constants/themes';
import { TierType } from '../../types';

const { width, height } = Dimensions.get('window');

const TIER_DETAILS = {
  [TierType.SPARK]: {
    features: [
      'Tonight Mode for spontaneous meetups',
      'Local events and activities',
      'Quick matching and casual vibes',
      'Story sharing that disappears',
      'Group hangouts and social events'
    ],
    price: 'Free to start',
    theme: SPARK_THEME,
  },
  [TierType.CONNECT]: {
    features: [
      'Daily curated matches',
      'Compatibility scoring',
      'Video dating features',
      'Deep conversation starters',
      'AI relationship coaching'
    ],
    price: 'Premium features available',
    theme: CONNECT_THEME,
  },
  [TierType.FOREVER]: {
    features: [
      'Comprehensive profiles',
      'Background verification',
      'Family planning tools',
      'Reference system',
      'Marriage-focused matching'
    ],
    price: 'Commitment-based pricing',
    theme: FOREVER_THEME,
  },
};

const TierSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTier, setSelectedTier] = useState<TierType | null>(null);

  const handleTierSelect = (tier: TierType) => {
    setSelectedTier(tier);
  };

  const handleContinue = () => {
    if (selectedTier) {
      navigation.navigate('Register' as never, { selectedTier } as never);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Dating Style</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animatable.View animation="fadeInDown" duration={800}>
            <Text style={styles.title}>What are you looking for?</Text>
            <Text style={styles.subtitle}>
              Select the tier that matches your relationship goals
            </Text>
          </Animatable.View>

          <View style={styles.tiersContainer}>
            {Object.values(TierType).map((tier, index) => {
              const details = TIER_DETAILS[tier];
              const isSelected = selectedTier === tier;
              
              return (
                <Animatable.View
                  key={tier}
                  animation="fadeInUp"
                  duration={600}
                  delay={200 + (index * 150)}
                >
                  <TouchableOpacity
                    style={[
                      styles.tierCard,
                      isSelected && styles.tierCardSelected,
                      { borderColor: details.theme.colors.primary }
                    ]}
                    onPress={() => handleTierSelect(tier)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={isSelected ? details.theme.gradients.primary : ['#ffffff', '#f8f9fa']}
                      style={styles.tierCardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.tierCardHeader}>
                        <Text style={[
                          styles.tierEmoji,
                          isSelected && styles.tierEmojiSelected
                        ]}>
                          {TIER_ICONS[tier]}
                        </Text>
                        <View style={styles.tierTitleContainer}>
                          <Text style={[
                            styles.tierTitle,
                            isSelected && styles.tierTitleSelected
                          ]}>
                            {TIER_NAMES[tier]}
                          </Text>
                          <Text style={[
                            styles.tierPrice,
                            isSelected && styles.tierPriceSelected
                          ]}>
                            {details.price}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons 
                            name="checkmark-circle" 
                            size={24} 
                            color="white" 
                          />
                        )}
                      </View>

                      <Text style={[
                        styles.tierMainDescription,
                        isSelected && styles.tierMainDescriptionSelected
                      ]}>
                        {TIER_DESCRIPTIONS[tier]}
                      </Text>

                      <View style={styles.featuresContainer}>
                        {details.features.map((feature, featureIndex) => (
                          <View key={featureIndex} style={styles.featureRow}>
                            <Ionicons 
                              name="checkmark" 
                              size={16} 
                              color={isSelected ? 'white' : details.theme.colors.primary} 
                            />
                            <Text style={[
                              styles.featureText,
                              isSelected && styles.featureTextSelected
                            ]}>
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </View>
        </ScrollView>

        {/* Continue Button */}
        {selectedTier && (
          <Animatable.View 
            animation="fadeInUp" 
            duration={500}
            style={styles.continueContainer}
          >
            <LinearGradient
              colors={TIER_DETAILS[selectedTier].theme.gradients.primary}
              style={styles.continueButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity 
                onPress={handleContinue}
                style={styles.continueButtonTouchable}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>
                  Continue with {TIER_NAMES[selectedTier]}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </LinearGradient>
          </Animatable.View>
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    lineHeight: 22,
  },
  tiersContainer: {
    gap: 20,
  },
  tierCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tierCardSelected: {
    borderWidth: 3,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  tierCardGradient: {
    padding: 20,
  },
  tierCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tierEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  tierEmojiSelected: {
    fontSize: 28,
  },
  tierTitleContainer: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  tierTitleSelected: {
    color: 'white',
  },
  tierPrice: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  tierPriceSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tierMainDescription: {
    fontSize: 16,
    color: '#5D6D7E',
    marginBottom: 15,
    fontWeight: '500',
  },
  tierMainDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginLeft: 8,
    flex: 1,
  },
  featureTextSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  continueContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  continueButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
});

export default TierSelectionScreen;