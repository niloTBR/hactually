'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn, formatDistance, getInitials } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY MAP & LOCATION COMPONENTS
 * ============================================================================
 *
 * Location-aware components for displaying maps, markers, venues,
 * and proximity information. These are UI components that work with
 * any map provider (Mapbox, Google Maps, etc.).
 */

/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

/**
 * MapContainer - Wrapper for map with overlays
 */
const MapContainer = React.forwardRef(
  (
    {
      className,
      children,
      isLoading = false,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-full',
          'bg-purple-950',
          'overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500/30 border-t-pink-500" />
              <span className="text-sm text-white/60">Loading map...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950 z-10">
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/20">
                <svg className="h-7 w-7 text-error-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <p className="text-white font-medium">Unable to load map</p>
              <p className="text-sm text-white/50">{error}</p>
            </div>
          </div>
        )}

        {children}
      </div>
    );
  }
);
MapContainer.displayName = 'MapContainer';

/* ==========================================================================
   MAP MARKER - USER
   ========================================================================== */

const userMarkerVariants = cva(
  [
    'relative flex items-center justify-center',
    'rounded-full',
    'transition-all duration-200',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'h-10 w-10',
        md: 'h-12 w-12',
        lg: 'h-14 w-14',
      },

      status: {
        online: 'ring-4 ring-success/50',
        'checked-in': 'ring-4 ring-cyan-500/50',
        default: 'ring-4 ring-purple-900',
      },
    },

    defaultVariants: {
      size: 'md',
      status: 'default',
    },
  }
);

/**
 * UserMarker - Map marker showing user avatar
 */
const UserMarker = React.forwardRef(
  (
    {
      className,
      user,
      size,
      status,
      isSelected = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const { name, photo, isVerified } = user || {};

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          'transform -translate-x-1/2 -translate-y-1/2',
          className
        )}
        onClick={() => onClick?.(user)}
        {...props}
      >
        {/* Pulse Animation for Selected */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping" />
        )}

        {/* Avatar */}
        <div
          className={cn(
            userMarkerVariants({ size, status }),
            isSelected && 'ring-pink-500 shadow-glow-pink-md scale-110'
          )}
        >
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-700">
              <span className="font-semibold text-white/50">
                {getInitials(name)}
              </span>
            </div>
          )}
        </div>

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-900">
            <svg className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
        )}

        {/* Pointer Triangle */}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2">
          <div className={cn(
            'h-0 w-0',
            'border-l-[6px] border-l-transparent',
            'border-r-[6px] border-r-transparent',
            'border-t-[8px]',
            isSelected ? 'border-t-pink-500' : 'border-t-purple-900'
          )} />
        </div>
      </div>
    );
  }
);
UserMarker.displayName = 'UserMarker';

/* ==========================================================================
   MAP MARKER - VENUE
   ========================================================================== */

