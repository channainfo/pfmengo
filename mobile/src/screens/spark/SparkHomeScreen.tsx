import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-deck-swiper';
import * as Animatable from 'react-native-animatable';

import { RootState, AppDispatch } from '../../store';
import { getTonightMatches, likeUser, passUser, superLike } from '../../store/slices/matchingSlice';
import { SPARK_THEME } from '../../constants/themes';
import { Match } from '../../types';

const { width, height } = Dimensions.get('window');

const SparkHomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tonightMatches, isLoading } = useSelector((state: RootState) => state.matching);
  const { user } = useSelector((state: RootState) => state.auth);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getTonightMatches());
  }, [dispatch]);

  const handleSwipeLeft = async (cardIndex: number) => {
    if (tonightMatches[cardIndex]) {
      setActionLoading('pass');
      try {
        await dispatch(passUser(tonightMatches[cardIndex].user.id)).unwrap();
      } catch (error) {
        console.log('Pass error:', error);
      }
      setActionLoading(null);
    }
  };

  const handleSwipeRight = async (cardIndex: number) => {
    if (tonightMatches[cardIndex]) {
      setActionLoading('like');
      try {
        await dispatch(likeUser(tonightMatches[cardIndex].user.id)).unwrap();
      } catch (error) {
        console.log('Like error:', error);
      }
      setActionLoading(null);
    }
  };

  const handleSuperLike = async () => {
    if (tonightMatches[currentIndex]) {
      setActionLoading('superlike');
      try {
        await dispatch(superLike(tonightMatches[currentIndex].user.id)).unwrap();
        swiperRef?.swipeTop();
      } catch (error) {
        console.log('Super like error:', error);
      }
      setActionLoading(null);
    }
  };

  const handleManualPass = () => {
    swiperRef?.swipeLeft();
  };

  const handleManualLike = () => {
    swiperRef?.swipeRight();
  };

  const renderCard = (match: Match) => {
    if (!match) return null;

    const { user: profile } = match;
    const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();

    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          {/* Profile Image would go here */}
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="person" size={80} color="#fff" />
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{profile.firstName}</Text>
              <Text style={styles.cardAge}>{age}</Text>
            </View>
            
            {profile.city && (
              <View style={styles.cardLocation}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.cardLocationText}>{profile.city}</Text>
              </View>
            )}

            <View style={styles.vibeContainer}>
              <Text style={styles.vibeLabel}>Tonight's Vibe:</Text>
              <Text style={styles.vibeText}>Ready to explore! 🌟</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderNoMoreCards = () => (
    <View style={styles.noMoreCards}>
      <Animatable.View animation="fadeIn" style={styles.noMoreCardsContent}>
        <Ionicons name="heart-outline" size={60} color={SPARK_THEME.colors.primary} />
        <Text style={styles.noMoreCardsTitle}>That's everyone for tonight!</Text>
        <Text style={styles.noMoreCardsSubtitle}>
          Check out some events or come back later for more matches
        </Text>
        <TouchableOpacity style={styles.eventsButton}>
          <Text style={styles.eventsButtonText}>Explore Events</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={SPARK_THEME.colors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={SPARK_THEME.gradients.primary}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🔥 Tonight Mode</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Swiper Container */}
      <View style={styles.swiperContainer}>
        {tonightMatches.length > 0 ? (
          <Swiper
            ref={(ref) => setSwiperRef(ref)}
            cards={tonightMatches}
            renderCard={renderCard}
            onSwipedLeft={handleSwipeLeft}
            onSwipedRight={handleSwipeRight}
            onSwipedAll={renderNoMoreCards}
            cardIndex={currentIndex}
            backgroundColor="transparent"
            stackSize={3}
            stackScale={10}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            overlayLabels={{
              left: {
                title: 'PASS',
                style: {
                  label: {
                    backgroundColor: '#E74C3C',
                    borderColor: '#E74C3C',
                    color: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: SPARK_THEME.colors.primary,
                    borderColor: SPARK_THEME.colors.primary,
                    color: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
              top: {
                title: 'SUPER LIKE',
                style: {
                  label: {
                    backgroundColor: '#FFD93D',
                    borderColor: '#FFD93D',
                    color: '#2C3E50',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
              },
            }}
          />
        ) : (
          renderNoMoreCards()
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={handleManualPass}
          disabled={!!actionLoading}
        >
          <Ionicons name="close" size={30} color="#E74C3C" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}
          disabled={!!actionLoading}
        >
          <Ionicons name="star" size={25} color="#FFD93D" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleManualLike}
          disabled={!!actionLoading}
        >
          <Ionicons name="heart" size={30} color={SPARK_THEME.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tonight Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {tonightMatches.length} people active tonight near you
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  filterButton: {
    padding: 8,
  },
  swiperContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    height: height * 0.6,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bdc3c7',
  },
  cardInfo: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  cardAge: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardLocationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 5,
  },
  vibeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    backdropFilter: 'blur(10px)',
  },
  vibeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  vibeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 30,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: '#FFD93D',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: SPARK_THEME.colors.primary,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreCardsContent: {
    alignItems: 'center',
  },
  noMoreCardsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noMoreCardsSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  eventsButton: {
    backgroundColor: SPARK_THEME.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  eventsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SparkHomeScreen;