'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn, formatDistance, getInitials, formatRelativeTime, getAge } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY CARD COMPONENTS
 * ============================================================================
 *
 * Mobile-first card components for profiles, venues, matches, and more.
 * Features gradient overlays, glassmorphism, and animated interactions.
 */

/* ==========================================================================
   BASE CARD
   ========================================================================== */

const cardVariants = cva(
  [
    'relative overflow-hidden',
    'rounded-2xl',
    'transition-all duration-200 ease-out',
  ],
  {
    variants: {
      variant: {
        // Solid dark background
        solid: 'bg-purple-800',

        // Elevated with shadow
        elevated: 'bg-purple-800 shadow-card',

        // Glassmorphism
        glass: 'glass',

        // Gradient background
        gradient: 'bg-gradient-card',

        // Interactive with hover states
        interactive: [
          'bg-purple-800',
          'shadow-card',
          'cursor-pointer',
          'touch-feedback',
          'hover:shadow-xl',
          'hover:bg-purple-750',
          'active:scale-[0.98]',
        ],

        // Outline style
        outline: [
          'bg-transparent',
          'border border-white/20',
        ],
      },

      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
      },
    },

    defaultVariants: {
      variant: 'elevated',
      padding: 'none',
    },
  }
);

/**
 * Base Card Component
 */
const Card = React.forwardRef(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

/* ==========================================================================
   PROFILE CARD - Main swipeable profile card
   ========================================================================== */

/**
 * ProfileCard - The main dating card with photo, info, and actions
 * Used in the swipe/discover interface
 */
const ProfileCard = React.forwardRef(
  (
    {
      className,
      user,
      onSpot,
      onSuperspot,
      onReject,
      onViewProfile,
      showActions = true,
      isActive = true,
      children,
      ...props
    },
    ref
  ) => {
    const {
      id,
      name,
      age,
      photos = [],
      bio,
      distance, // in meters
      isVerified = false,
      isOnline = false,
      lastActive,
      interests = [],
      location,
    } = user || {};

    const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
    const mainPhoto = photos[currentPhotoIndex] || photos[0];

    const handlePhotoTap = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      if (x < width / 3 && currentPhotoIndex > 0) {
        setCurrentPhotoIndex((prev) => prev - 1);
      } else if (x > (width * 2) / 3 && currentPhotoIndex < photos.length - 1) {
        setCurrentPhotoIndex((prev) => prev + 1);
      } else if (onViewProfile) {
        onViewProfile(user);
      }
    };

    return (
      <Card
        className={cn(
          'relative flex flex-col',
          'aspect-[3/4] w-full max-w-sm',
          'overflow-hidden',
          isActive ? 'shadow-2xl' : 'opacity-90 scale-95',
          className
        )}
        variant="solid"
        ref={ref}
        {...props}
      >
        {/* Photo Area */}
        <div
          className="relative flex-1 cursor-pointer"
          onClick={handlePhotoTap}
        >
          {/* Main Photo */}
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-700">
              <span className="text-5xl font-bold text-white/30">
                {getInitials(name)}
              </span>
            </div>
          )}

          {/* Photo Indicators */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-200',
                    index === currentPhotoIndex
                      ? 'bg-white'
                      : 'bg-white/40'
                  )}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-transparent to-transparent" />

          {/* Online/Status Indicator */}
          {isOnline && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-white">Online</span>
            </div>
          )}

          {/* Distance Badge */}
          {distance != null && (
            <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
              <svg className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-xs font-medium text-white">
                {formatDistance(distance)}
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="relative px-4 pb-4 pt-2">
          {/* Name & Age */}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              {name}
              {age && <span className="font-normal text-white/80">, {getAge(age)}</span>}
            </h3>
            {isVerified && (
              <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            )}
          </div>

          {/* Location */}
          {location && (
            <p className="mt-0.5 text-sm text-white/60">{location}</p>
          )}

          {/* Bio Preview */}
          {bio && (
            <p className="mt-2 line-clamp-2 text-sm text-white/80">{bio}</p>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {interests.slice(0, 4).map((interest, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
                >
                  {interest}
                </span>
              ))}
              {interests.length > 4 && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/60">
                  +{interests.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-center gap-4 pb-4">
            {/* Reject */}
            <button
              onClick={() => onReject?.(user)}
              className={cn(
                'flex h-14 w-14 items-center justify-center',
                'rounded-full',
                'bg-white/10 border-2 border-white/30',
                'text-white/70',
                'transition-all duration-200',
                'active:scale-90',
                'hover:bg-white/20 hover:text-white'
              )}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Superspot */}
            <button
              onClick={() => onSuperspot?.(user)}
              className={cn(
                'flex h-12 w-12 items-center justify-center',
                'rounded-full',
                'bg-gradient-superspot',
                'text-white',
                'shadow-glow-orange-md',
                'transition-all duration-200',
                'active:scale-90',
                'hover:shadow-glow-orange-lg',
                'animate-gradient-shift bg-[length:200%_200%]'
              )}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>

            {/* Spot (Like) */}
            <button
              onClick={() => onSpot?.(user)}
              className={cn(
                'flex h-14 w-14 items-center justify-center',
                'rounded-full',
                'bg-gradient-to-br from-pink-500 to-pink-600',
                'text-white',
                'shadow-glow-pink-md',
                'transition-all duration-200',
                'active:scale-90',
                'hover:shadow-glow-pink-lg'
              )}
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                <path d="M12 9l1.12 2.28L15.5 12l-2.38.72L12 15l-1.12-2.28L8.5 12l2.38-.72z" />
              </svg>
            </button>
          </div>
        )}

        {children}
      </Card>
    );
  }
);
ProfileCard.displayName = 'ProfileCard';

