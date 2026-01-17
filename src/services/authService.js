/**
 * Auth Service - API layer for authentication
 * This mock implementation uses localStorage
 * Replace with real API calls when backend is ready
 */

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (localStorage)
const USERS_KEY = 'hactually_users';
const OTP_KEY = 'hactually_otp';

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (user) => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
};

const findUserByPhone = (phone) => {
  const users = getUsers();
  return users.find(u => u.phone === phone);
};

const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

// Generate a simple user ID
const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const authService = {
  /**
   * Login with OAuth provider (Apple, Google) or phone
   */
  async login(provider, credentials) {
    await delay(800); // Simulate network

    if (provider === 'phone') {
      // For phone, we just send OTP first
      return { success: true, requiresOTP: true };
    }

    // OAuth login (Apple/Google)
    const { email, name } = credentials;
    let user = findUserByEmail(email);

    if (!user) {
      // Create new user
      user = {
        id: generateId(),
        email,
        name: name || email.split('@')[0],
        provider,
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
        credits: 5, // Free credits for new users
      };
      saveUser(user);
    }

    return {
      success: true,
      user,
      isNewUser: !user.onboardingComplete
    };
  },

  /**
   * Send OTP to phone number
   */
  async sendOTP(phone) {
    await delay(600);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily (in real app, this would be server-side)
    const otpData = { phone, otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry
    localStorage.setItem(OTP_KEY, JSON.stringify(otpData));

    // In development, log the OTP
    console.log(`[DEV] OTP for ${phone}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent successfully',
      // For development, include OTP in response
      ...(import.meta.env.DEV && { devOTP: otp })
    };
  },

  /**
   * Verify OTP and login/register user
   */
  async verifyOTP(phone, otp) {
    await delay(600);

    // Check stored OTP
    const stored = localStorage.getItem(OTP_KEY);
    if (!stored) {
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }

    const otpData = JSON.parse(stored);
    if (otpData.phone !== phone || otpData.otp !== otp) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    if (Date.now() > otpData.expires) {
      localStorage.removeItem(OTP_KEY);
      return { success: false, error: 'OTP expired. Please request a new one.' };
    }

    // Clear OTP after successful verification
    localStorage.removeItem(OTP_KEY);

    // Find or create user
    let user = findUserByPhone(phone);
    const isNewUser = !user;

    if (!user) {
      user = {
        id: generateId(),
        phone,
        provider: 'phone',
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
        credits: 5,
      };
      saveUser(user);
    }

    return {
      success: true,
      user,
      isNewUser
    };
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    await delay(500);

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex < 0) {
      return { success: false, error: 'User not found' };
    }

    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, user: updatedUser };
  },

  /**
   * Upload profile photo
   * In real app, this would upload to cloud storage
   */
  async uploadPhoto(userId, file) {
    await delay(1000);

    // For mock, convert to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          photoUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    await delay(300);
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? { success: true, user } : { success: false, error: 'User not found' };
  },

  /**
   * Check if phone number is registered
   */
  async checkPhone(phone) {
    await delay(300);
    const user = findUserByPhone(phone);
    return { exists: !!user };
  }
};
