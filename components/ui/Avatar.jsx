'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn, getInitials } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY AVATAR & BADGE COMPONENTS
 * ============================================================================
 *
 * Avatar components for user photos with status indicators,
 * and badge components for labels and notifications.
 */

/* ==========================================================================
   AVATAR
   ========================================================================== */

const avatarVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'overflow-hidden',
    'bg-purple-700',
    'flex-shrink-0',
  ],
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-3xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-14 w-14 text-lg',
        '2xl': 'h-20 w-20 text-xl',
        '3xl': 'h-28 w-28 text-2xl',
      },

      shape: {
        circle: 'rounded-full',
        square: 'rounded-xl',
      },

      border: {
        none: '',
        default: 'ring-2 ring-purple-900',
        white: 'ring-2 ring-white/30',
        pink: 'ring-2 ring-pink-500',
        cyan: 'ring-2 ring-cyan-500',
        gradient: 'ring-2 ring-pink-500 ring-offset-2 ring-offset-purple-900',
      },
    },

    defaultVariants: {
      size: 'md',
      shape: 'circle',
      border: 'none',
    },
  }
);

/**
 * Avatar Component
 */
const Avatar = React.forwardRef(
  (
    {
      className,
      src,
      alt,
      name,
      size,
      shape,
      border,
      status,
      isVerified,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const showFallback = !src || imageError;

    const statusColors = {
      online: 'bg-success',
      away: 'bg-warning',
      offline: 'bg-purple-600',
      'checked-in': 'bg-cyan-500',
      spotted: 'bg-pink-500 animate-pulse',
    };

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-3.5 w-3.5',
      '2xl': 'h-4 w-4',
      '3xl': 'h-5 w-5',
    };

    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          avatarVariants({ size, shape, border }),
          onClick && 'cursor-pointer transition-transform hover:scale-105 active:scale-95',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {showFallback ? (
          <span className="font-semibold text-white/50">
            {getInitials(name || alt)}
          </span>
        ) : (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        )}

        {/* Status Indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0',
              'rounded-full',
              'ring-2 ring-purple-900',
              statusColors[status] || statusColors.offline,
              statusSizes[size] || statusSizes.md
            )}
          />
        )}

        {/* Verified Badge (for larger avatars) */}
        {isVerified && (size === 'xl' || size === '2xl' || size === '3xl') && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-900">
            <svg className="h-4 w-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
        )}

        {children}
      </Component>
    );
  }
);
Avatar.displayName = 'Avatar';

/* ==========================================================================
   AVATAR GROUP
   ========================================================================== */

/**
 * AvatarGroup - Stack of overlapping avatars
 */
const AvatarGroup = React.forwardRef(
  (
    {
      className,
      avatars = [],
      max = 4,
      size = 'md',
      onMoreClick,
      children,
      ...props
    },
    ref
  ) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const overlapSizes = {
      xs: '-ml-1.5',
      sm: '-ml-2',
      md: '-ml-2.5',
      lg: '-ml-3',
      xl: '-ml-4',
      '2xl': '-ml-5',
      '3xl': '-ml-6',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            key={avatar.id || index}
            src={avatar.photo || avatar.src}
            name={avatar.name}
            alt={avatar.name}
            size={size}
            border="default"
            status={avatar.status}
            className={cn(index > 0 && overlapSizes[size])}
          />
        ))}

        {remainingCount > 0 && (
          <button
            onClick={onMoreClick}
            className={cn(
              avatarVariants({ size, shape: 'circle' }),
              overlapSizes[size],
              'bg-purple-700 hover:bg-purple-600',
              'font-semibold text-white/70',
              'ring-2 ring-purple-900',
              'cursor-pointer transition-colors'
            )}
          >
            +{remainingCount}
          </button>
        )}

        {children}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

