'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY BUTTON COMPONENTS
 * ============================================================================
 *
 * Mobile-first button components with gradient backgrounds, glow effects,
 * and touch-optimized interactions for the dating app experience.
 */

/* ==========================================================================
   BASE BUTTON
   ========================================================================== */

const buttonVariants = cva(
  // Base styles - mobile-first with touch feedback
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold text-center whitespace-nowrap',
    'rounded-xl',
    'transition-all duration-150 ease-out',
    'touch-feedback',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.97]',
  ],
  {
    variants: {
      variant: {
        // Primary - Hot Pink (Main CTA)
        primary: [
          'bg-gradient-to-r from-pink-600 to-pink-500',
          'text-white',
          'shadow-button-pink',
          'hover:from-pink-500 hover:to-pink-400',
          'hover:shadow-glow-pink-md',
          'focus-visible:ring-pink-500',
        ],

        // Secondary - Cyan (Alternative actions)
        secondary: [
          'bg-gradient-to-r from-cyan-600 to-cyan-500',
          'text-white',
          'shadow-button-cyan',
          'hover:from-cyan-500 hover:to-cyan-400',
          'hover:shadow-glow-cyan-md',
          'focus-visible:ring-cyan-500',
        ],

        // Tertiary - Orange (High energy, Superspot)
        tertiary: [
          'bg-gradient-to-r from-orange-600 to-orange-500',
          'text-white',
          'shadow-button-orange',
          'hover:from-orange-500 hover:to-orange-400',
          'hover:shadow-glow-orange-md',
          'focus-visible:ring-orange-500',
        ],

        // Match - Pink to Orange gradient (Match celebration)
        match: [
          'bg-gradient-match',
          'text-white',
          'shadow-lg',
          'hover:shadow-glow-pink-lg',
          'focus-visible:ring-pink-500',
          'animate-pulse-glow',
        ],

        // Outline - Bordered button
        outline: [
          'bg-transparent',
          'border-2 border-white/30',
          'text-white',
          'hover:bg-white/10',
          'hover:border-white/50',
          'focus-visible:ring-white',
        ],

        // Outline Pink
        'outline-pink': [
          'bg-transparent',
          'border-2 border-pink-500',
          'text-pink-400',
          'hover:bg-pink-500/10',
          'hover:text-pink-300',
          'focus-visible:ring-pink-500',
        ],

        // Ghost - Transparent with hover
        ghost: [
          'bg-transparent',
          'text-white/80',
          'hover:bg-white/10',
          'hover:text-white',
          'focus-visible:ring-white',
        ],

        // Glass - Glassmorphism style
        glass: [
          'glass',
          'text-white',
          'hover:bg-white/15',
          'focus-visible:ring-white',
        ],

        // Danger - For destructive actions
        danger: [
          'bg-gradient-to-r from-error-dark to-error',
          'text-white',
          'hover:from-error hover:to-error-light',
          'focus-visible:ring-error',
        ],

        // Success - For positive confirmations
        success: [
          'bg-gradient-to-r from-success-dark to-success',
          'text-white',
          'hover:from-success hover:to-success-light',
          'focus-visible:ring-success',
        ],
      },

      size: {
        xs: 'h-8 px-3 text-xs rounded-lg',
        sm: 'h-10 px-4 text-sm',
        md: 'h-11 px-5 text-base',        // 44px - min touch target
        lg: 'h-12 px-6 text-md',          // 48px
        xl: 'h-14 px-8 text-lg',          // 56px
        // Icon only sizes
        'icon-xs': 'h-8 w-8 p-0',
        'icon-sm': 'h-10 w-10 p-0',
        'icon-md': 'h-11 w-11 p-0',
        'icon-lg': 'h-12 w-12 p-0',
        'icon-xl': 'h-14 w-14 p-0',
      },

      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

/**
 * Base Button Component
 */
const Button = React.forwardRef(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

/* ==========================================================================
   ICON BUTTON
   ========================================================================== */

const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full',
    'transition-all duration-150 ease-out',
    'touch-feedback',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.95]',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white/10',
          'text-white',
          'hover:bg-white/20',
          'focus-visible:ring-white',
        ],
        primary: [
          'bg-pink-500',
          'text-white',
          'hover:bg-pink-400',
          'shadow-glow-pink-sm',
          'hover:shadow-glow-pink-md',
          'focus-visible:ring-pink-500',
        ],
        secondary: [
          'bg-cyan-500',
          'text-white',
          'hover:bg-cyan-400',
          'shadow-glow-cyan-sm',
          'hover:shadow-glow-cyan-md',
          'focus-visible:ring-cyan-500',
        ],
        tertiary: [
          'bg-orange-500',
          'text-white',
          'hover:bg-orange-400',
          'shadow-glow-orange-sm',
          'hover:shadow-glow-orange-md',
          'focus-visible:ring-orange-500',
        ],
        ghost: [
          'bg-transparent',
          'text-white/70',
          'hover:bg-white/10',
          'hover:text-white',
          'focus-visible:ring-white',
        ],
        outline: [
          'bg-transparent',
          'border-2 border-white/30',
          'text-white',
          'hover:bg-white/10',
          'hover:border-white/50',
          'focus-visible:ring-white',
        ],
        glass: [
          'glass',
          'text-white',
          'hover:bg-white/15',
          'focus-visible:ring-white',
        ],
        danger: [
          'bg-error/20',
          'text-error-light',
          'hover:bg-error/30',
          'focus-visible:ring-error',
        ],
      },

      size: {
        xs: 'h-8 w-8 text-sm',
        sm: 'h-10 w-10 text-base',
        md: 'h-11 w-11 text-lg',
        lg: 'h-12 w-12 text-xl',
        xl: 'h-14 w-14 text-2xl',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Icon Button Component
 */
const IconButton = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

/* ==========================================================================
   SPOT BUTTON - The core "like" action
   ========================================================================== */

/**
 * SpotButton - Primary action button for "spotting" (liking) another user
 */
const SpotButton = React.forwardRef(
  ({ className, size = 'lg', isSpotted = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-full',
          'transition-all duration-200 ease-out',
          'touch-feedback',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.92]',

          // Size variants
          {
            'h-14 w-14': size === 'md',
            'h-16 w-16': size === 'lg',
            'h-20 w-20': size === 'xl',
          },

          // State-based styling
          isSpotted
            ? [
                'bg-gradient-to-br from-pink-500 to-pink-600',
                'text-white',
                'shadow-glow-pink-lg',
                'animate-pulse-glow',
              ]
            : [
                'bg-white/10',
                'border-2 border-pink-500/50',
                'text-pink-400',
                'hover:bg-pink-500/20',
                'hover:border-pink-500',
                'hover:text-pink-300',
                'hover:shadow-glow-pink-md',
              ],

          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {/* Spot Icon (Eye with Heart) */}
        {children || (
          <svg
            className={cn('transition-transform duration-200', {
              'h-7 w-7': size === 'md',
              'h-8 w-8': size === 'lg',
              'h-10 w-10': size === 'xl',
            })}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            <path d="M12 9l1.12 2.28L15.5 12l-2.38.72L12 15l-1.12-2.28L8.5 12l2.38-.72z" />
          </svg>
        )}
      </button>
    );
  }
);
SpotButton.displayName = 'SpotButton';

