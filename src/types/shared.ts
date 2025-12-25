// Types partagés entre backend et frontend

export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum OrderType {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
}

export enum OrderState {
  COMING = 'COMING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethodType {
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK = 'BANK',
  OTHER = 'OTHER',
}

export enum NotificationType {
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  REFERRAL_COMMISSION = 'REFERRAL_COMMISSION',
  WITHDRAWAL_PROCESSED = 'WITHDRAWAL_PROCESSED',
  GENERAL = 'GENERAL',
}

export enum ChatType {
  SUPPORT = 'SUPPORT',
  AGENT = 'AGENT',
}

export enum ReferralWithdrawalState {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email?: string;
  phone: string;
  firstName: string;
  lastName: string;
  country: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  isOnline: boolean;
  isActive: boolean;
  isSuperAdmin: boolean;
  referralCode?: string;
  referredBy?: string;
  referralBalance: number;
  createdAt: Date;
}

export interface Bookmaker {
  id: string;
  name: string;
  logo: string;
  countries: string[];
  isActive: boolean;
  order: number;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  logo: string;
  countries: string[];
  isActive: boolean;
  order: number;
  ussdTemplate?: string;
  instructions?: string;
}

export interface Order {
  id: string;
  type: OrderType;
  amount: number;
  fees: number;
  state: OrderState;
  referenceId?: string;
  bookmakerIdentifier?: string;
  clientContact: string;
  clientId: string;
  bookmakerId: string;
  employeePaymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface AppConfig {
  [key: string]: any;
}

// ==================== RBAC ====================

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdById?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Permission[];
  userCount?: number;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRoles extends User {
  userRoles: {
    role: Role;
  }[];
}

// ==================== THEME ====================

export interface ThemeConfig {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textSecondary: string;
  glowIntensity: number;
  animationSpeed: number;
  particlesEnabled: boolean;
  gradientEnabled: boolean;
  moneyAnimationStyle: 'rain' | 'sparkle' | 'flow' | 'pulse';
  moneyColor: string;
  moneyGlow: boolean;
  logoAnimationType: 'pulse' | 'rotate' | 'glow' | 'float';
  logoGlowColor: string;
  backgroundType: 'gradient' | 'particles' | 'video' | 'image' | 'matrix';
  backgroundImage?: string;
  backgroundVideo?: string;
  fontFamily: string;
  fontSizeBase: number;
  borderRadius: number;
  borderGlow: boolean;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UIComponentConfig {
  id: string;
  componentType: string;
  componentName: string;
  config: any;
  isVisible: boolean;
  order: number;
  showForCountries?: string[];
  showForRoles?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== NEWSLETTER ====================

export interface Newsletter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetCountries?: string[];
  targetRoles?: string[];
  isDraft: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