/* ==========================================================================
   VENUE CARD - For venue/location listings
   ========================================================================== */

/**
 * VenueCard - Card for displaying venues where users can check in
 */
const VenueCard = React.forwardRef(
  (
    {
      className,
      venue,
      onCheckIn,
      onPress,
      isCheckedIn = false,
      showCheckIn = true,
      variant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const {
      id,
      name,
      type,
      photo,
      distance, // in meters
      address,
      peopleHere = 0,
      isHot = false,
      rating,
      priceLevel,
    } = venue || {};

    const CardWrapper = onPress ? 'button' : 'div';

    return (
      <Card
        className={cn(
          'w-full',
          variant === 'compact' ? 'flex flex-row' : '',
          className
        )}
        variant="interactive"
        ref={ref}
        as={CardWrapper}
        onClick={onPress}
        {...props}
      >
        {/* Image */}
        <div
          className={cn(
            'relative overflow-hidden',
            variant === 'compact'
              ? 'h-24 w-24 flex-shrink-0 rounded-l-2xl'
              : 'aspect-[16/10] w-full'
          )}
        >
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-purple-700">
              <svg className="h-8 w-8 text-white/30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          )}

          {/* Hot Badge */}
          {isHot && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
              </svg>
              Hot
            </div>
          )}

          {/* Distance Badge */}
          {distance != null && variant !== 'compact' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              <svg className="h-3 w-3 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {formatDistance(distance)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          'flex flex-1 flex-col',
          variant === 'compact' ? 'p-3' : 'p-4'
        )}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="truncate font-semibold text-white">{name}</h4>
              {type && (
                <p className="text-sm text-white/60">{type}</p>
              )}
            </div>

            {/* People Count */}
            {peopleHere > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-400">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {peopleHere}
              </div>
            )}
          </div>

          {/* Address (full variant only) */}
          {address && variant !== 'compact' && (
            <p className="mt-1 text-sm text-white/50 line-clamp-1">{address}</p>
          )}

          {/* Rating & Price (full variant only) */}
          {variant !== 'compact' && (rating || priceLevel) && (
            <div className="mt-2 flex items-center gap-3">
              {rating && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm font-medium text-white">{rating}</span>
                </div>
              )}
              {priceLevel && (
                <span className="text-sm text-white/60">
                  {'$'.repeat(priceLevel)}
                  <span className="text-white/30">{'$'.repeat(4 - priceLevel)}</span>
                </span>
              )}
            </div>
          )}

          {/* Check-in Button (full variant only) */}
          {showCheckIn && variant !== 'compact' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCheckIn?.(venue);
              }}
              className={cn(
                'mt-3 flex items-center justify-center gap-2',
                'h-10 w-full rounded-xl',
                'font-semibold text-sm',
                'transition-all duration-200',
                'active:scale-[0.98]',
                isCheckedIn
                  ? [
                      'bg-cyan-500/20 text-cyan-400',
                      'border border-cyan-500/30',
                    ]
                  : [
                      'bg-gradient-to-r from-pink-600 to-pink-500',
                      'text-white',
                      'shadow-sm',
                      'hover:from-pink-500 hover:to-pink-400',
                    ]
              )}
            >
              {isCheckedIn ? (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  You're Here
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Check In
                </>
              )}
            </button>
          )}

          {/* Compact variant: distance */}
          {variant === 'compact' && distance != null && (
            <p className="mt-auto pt-1 text-xs text-white/50">
              {formatDistance(distance)} away
            </p>
          )}
        </div>

        {children}
      </Card>
    );
  }
);
VenueCard.displayName = 'VenueCard';