/* ==========================================================================
   SUPERSPOT BUTTON - Premium "like" with message
   ========================================================================== */

/**
 * SuperspotButton - Premium action that costs credits
 */
const SuperspotButton = React.forwardRef(
  ({ className, size = 'lg', disabled, credits = 1, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-full',
          'bg-gradient-superspot',
          'text-white font-bold',
          'transition-all duration-200 ease-smooth',
          'touch-feedback',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.92]',
          'shadow-glow-orange-md',
          'hover:shadow-glow-orange-lg',
          'animate-gradient-shift bg-[length:200%_200%]',

          // Size variants
          {
            'h-14 w-14': size === 'md',
            'h-16 w-16': size === 'lg',
            'h-20 w-20': size === 'xl',
          },

          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {/* Star Icon or custom children */}
        {children || (
          <svg
            className={cn({
              'h-7 w-7': size === 'md',
              'h-8 w-8': size === 'lg',
              'h-10 w-10': size === 'xl',
            })}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}

        {/* Credit Badge */}
        {credits > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-900 text-3xs font-bold text-white ring-2 ring-purple-900">
            {credits}
          </span>
        )}
      </button>
    );
  }
);
SuperspotButton.displayName = 'SuperspotButton';

/* ==========================================================================
   CHECK-IN BUTTON
   ========================================================================== */

