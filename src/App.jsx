import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Auth screens
import {
  WelcomeScreen,
  LoginScreen,
  OTPScreen,
  ProfileSetupScreen,
  LocationScreen,
} from './pages/auth';

// Main screens
import HomeScreen from './pages/HomeScreen';
import FlowsScreen from './pages/FlowsScreen';
import MatchScreen from './pages/MatchScreen';

// Design System
import StyleGuide from './StyleGuide';

// Phone Frame
import PhoneFrame from './components/PhoneFrame';

/**
 * Protected Route wrapper
 * Redirects to welcome if not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/welcome" replace />;
  }

  // If authenticated but onboarding not complete, redirect to appropriate step
  if (!user?.onboardingComplete) {
    if (!user?.name || !user?.gender) {
      return <Navigate to="/auth/profile-setup" replace />;
    }
    if (!user?.locationPermission) {
      return <Navigate to="/auth/location" replace />;
    }
  }

  return children;
}

/**
 * Auth Route wrapper
 * Redirects to home if already authenticated and onboarding complete
 */
function AuthRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.onboardingComplete) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

/**
 * App Layout - wraps app routes in phone frame
 */
function AppLayout({ children }) {
  const location = useLocation();
  // Design system pages that don't need phone frame
  const isDesignSystem = location.pathname === '/design-system' || location.pathname === '/flows';

  // Don't wrap design system pages in phone frame
  if (isDesignSystem) {
    return children;
  }

  return <PhoneFrame>{children}</PhoneFrame>;
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Onboarding / Welcome */}
          <Route
            path="/"
            element={
              <AuthRoute>
                <WelcomeScreen />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/welcome"
            element={
              <AuthRoute>
                <WelcomeScreen />
              </AuthRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/auth/login"
            element={
              <AuthRoute>
                <LoginScreen />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/verify-otp"
            element={
              <AuthRoute>
                <OTPScreen />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/profile-setup"
            element={<ProfileSetupScreen />}
          />
          <Route
            path="/auth/location"
            element={<LocationScreen />}
          />

          {/* Home - accessible for demo */}
          <Route path="/home" element={<HomeScreen />} />

          {/* Match Screen - accessible for demo */}
          <Route path="/match" element={<MatchScreen />} />

          {/* Design System (hidden from normal flow, accessible via direct URL) */}
          <Route path="/design-system" element={<StyleGuide />} />
          <Route path="/flows" element={<FlowsScreen />} />

          {/* Legacy redirects */}
          <Route path="/styleguide" element={<Navigate to="/design-system" replace />} />

          {/* Default redirect to welcome */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