/* ==========================================================================
   MATCH CARD - Celebration card when users match
   ========================================================================== */

/**
 * MatchCard - Displayed when two users match
 */
const MatchCard = React.forwardRef(
  (
    {
      className,
      currentUser,
      matchedUser,
      onSendMessage,
      onKeepSpotting,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn(
          'flex flex-col items-center justify-center',
          'p-8',
          'text-center',
          'animate-match-pop',
          className
        )}
        variant="glass"
        ref={ref}
        {...props}
      >
        {/* Match Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-match bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
            It's a Match!
          </h2>
          <p className="mt-2 text-white/70">
            You and {matchedUser?.name} spotted each other
          </p>
        </div>

        {/* Profile Photos */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Current User Photo */}
          <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full border-4 border-purple-900 shadow-glow-pink-lg">
            {currentUser?.photo ? (
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-700">
                <span className="text-2xl font-bold text-white/50">
                  {getInitials(currentUser?.name)}
                </span>
              </div>
            )}
          </div>

          {/* Match Heart */}
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-match shadow-glow-pink-md animate-heart-beat">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          {/* Matched User Photo */}
          <div className="relative -ml-8 h-28 w-28 overflow-hidden rounded-full border-4 border-purple-900 shadow-glow-cyan-lg">
            {matchedUser?.photo ? (
              <img
                src={matchedUser.photo}
                alt={matchedUser.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-700">
                <span className="text-2xl font-bold text-white/50">
                  {getInitials(matchedUser?.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => onSendMessage?.(matchedUser)}
            className={cn(
              'flex items-center justify-center gap-2',
              'h-12 w-full rounded-xl',
              'bg-gradient-to-r from-pink-600 to-pink-500',
              'font-semibold text-white',
              'shadow-glow-pink-md',
              'transition-all duration-200',
              'active:scale-[0.98]',
              'hover:from-pink-500 hover:to-pink-400',
              'hover:shadow-glow-pink-lg'
            )}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            Send Message
          </button>

          <button
            onClick={onKeepSpotting}
            className={cn(
              'flex items-center justify-center gap-2',
              'h-12 w-full rounded-xl',
              'bg-white/10 border border-white/20',
              'font-semibold text-white/80',
              'transition-all duration-200',
              'active:scale-[0.98]',
              'hover:bg-white/15 hover:text-white'
            )}
          >
            Keep Spotting
          </button>
        </div>

        {children}
      </Card>
    );
  }
);
MatchCard.displayName = 'MatchCard';

/* ==========================================================================
   PROFILE PREVIEW CARD - Compact profile card for lists
   ========================================================================== */

/**
 * ProfilePreviewCard - Compact card for profile lists, matches, etc.
 */
const ProfilePreviewCard = React.forwardRef(
  (
    {
      className,
      user,
      onPress,
      showDistance = true,
      showStatus = true,
      rightContent,
      children,
      ...props
    },
    ref
  ) => {
    const {
      name,
      age,
      photo,
      distance,
      isOnline,
      lastActive,
      isVerified,
    } = user || {};

    return (
      <Card
        className={cn(
          'flex items-center gap-3 p-3',
          onPress && 'cursor-pointer',
          className
        )}
        variant={onPress ? 'interactive' : 'elevated'}
        ref={ref}
        onClick={() => onPress?.(user)}
        {...props}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="h-14 w-14 overflow-hidden rounded-full">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-700">
                <span className="text-lg font-bold text-white/50">
                  {getInitials(name)}
                </span>
              </div>
            )}
          </div>

          {/* Online Status */}
          {showStatus && isOnline && (
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-purple-800 bg-success" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate font-semibold text-white">
              {name}
              {age && <span className="font-normal text-white/70">, {getAge(age)}</span>}
            </h4>
            {isVerified && (
              <svg className="h-4 w-4 flex-shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-white/50">
            {showDistance && distance != null && (
              <span>{formatDistance(distance)} away</span>
            )}
            {showStatus && !isOnline && lastActive && (
              <span>Active {formatRelativeTime(lastActive)}</span>
            )}
          </div>
        </div>

        {/* Right Content (e.g., action button, timestamp) */}
        {rightContent}

        {children}
      </Card>
    );
  }
);
ProfilePreviewCard.displayName = 'ProfilePreviewCard';

/* ==========================================================================
   MESSAGE PREVIEW CARD - For chat list
   ========================================================================== */

/**
 * MessagePreviewCard - Chat list item showing conversation preview
 */
const MessagePreviewCard = React.forwardRef(
  (
    {
      className,
      user,
      lastMessage,
      timestamp,
      unreadCount = 0,
      onPress,
      children,
      ...props
    },
    ref
  ) => {
    const { name, photo, isOnline } = user || {};

    return (
      <Card
        className={cn(
          'flex items-center gap-3 p-3',
          className
        )}
        variant="interactive"
        ref={ref}
        onClick={() => onPress?.(user)}
        {...props}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="h-14 w-14 overflow-hidden rounded-full">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-700">
                <span className="text-lg font-bold text-white/50">
                  {getInitials(name)}
                </span>
              </div>
            )}
          </div>

          {/* Online Status */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-purple-800 bg-success" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate font-semibold text-white">{name}</h4>
            {timestamp && (
              <span className="flex-shrink-0 text-xs text-white/50">
                {formatRelativeTime(timestamp)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              'truncate text-sm',
              unreadCount > 0 ? 'font-medium text-white/80' : 'text-white/50'
            )}>
              {lastMessage}
            </p>

            {/* Unread Badge */}
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 text-xs font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>

        {children}
      </Card>
    );
  }
);
MessagePreviewCard.displayName = 'MessagePreviewCard';

/* ==========================================================================
   CREDIT CARD - Display user credits
   ========================================================================== */

/**
 * CreditCard - Shows user's credit balance
 */
const CreditCard = React.forwardRef(
  (
    {
      className,
      credits = 0,
      onBuyMore,
      variant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        className={cn(
          'p-4',
          variant === 'compact' ? 'flex items-center gap-3' : '',
          className
        )}
        variant="glass"
        ref={ref}
        {...props}
      >
        {/* Icon */}
        <div className={cn(
          'flex items-center justify-center rounded-full bg-gradient-superspot',
          variant === 'compact' ? 'h-10 w-10' : 'h-14 w-14 mx-auto mb-3'
        )}>
          <svg
            className={cn(
              'text-white',
              variant === 'compact' ? 'h-5 w-5' : 'h-7 w-7'
            )}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Info */}
        <div className={cn(variant === 'compact' ? 'flex-1' : 'text-center')}>
          <p className={cn(
            'font-bold text-white',
            variant === 'compact' ? 'text-lg' : 'text-2xl'
          )}>
            {credits}
          </p>
          <p className="text-sm text-white/60">
            {credits === 1 ? 'Credit' : 'Credits'}
          </p>
        </div>

        {/* Buy Button */}
        {onBuyMore && (
          <button
            onClick={onBuyMore}
            className={cn(
              'flex items-center justify-center gap-1.5',
              'rounded-lg px-3 py-1.5',
              'bg-white/10 hover:bg-white/15',
              'text-sm font-medium text-white',
              'transition-colors duration-200',
              variant !== 'compact' && 'mt-3 w-full'
            )}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Get More
          </button>
        )}

        {children}
      </Card>
    );
  }
);
CreditCard.displayName = 'CreditCard';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  Card,
  cardVariants,
  ProfileCard,
  VenueCard,
  MatchCard,
  ProfilePreviewCard,
  MessagePreviewCard,
  CreditCard,
};