/**
 * CheckInButton - For checking into a venue
 */
const CheckInButton = React.forwardRef(
  (
    {
      className,
      isCheckedIn = false,
      isLoading = false,
      credits = 1,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2',
          'h-12 px-6',
          'rounded-xl',
          'font-semibold text-base',
          'transition-all duration-200 ease-out',
          'touch-feedback',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.97]',

          // State-based styling
          isCheckedIn
            ? [
                'bg-gradient-to-r from-cyan-600 to-cyan-500',
                'text-white',
                'shadow-glow-cyan-md',
                'focus-visible:ring-cyan-500',
              ]
            : [
                'bg-gradient-to-r from-pink-600 to-pink-500',
                'text-white',
                'shadow-button-pink',
                'hover:from-pink-500 hover:to-pink-400',
                'hover:shadow-glow-pink-md',
                'focus-visible:ring-pink-500',
              ],

          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Checking in...</span>
          </>
        ) : isCheckedIn ? (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span>{children || "You're in!"}</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{children || 'Check In'}</span>
            {credits > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {credits} credit{credits !== 1 ? 's' : ''}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);
CheckInButton.displayName = 'CheckInButton';

/* ==========================================================================
   REJECT/PASS BUTTON
   ========================================================================== */

/**
 * RejectButton - For passing on a profile
 */
const RejectButton = React.forwardRef(
  ({ className, size = 'lg', disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-full',
          'bg-white/10',
          'border-2 border-white/30',
          'text-white/70',
          'transition-all duration-200 ease-out',
          'touch-feedback',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.92]',
          'hover:bg-white/20',
          'hover:border-white/50',
          'hover:text-white',

          // Size variants
          {
            'h-14 w-14': size === 'md',
            'h-16 w-16': size === 'lg',
            'h-20 w-20': size === 'xl',
          },

          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {/* X Icon */}
        {children || (
          <svg
            className={cn({
              'h-6 w-6': size === 'md',
              'h-7 w-7': size === 'lg',
              'h-8 w-8': size === 'xl',
            })}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        )}
      </button>
    );
  }
);
RejectButton.displayName = 'RejectButton';

/* ==========================================================================
   FLOATING ACTION BUTTON
   ========================================================================== */

/**
 * FAB - Floating Action Button for primary actions
 */
const FAB = React.forwardRef(
  ({ className, variant = 'primary', size = 'lg', children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-glow-pink-lg hover:shadow-glow-pink-xl',
      secondary: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-glow-cyan-lg hover:shadow-glow-cyan-xl',
      tertiary: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-glow-orange-lg',
    };

    const sizeClasses = {
      md: 'h-12 w-12',
      lg: 'h-14 w-14',
      xl: 'h-16 w-16',
    };

    return (
      <button
        className={cn(
          'fixed bottom-20 right-4',
          'inline-flex items-center justify-center',
          'rounded-full',
          'transition-all duration-200 ease-out',
          'touch-feedback',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900',
          'active:scale-[0.95]',
          'z-raised',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
FAB.displayName = 'FAB';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  Button,
  buttonVariants,
  IconButton,
  iconButtonVariants,
  SpotButton,
  SuperspotButton,
  CheckInButton,
  RejectButton,
  FAB,
};
