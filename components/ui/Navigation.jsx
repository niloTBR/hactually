'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY NAVIGATION COMPONENTS
 * ============================================================================
 *
 * Mobile-first navigation components including bottom tab bar,
 * headers, and tab selectors.
 */

/* ==========================================================================
   BOTTOM NAVIGATION
   ========================================================================== */

/**
 * BottomNav - Primary mobile navigation with tab items
 */
const BottomNav = React.forwardRef(
  (
    {
      className,
      items = [],
      activeItem,
      onItemPress,
      showLabels = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0',
          'flex items-center justify-around',
          'h-nav px-2',
          'bg-purple-950/95 backdrop-blur-lg',
          'border-t border-white/10',
          'safe-area-bottom',
          'z-nav',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemPress?.(item.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5',
                'py-2',
                'transition-all duration-200',
                'touch-feedback',
                isActive ? 'text-pink-400' : 'text-white/50'
              )}
            >
              {/* Icon */}
              <div className="relative">
                {item.icon && (
                  <span className={cn(
                    'text-2xl transition-transform duration-200',
                    isActive && 'scale-110'
                  )}>
                    {typeof item.icon === 'function' ? item.icon(isActive) : item.icon}
                  </span>
                )}

                {/* Notification Badge */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-3xs font-bold text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}

                {/* Active Dot Indicator */}
                {isActive && !showLabels && (
                  <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pink-400" />
                )}
              </div>

              {/* Label */}
              {showLabels && (
                <span className={cn(
                  'text-2xs font-medium transition-opacity duration-200',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}>
                  {item.label}
                </span>
              )}

              {/* Active Glow */}
              {isActive && (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
              )}
            </button>
          );
        })}

        {children}
      </nav>
    );
  }
);
BottomNav.displayName = 'BottomNav';

/* ==========================================================================
   HEADER
   ========================================================================== */

const headerVariants = cva(
  [
    'fixed top-0 left-0 right-0',
    'flex items-center',
    'px-4',
    'z-header',
    'safe-area-top',
  ],
  {
    variants: {
      variant: {
        default: 'bg-purple-950/95 backdrop-blur-lg border-b border-white/10',
        transparent: 'bg-transparent',
        glass: 'glass border-b border-white/10',
        solid: 'bg-purple-950',
      },

      size: {
        sm: 'h-12',
        md: 'h-14',
        lg: 'h-16',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Header - Top navigation bar
 */
const Header = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      title,
      subtitle,
      leftContent,
      rightContent,
      onBack,
      showBack = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant, size, className }))}
        {...props}
      >
        {/* Left Section */}
        <div className="flex w-16 items-center justify-start">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className={cn(
                'flex h-10 w-10 items-center justify-center',
                'rounded-full',
                '-ml-2',
                'text-white/80',
                'transition-colors duration-200',
                'hover:bg-white/10 hover:text-white',
                'active:scale-95'
              )}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {leftContent}
        </div>

        {/* Center Section - Title */}
        <div className="flex-1 text-center">
          {title && (
            <h1 className="truncate font-semibold text-white">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="truncate text-xs text-white/50">{subtitle}</p>
          )}
        </div>

        {/* Right Section */}
        <div className="flex w-16 items-center justify-end gap-1">
          {rightContent}
        </div>

        {children}
      </header>
    );
  }
);
Header.displayName = 'Header';

/* ==========================================================================
   HEADER ACTION BUTTON
   ========================================================================== */

/**
 * HeaderAction - Icon button for header actions
 */
const HeaderAction = React.forwardRef(
  (
    {
      className,
      icon,
      badge,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center',
          'rounded-full',
          'text-white/80',
          'transition-colors duration-200',
          'hover:bg-white/10 hover:text-white',
          'active:scale-95',
          className
        )}
        {...props}
      >
        {icon}

        {badge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-3xs font-bold text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>
    );
  }
);
HeaderAction.displayName = 'HeaderAction';

/* ==========================================================================
   PROFILE HEADER
   ========================================================================== */

/**
 * ProfileHeader - Header with user avatar and info
 */
const ProfileHeader = React.forwardRef(
  (
    {
      className,
      user,
      onBack,
      onSettings,
      onEdit,
      rightContent,
      children,
      ...props
    },
    ref
  ) => {
    const { name, photo, isVerified, credits } = user || {};

    return (
      <header
        ref={ref}
        className={cn(
          headerVariants({ variant: 'default', size: 'lg' }),
          'gap-3',
          className
        )}
        {...props}
      >
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className={cn(
              'flex h-10 w-10 items-center justify-center',
              'rounded-full',
              '-ml-2',
              'text-white/80',
              'transition-colors duration-200',
              'hover:bg-white/10 hover:text-white',
              'active:scale-95'
            )}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* User Info */}
        <div className="flex flex-1 items-center gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {photo ? (
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-purple-700">
                <span className="font-semibold text-white/50">
                  {name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name & Verified */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate font-semibold text-white">{name}</span>
              {isVerified && (
                <svg className="h-4 w-4 flex-shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Credits Badge */}
        {credits !== undefined && (
          <div className="flex items-center gap-1 rounded-full bg-gradient-superspot px-2.5 py-1">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-bold text-white">{credits}</span>
          </div>
        )}

        {/* Actions */}
        {rightContent}

        {onSettings && (
          <HeaderAction
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            }
            onClick={onSettings}
          />
        )}

        {onEdit && (
          <HeaderAction
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            }
            onClick={onEdit}
          />
        )}

        {children}
      </header>
    );
  }
);
ProfileHeader.displayName = 'ProfileHeader';