/* ==========================================================================
   BADGE
   ========================================================================== */

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-semibold',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        // Solid colors
        default: 'bg-white/10 text-white/80',
        primary: 'bg-pink-500 text-white',
        secondary: 'bg-cyan-500 text-white',
        tertiary: 'bg-orange-500 text-white',
        success: 'bg-success text-white',
        warning: 'bg-warning text-purple-900',
        error: 'bg-error text-white',

        // Subtle/soft colors
        'primary-soft': 'bg-pink-500/20 text-pink-400',
        'secondary-soft': 'bg-cyan-500/20 text-cyan-400',
        'tertiary-soft': 'bg-orange-500/20 text-orange-400',
        'success-soft': 'bg-success/20 text-success-light',
        'warning-soft': 'bg-warning/20 text-warning',
        'error-soft': 'bg-error/20 text-error-light',

        // Outline
        outline: 'bg-transparent border border-white/30 text-white/80',
        'outline-pink': 'bg-transparent border border-pink-500/50 text-pink-400',
        'outline-cyan': 'bg-transparent border border-cyan-500/50 text-cyan-400',

        // Gradient
        gradient: 'bg-gradient-match text-white',
        'gradient-superspot': 'bg-gradient-superspot text-white',
      },

      size: {
        xs: 'h-4 px-1.5 text-3xs rounded',
        sm: 'h-5 px-2 text-2xs rounded-md',
        md: 'h-6 px-2.5 text-xs rounded-lg',
        lg: 'h-7 px-3 text-sm rounded-lg',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Badge Component
 */
const Badge = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

/* ==========================================================================
   STATUS BADGE
   ========================================================================== */

/**
 * StatusBadge - Badge showing user status with dot indicator
 */
const StatusBadge = React.forwardRef(
  (
    {
      className,
      status = 'offline',
      showLabel = true,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const statusConfig = {
      online: {
        color: 'bg-success',
        label: 'Online',
        dotClass: 'animate-pulse',
      },
      away: {
        color: 'bg-warning',
        label: 'Away',
        dotClass: '',
      },
      offline: {
        color: 'bg-purple-600',
        label: 'Offline',
        dotClass: '',
      },
      'checked-in': {
        color: 'bg-cyan-500',
        label: 'Checked In',
        dotClass: '',
      },
    };

    const config = statusConfig[status] || statusConfig.offline;

    const dotSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5',
          badgeVariants({ variant: 'default', size }),
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'rounded-full',
            config.color,
            config.dotClass,
            dotSizes[size]
          )}
        />
        {showLabel && config.label}
      </span>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

/* ==========================================================================
   NOTIFICATION BADGE
   ========================================================================== */

/**
 * NotificationBadge - Numeric badge for counts (messages, matches, etc.)
 */
const NotificationBadge = React.forwardRef(
  (
    {
      className,
      count = 0,
      max = 99,
      variant = 'primary',
      showZero = false,
      ...props
    },
    ref
  ) => {
    if (count === 0 && !showZero) return null;

    const displayCount = count > max ? `${max}+` : count;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'min-w-5 h-5 px-1.5',
          'rounded-full',
          'text-2xs font-bold',
          variant === 'primary' && 'bg-pink-500 text-white',
          variant === 'secondary' && 'bg-cyan-500 text-white',
          variant === 'tertiary' && 'bg-orange-500 text-white',
          className
        )}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);
NotificationBadge.displayName = 'NotificationBadge';

/* ==========================================================================
   VERIFIED BADGE
   ========================================================================== */

/**
 * VerifiedBadge - Verification indicator
 */
const VerifiedBadge = React.forwardRef(
  ({ className, size = 'md', showLabel = false, ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        <svg
          className={cn('text-cyan-400', sizes[size])}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
        {showLabel && (
          <span className="text-sm font-medium text-cyan-400">Verified</span>
        )}
      </span>
    );
  }
);
VerifiedBadge.displayName = 'VerifiedBadge';

/* ==========================================================================
   INTEREST TAG
   ========================================================================== */

/**
 * InterestTag - Tag for displaying user interests
 */
const InterestTag = React.forwardRef(
  (
    {
      className,
      children,
      isSelected = false,
      isMatching = false,
      onSelect,
      onRemove,
      ...props
    },
    ref
  ) => {
    const Component = onSelect ? 'button' : 'span';

    return (
      <Component
        ref={ref}
        onClick={onSelect}
        className={cn(
          'inline-flex items-center gap-1.5',
          'h-8 px-3',
          'rounded-full',
          'text-sm font-medium',
          'transition-all duration-200',
          isSelected
            ? [
                'bg-pink-500/20 text-pink-400',
                'border border-pink-500/30',
              ]
            : isMatching
              ? [
                  'bg-cyan-500/20 text-cyan-400',
                  'border border-cyan-500/30',
                ]
              : [
                  'bg-white/10 text-white/70',
                  'border border-transparent',
                ],
          onSelect && [
            'cursor-pointer',
            'hover:bg-white/15',
            'active:scale-95',
          ],
          className
        )}
        {...props}
      >
        {isMatching && (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )}

        {children}

        {onRemove && isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-0.5 rounded-full p-0.5 hover:bg-pink-500/30"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </Component>
    );
  }
);
InterestTag.displayName = 'InterestTag';

/* ==========================================================================
   DISTANCE BADGE
   ========================================================================== */

/**
 * DistanceBadge - Shows distance from user
 */
const DistanceBadge = React.forwardRef(
  ({ className, distance, size = 'md', ...props }, ref) => {
    const formatDist = (meters) => {
      if (meters < 1000) {
        return `${Math.round(meters)}m`;
      }
      return `${(meters / 1000).toFixed(1)}km`;
    };

    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant: 'default', size }),
          'gap-1',
          className
        )}
        {...props}
      >
        <svg className="h-3 w-3 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        {formatDist(distance)}
      </span>
    );
  }
);
DistanceBadge.displayName = 'DistanceBadge';

/* ==========================================================================
   CREDITS BADGE
   ========================================================================== */

/**
 * CreditsBadge - Shows credit count
 */
const CreditsBadge = React.forwardRef(
  ({ className, credits = 0, size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant: 'gradient-superspot', size }),
          'gap-1',
          className
        )}
        {...props}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {credits}
      </span>
    );
  }
);
CreditsBadge.displayName = 'CreditsBadge';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  Avatar,
  avatarVariants,
  AvatarGroup,
  Badge,
  badgeVariants,
  StatusBadge,
  NotificationBadge,
  VerifiedBadge,
  InterestTag,
  DistanceBadge,
  CreditsBadge,
};
