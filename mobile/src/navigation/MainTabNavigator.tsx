import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { TierType } from '../types';
import { RootState } from '../store';
import { getThemeForTier } from '../constants/themes';

// Spark Screens
import SparkHomeScreen from '../screens/spark/SparkHomeScreen';
import SparkEventsScreen from '../screens/spark/SparkEventsScreen';
import SparkTonightScreen from '../screens/spark/SparkTonightScreen';

// Connect Screens
import ConnectHomeScreen from '../screens/connect/ConnectHomeScreen';
import ConnectMatchesScreen from '../screens/connect/ConnectMatchesScreen';
import ConnectCompatibilityScreen from '../screens/connect/ConnectCompatibilityScreen';

// Forever Screens
import ForeverHomeScreen from '../screens/forever/ForeverHomeScreen';
import ForeverInterviewScreen from '../screens/forever/ForeverInterviewScreen';
import ForeverPlanningScreen from '../screens/forever/ForeverPlanningScreen';

// Shared Screens
import MessagesScreen from '../screens/shared/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigators for each tier
const SparkStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SparkHome" component={SparkHomeScreen} />
    <Stack.Screen name="SparkEvents" component={SparkEventsScreen} />
    <Stack.Screen name="SparkTonight" component={SparkTonightScreen} />
  </Stack.Navigator>
);

const ConnectStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ConnectHome" component={ConnectHomeScreen} />
    <Stack.Screen name="ConnectMatches" component={ConnectMatchesScreen} />
    <Stack.Screen name="ConnectCompatibility" component={ConnectCompatibilityScreen} />
  </Stack.Navigator>
);

const ForeverStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ForeverHome" component={ForeverHomeScreen} />
    <Stack.Screen name="ForeverInterview" component={ForeverInterviewScreen} />
    <Stack.Screen name="ForeverPlanning" component={ForeverPlanningScreen} />
  </Stack.Navigator>
);

const MainTabNavigator: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const theme = getThemeForTier(user?.tier || TierType.CONNECT);

  const getTabConfig = () => {
    switch (user?.tier) {
      case TierType.SPARK:
        return {
          mainComponent: SparkStack,
          mainLabel: 'Discover',
          mainIcon: 'flame' as const,
          secondaryComponent: SparkEventsScreen,
          secondaryLabel: 'Events',
          secondaryIcon: 'calendar' as const,
        };
      case TierType.CONNECT:
        return {
          mainComponent: ConnectStack,
          mainLabel: 'Matches',
          mainIcon: 'heart' as const,
          secondaryComponent: ConnectMatchesScreen,
          secondaryLabel: 'Daily',
          secondaryIcon: 'star' as const,
        };
      case TierType.FOREVER:
        return {
          mainComponent: ForeverStack,
          mainLabel: 'Connections',
          mainIcon: 'diamond' as const,
          secondaryComponent: ForeverInterviewScreen,
          secondaryLabel: 'Interview',
          secondaryIcon: 'videocam' as const,
        };
      default:
        return {
          mainComponent: ConnectStack,
          mainLabel: 'Matches',
          mainIcon: 'heart' as const,
          secondaryComponent: ConnectMatchesScreen,
          secondaryLabel: 'Daily',
          secondaryIcon: 'star' as const,
        };
    }
  };

  const tabConfig = getTabConfig();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'MainTab') {
            iconName = focused ? tabConfig.mainIcon : `${tabConfig.mainIcon}-outline` as any;
          } else if (route.name === 'SecondaryTab') {
            iconName = focused ? tabConfig.secondaryIcon : `${tabConfig.secondaryIcon}-outline` as any;
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="MainTab"
        component={tabConfig.mainComponent}
        options={{
          tabBarLabel: tabConfig.mainLabel,
        }}
      />
      <Tab.Screen
        name="SecondaryTab"
        component={tabConfig.secondaryComponent}
        options={{
          tabBarLabel: tabConfig.secondaryLabel,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;