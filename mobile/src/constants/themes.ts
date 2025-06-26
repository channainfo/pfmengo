import { TierType, TierTheme } from '../types';

export const SPARK_THEME: TierTheme = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#FFA502',
    accent: '#FFD93D',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E9ECEF',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F39C12',
  },
  gradients: {
    primary: ['#FF6B6B', '#FFA502'],
    secondary: ['#FFA502', '#FFD93D'],
  },
  animations: {
    duration: 200,
    easing: 'ease-out',
  },
};

export const CONNECT_THEME: TierTheme = {
  colors: {
    primary: '#4ECDC4',
    secondary: '#7B68EE',
    accent: '#95E1D3',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E9ECEF',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F39C12',
  },
  gradients: {
    primary: ['#4ECDC4', '#7B68EE'],
    secondary: ['#7B68EE', '#95E1D3'],
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

export const FOREVER_THEME: TierTheme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#E8B4B8',
    accent: '#F8F9FA',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#E9ECEF',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F39C12',
  },
  gradients: {
    primary: ['#2C3E50', '#E8B4B8'],
    secondary: ['#E8B4B8', '#F8F9FA'],
  },
  animations: {
    duration: 400,
    easing: 'ease-in',
  },
};

export const getThemeForTier = (tier: TierType): TierTheme => {
  switch (tier) {
    case TierType.SPARK:
      return SPARK_THEME;
    case TierType.CONNECT:
      return CONNECT_THEME;
    case TierType.FOREVER:
      return FOREVER_THEME;
    default:
      return CONNECT_THEME;
  }
};

export const TIER_ICONS = {
  [TierType.SPARK]: '🔥',
  [TierType.CONNECT]: '💝',
  [TierType.FOREVER]: '💍',
};

export const TIER_NAMES = {
  [TierType.SPARK]: 'Spark',
  [TierType.CONNECT]: 'Connect',
  [TierType.FOREVER]: 'Forever',
};

export const TIER_DESCRIPTIONS = {
  [TierType.SPARK]: 'Fun, casual connections',
  [TierType.CONNECT]: 'Meaningful relationships',
  [TierType.FOREVER]: 'Finding your life partner',
};