/* ==========================================================================
   TAB BAR
   ========================================================================== */

/**
 * TabBar - Horizontal tab selector
 */
const TabBar = React.forwardRef(
  (
    {
      className,
      tabs = [],
      activeTab,
      onTabChange,
      variant = 'default',
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const tabRefs = React.useRef({});
    const [indicatorStyle, setIndicatorStyle] = React.useState({});

    React.useEffect(() => {
      const activeRef = tabRefs.current[activeTab];
      if (activeRef) {
        setIndicatorStyle({
          left: activeRef.offsetLeft,
          width: activeRef.offsetWidth,
        });
      }
    }, [activeTab]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          variant === 'pills' ? 'p-1 rounded-xl bg-white/5' : 'border-b border-white/10',
          className
        )}
        {...props}
      >
        <div className={cn(
          'flex',
          fullWidth ? 'w-full' : 'w-auto',
          variant === 'default' && 'gap-1'
        )}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  'relative flex items-center justify-center gap-2',
                  'px-4 py-2.5',
                  'font-medium',
                  'transition-all duration-200',
                  fullWidth && 'flex-1',
                  variant === 'default' && [
                    isActive
                      ? 'text-pink-400'
                      : 'text-white/50 hover:text-white/70',
                  ],
                  variant === 'pills' && [
                    'rounded-lg',
                    isActive
                      ? 'bg-pink-500 text-white shadow-glow-pink-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/5',
                  ]
                )}
              >
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                <span className="text-sm">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className={cn(
                    'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-3xs font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-pink-500/20 text-pink-400'
                  )}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Indicator (for default variant) */}
        {variant === 'default' && (
          <span
            className="absolute bottom-0 h-0.5 rounded-full bg-pink-500 transition-all duration-300"
            style={indicatorStyle}
          />
        )}

        {children}
      </div>
    );
  }
);
TabBar.displayName = 'TabBar';

/* ==========================================================================
   SEGMENTED CONTROL
   ========================================================================== */

/**
 * SegmentedControl - iOS-style segmented control
 */
const SegmentedControl = React.forwardRef(
  (
    {
      className,
      segments = [],
      value,
      onChange,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const segmentRefs = React.useRef({});
    const [indicatorStyle, setIndicatorStyle] = React.useState({});

    React.useEffect(() => {
      const activeRef = segmentRefs.current[value];
      if (activeRef) {
        setIndicatorStyle({
          left: activeRef.offsetLeft,
          width: activeRef.offsetWidth,
        });
      }
    }, [value]);

    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex p-1',
          'rounded-xl',
          'bg-white/5',
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Background Indicator */}
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-pink-500 shadow-glow-pink-sm transition-all duration-300"
          style={indicatorStyle}
        />

        {/* Segments */}
        {segments.map((segment) => {
          const isActive = value === segment.value;

          return (
            <button
              key={segment.value}
              ref={(el) => (segmentRefs.current[segment.value] = el)}
              onClick={() => onChange?.(segment.value)}
              className={cn(
                'relative flex items-center justify-center',
                'px-4',
                'font-medium',
                'transition-colors duration-200',
                isActive ? 'text-white' : 'text-white/60 hover:text-white/80'
              )}
            >
              {segment.label}
            </button>
          );
        })}
      </div>
    );
  }
);
SegmentedControl.displayName = 'SegmentedControl';

/* ==========================================================================
   BREADCRUMB
   ========================================================================== */

/**
 * Breadcrumb - Navigation breadcrumb trail
 */
const Breadcrumb = React.forwardRef(
  (
    {
      className,
      items = [],
      separator,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.id || index}>
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className={cn(
                  'text-sm',
                  isLast ? 'text-white font-medium' : 'text-white/60'
                )}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-white/30">
                  {separator || (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  )}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

/* ==========================================================================
   PAGE INDICATOR (for carousels/onboarding)
   ========================================================================== */

/**
 * PageIndicator - Dot indicators for pages/slides
 */
const PageIndicator = React.forwardRef(
  (
    {
      className,
      count,
      current,
      onPageChange,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-2', className)}
        {...props}
      >
        {Array.from({ length: count }).map((_, index) => {
          const isActive = index === current;

          return (
            <button
              key={index}
              onClick={() => onPageChange?.(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                variant === 'default' && [
                  isActive
                    ? 'h-2 w-6 bg-pink-500'
                    : 'h-2 w-2 bg-white/30 hover:bg-white/50',
                ],
                variant === 'dots' && [
                  'h-2 w-2',
                  isActive
                    ? 'bg-pink-500'
                    : 'bg-white/30 hover:bg-white/50',
                ],
                variant === 'lines' && [
                  'h-1',
                  isActive
                    ? 'w-8 bg-pink-500'
                    : 'w-4 bg-white/30 hover:bg-white/50',
                ]
              )}
            />
          );
        })}
      </div>
    );
  }
);
PageIndicator.displayName = 'PageIndicator';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  BottomNav,
  Header,
  headerVariants,
  HeaderAction,
  ProfileHeader,
  TabBar,
  SegmentedControl,
  Breadcrumb,
  PageIndicator,
};