const venueMarkerVariants = cva(
  [
    'relative flex items-center justify-center',
    'rounded-xl',
    'transition-all duration-200',
    'cursor-pointer',
    'shadow-lg',
  ],
  {
    variants: {
      variant: {
        default: 'bg-purple-800',
        hot: 'bg-gradient-to-br from-orange-500 to-pink-500',
        'checked-in': 'bg-cyan-500',
      },

      size: {
        sm: 'h-10 w-10',
        md: 'h-12 w-12',
        lg: 'h-14 w-14',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * VenueMarker - Map marker for venues
 */
const VenueMarker = React.forwardRef(
  (
    {
      className,
      venue,
      variant,
      size,
      isSelected = false,
      showCount = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const { name, icon, peopleHere = 0, isHot = false } = venue || {};
    const effectiveVariant = isHot ? 'hot' : variant;

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          'transform -translate-x-1/2 -translate-y-1/2',
          className
        )}
        onClick={() => onClick?.(venue)}
        {...props}
      >
        {/* Pulse for Hot Venues */}
        {isHot && (
          <div className="absolute inset-0 rounded-xl bg-orange-500/30 animate-ping" />
        )}

        {/* Marker Body */}
        <div
          className={cn(
            venueMarkerVariants({ variant: effectiveVariant, size }),
            isSelected && 'ring-2 ring-pink-500 shadow-glow-pink-md scale-110'
          )}
        >
          {icon || (
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          )}
        </div>

        {/* People Count Badge */}
        {showCount && peopleHere > 0 && (
          <div className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-2xs font-bold text-white ring-2 ring-purple-950">
            {peopleHere > 99 ? '99+' : peopleHere}
          </div>
        )}

        {/* Pointer */}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2">
          <div className={cn(
            'h-0 w-0',
            'border-l-[6px] border-l-transparent',
            'border-r-[6px] border-r-transparent',
            'border-t-[8px]',
            effectiveVariant === 'hot'
              ? 'border-t-pink-500'
              : effectiveVariant === 'checked-in'
                ? 'border-t-cyan-500'
                : 'border-t-purple-800'
          )} />
        </div>
      </div>
    );
  }
);
VenueMarker.displayName = 'VenueMarker';

/* ==========================================================================
   CURRENT LOCATION MARKER
   ========================================================================== */

/**
 * CurrentLocationMarker - Shows user's current location
 */
const CurrentLocationMarker = React.forwardRef(
  (
    {
      className,
      accuracy,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          'transform -translate-x-1/2 -translate-y-1/2',
          className
        )}
        {...props}
      >
        {/* Accuracy Circle */}
        {accuracy && (
          <div
            className="absolute rounded-full bg-cyan-500/10 border border-cyan-500/30"
            style={{
              width: accuracy * 2,
              height: accuracy * 2,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Pulse Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-cyan-500/30 animate-ping" />
        </div>

        {/* Center Dot */}
        <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 shadow-glow-cyan-md">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>
    );
  }
);
CurrentLocationMarker.displayName = 'CurrentLocationMarker';

/* ==========================================================================
   MAP POPUP / INFO WINDOW
   ========================================================================== */

/**
 * MapPopup - Info popup for map markers
 */
const MapPopup = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      position = 'top',
      children,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-10',
          'min-w-48 max-w-64',
          'rounded-xl',
          'bg-purple-800 shadow-xl',
          'animate-in fade-in zoom-in-95 duration-200',
          position === 'top' && '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
          position === 'bottom' && '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
          className
        )}
        {...props}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-3">
          {children}
        </div>

        {/* Arrow */}
        <div className={cn(
          'absolute left-1/2 -translate-x-1/2',
          'h-0 w-0',
          'border-l-[8px] border-l-transparent',
          'border-r-[8px] border-r-transparent',
          position === 'top' && '-bottom-2 border-t-[8px] border-t-purple-800',
          position === 'bottom' && '-top-2 border-b-[8px] border-b-purple-800'
        )} />
      </div>
    );
  }
);
MapPopup.displayName = 'MapPopup';

/* ==========================================================================
   LOCATION PERMISSION REQUEST
   ========================================================================== */

/**
 * LocationPermission - UI for requesting location access
 */
const LocationPermission = React.forwardRef(
  (
    {
      className,
      onAllow,
      onDeny,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          'p-8 text-center',
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20">
          <svg className="h-10 w-10 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white">
          Enable Location
        </h3>

        {/* Description */}
        <p className="mt-2 max-w-xs text-white/60">
          We need your location to show you people and venues nearby. Your location is never shared without permission.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <button
            onClick={onAllow}
            disabled={isLoading}
            className={cn(
              'h-12 w-full rounded-xl',
              'bg-gradient-to-r from-pink-600 to-pink-500',
              'font-semibold text-white',
              'shadow-glow-pink-md',
              'transition-all duration-200',
              'hover:from-pink-500 hover:to-pink-400',
              'active:scale-[0.98]',
              'disabled:opacity-50'
            )}
          >
            {isLoading ? (
              <svg className="mx-auto h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Allow Location Access'
            )}
          </button>

          <button
            onClick={onDeny}
            disabled={isLoading}
            className={cn(
              'h-12 w-full rounded-xl',
              'bg-white/10',
              'font-semibold text-white/70',
              'transition-all duration-200',
              'hover:bg-white/15 hover:text-white',
              'disabled:opacity-50'
            )}
          >
            Not Now
          </button>
        </div>
      </div>
    );
  }
);
LocationPermission.displayName = 'LocationPermission';

