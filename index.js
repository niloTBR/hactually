/**
 * ============================================================================
 * HACTUALLY DESIGN SYSTEM
 * ============================================================================
 *
 * A mobile-first design system for the Hactually dating app.
 * Features dark purple theme, gradient accents, and nightlife-inspired aesthetics.
 *
 * Usage:
 *   import { Button, ProfileCard, cn } from '@/design-system';
 *
 * Styles:
 *   Import the CSS files in your app's entry point:
 *   import '@/design-system/styles/tokens.css';
 *   import '@/design-system/styles/animations.css';
 *
 */

// Re-export all UI components
export * from './components/ui';

// Re-export utility functions
export {
  cn,
  formatCurrency,
  formatNumber,
  getInitials,
  formatRelativeTime,
  formatDistance,
  getAge,
  truncateText,
  debounce,
  throttle,
  generateId,
  isMobile,
  isTouchDevice,
  hexToRgba,
  calculateDistance,
  isWithinVenueRadius,
  formatCredits,
  getStatusColor,
  sleep,
  clamp,
  lerp,
  getCrowdLevel,
} from './lib/utils';