/* ==========================================================================
   DISTANCE INDICATOR
   ========================================================================== */

/**
 * DistanceIndicator - Shows distance with visual representation
 */
const DistanceIndicator = React.forwardRef(
  (
    {
      className,
      distance, // in meters
      maxDistance = 5000, // max for visual scale
      showBar = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min((distance / maxDistance) * 100, 100);
    const formattedDistance = formatDistance(distance);

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {/* Location Icon */}
        <svg className="h-4 w-4 flex-shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>

        {/* Distance Text */}
        <span className="text-sm font-medium text-white">
          {formattedDistance}
        </span>

        {/* Progress Bar */}
        {showBar && (
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);
DistanceIndicator.displayName = 'DistanceIndicator';

/* ==========================================================================
   NEARBY USERS LIST
   ========================================================================== */

/**
 * NearbyUsersList - List of users sorted by distance
 */
const NearbyUsersList = React.forwardRef(
  (
    {
      className,
      users = [],
      onUserPress,
      emptyMessage = 'No one nearby right now',
      ...props
    },
    ref
  ) => {
    if (users.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center py-12',
            className
          )}
          {...props}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <svg className="h-8 w-8 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <p className="mt-4 text-white/50">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserPress?.(user)}
            className={cn(
              'flex w-full items-center gap-3 p-3',
              'rounded-xl',
              'bg-white/5',
              'transition-colors duration-200',
              'hover:bg-white/10',
              'active:scale-[0.99]'
            )}
          >
            {/* Avatar */}
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-purple-700">
                  <span className="font-semibold text-white/50">
                    {getInitials(user.name)}
                  </span>
                </div>
              )}

              {user.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-purple-900 bg-success" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">{user.name}</span>
                {user.age && (
                  <span className="text-white/60">, {user.age}</span>
                )}
                {user.isVerified && (
                  <svg className="h-4 w-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-white/50">
                {formatDistance(user.distance)} away
              </p>
            </div>

            {/* Arrow */}
            <svg className="h-5 w-5 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        ))}
      </div>
    );
  }
);
NearbyUsersList.displayName = 'NearbyUsersList';

/* ==========================================================================
   MAP CONTROLS
   ========================================================================== */

/**
 * MapControls - Zoom and locate buttons for map
 */
const MapControls = React.forwardRef(
  (
    {
      className,
      onZoomIn,
      onZoomOut,
      onLocate,
      isLocating = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2',
          className
        )}
        {...props}
      >
        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl bg-purple-800 shadow-lg overflow-hidden">
          <button
            onClick={onZoomIn}
            className="flex h-11 w-11 items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
          <div className="h-px bg-white/10" />
          <button
            onClick={onZoomOut}
            className="flex h-11 w-11 items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
        </div>

        {/* Locate Button */}
        <button
          onClick={onLocate}
          disabled={isLocating}
          className={cn(
            'flex h-11 w-11 items-center justify-center',
            'rounded-xl',
            'bg-purple-800 shadow-lg',
            'text-white/70',
            'transition-all duration-200',
            'hover:bg-purple-700 hover:text-white',
            isLocating && 'text-cyan-400'
          )}
        >
          {isLocating ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);
MapControls.displayName = 'MapControls';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  MapContainer,
  UserMarker,
  userMarkerVariants,
  VenueMarker,
  venueMarkerVariants,
  CurrentLocationMarker,
  MapPopup,
  LocationPermission,
  DistanceIndicator,
  NearbyUsersList,
  MapControls,
};
