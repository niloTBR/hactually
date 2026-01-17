'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY MODAL & SHEET COMPONENTS
 * ============================================================================
 *
 * Mobile-first modal and bottom sheet components with gesture support,
 * animations, and proper accessibility.
 */

/* ==========================================================================
   MODAL OVERLAY
   ========================================================================== */

/**
 * Overlay - Backdrop for modals and sheets
 */
const Overlay = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClick,
      blur = true,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0',
          'bg-black/60',
          blur && 'backdrop-blur-sm',
          'z-overlay',
          'animate-in fade-in duration-200',
          className
        )}
        onClick={onClick}
        {...props}
      />
    );
  }
);
Overlay.displayName = 'Overlay';

/* ==========================================================================
   MODAL
   ========================================================================== */

const modalVariants = cva(
  [
    'fixed',
    'bg-purple-900',
    'shadow-2xl',
    'z-modal',
    'overflow-hidden',
  ],
  {
    variants: {
      position: {
        center: [
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl',
          'max-h-[85vh]',
          'animate-in zoom-in-95 fade-in duration-200',
        ],
        top: [
          'top-4 left-4 right-4',
          'rounded-2xl',
          'max-h-[85vh]',
          'animate-in slide-in-from-top fade-in duration-200',
        ],
        fullscreen: [
          'inset-0',
          'animate-in fade-in duration-200',
        ],
      },

      size: {
        sm: 'w-[90vw] max-w-sm',
        md: 'w-[90vw] max-w-md',
        lg: 'w-[90vw] max-w-lg',
        xl: 'w-[90vw] max-w-xl',
        full: 'w-full',
      },
    },

    defaultVariants: {
      position: 'center',
      size: 'md',
    },
  }
);

/**
 * Modal Component
 */
const Modal = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      position,
      size,
      closeOnOverlay = true,
      showClose = true,
      children,
      ...props
    },
    ref
  ) => {
    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && isOpen) {
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        <Overlay
          isOpen={isOpen}
          onClick={closeOnOverlay ? onClose : undefined}
        />

        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(modalVariants({ position, size, className }))}
          {...props}
        >
          {/* Close Button */}
          {showClose && position !== 'fullscreen' && (
            <button
              onClick={onClose}
              className={cn(
                'absolute top-3 right-3',
                'flex h-8 w-8 items-center justify-center',
                'rounded-full',
                'bg-white/10 text-white/70',
                'transition-colors duration-200',
                'hover:bg-white/20 hover:text-white',
                'z-10'
              )}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {children}
        </div>
      </>
    );
  }
);
Modal.displayName = 'Modal';

/* ==========================================================================
   MODAL PARTS
   ========================================================================== */

/**
 * ModalHeader - Header section of modal
 */
const ModalHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-5 pt-5 pb-3',
          'border-b border-white/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalHeader.displayName = 'ModalHeader';

/**
 * ModalTitle - Title for modal header
 */
const ModalTitle = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-lg font-semibold text-white pr-8', className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
ModalTitle.displayName = 'ModalTitle';

/**
 * ModalDescription - Description for modal header
 */
const ModalDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('mt-1 text-sm text-white/60', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
ModalDescription.displayName = 'ModalDescription';

/**
 * ModalBody - Content section of modal
 */
const ModalBody = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-y-auto p-5', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalBody.displayName = 'ModalBody';

/**
 * ModalFooter - Footer section of modal
 */
const ModalFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-5 py-4',
          'border-t border-white/10',
          'flex items-center justify-end gap-3',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModalFooter.displayName = 'ModalFooter';

/* ==========================================================================
   BOTTOM SHEET
   ========================================================================== */

/**
 * BottomSheet - Drawer that slides up from bottom
 */
const BottomSheet = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      snapPoints = ['50%', '90%'],
      initialSnap = 0,
      closeOnOverlay = true,
      showHandle = true,
      children,
      ...props
    },
    ref
  ) => {
    const sheetRef = React.useRef(null);
    const [currentSnap, setCurrentSnap] = React.useState(initialSnap);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartY = React.useRef(0);
    const currentY = React.useRef(0);

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && isOpen) {
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    const handleTouchStart = (e) => {
      setIsDragging(true);
      dragStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      currentY.current = e.touches[0].clientY - dragStartY.current;

      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${Math.max(0, currentY.current)}px)`;
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);

      if (currentY.current > 100) {
        // Dragged down enough to close or change snap
        if (currentSnap < snapPoints.length - 1) {
          setCurrentSnap(currentSnap + 1);
        } else {
          onClose?.();
        }
      } else if (currentY.current < -100) {
        // Dragged up
        if (currentSnap > 0) {
          setCurrentSnap(currentSnap - 1);
        }
      }

      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
      }
      currentY.current = 0;
    };

    if (!isOpen) return null;

    const currentHeight = snapPoints[currentSnap];

    return (
      <>
        <Overlay
          isOpen={isOpen}
          onClick={closeOnOverlay ? onClose : undefined}
        />

        <div
          ref={(node) => {
            sheetRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          role="dialog"
          aria-modal="true"
          className={cn(
            'fixed bottom-0 left-0 right-0',
            'bg-purple-900',
            'rounded-t-3xl',
            'shadow-2xl',
            'z-modal',
            'transition-transform duration-300 ease-out',
            'animate-in slide-in-from-bottom duration-300',
            'safe-area-bottom',
            className
          )}
          style={{ height: currentHeight }}
          {...props}
        >
          {/* Drag Handle */}
          {showHandle && (
            <div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="h-1 w-10 rounded-full bg-white/30" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </div>
      </>
    );
  }
);
BottomSheet.displayName = 'BottomSheet';

/* ==========================================================================
   ALERT DIALOG
   ========================================================================== */

/**
 * AlertDialog - Confirmation dialog
 */
const AlertDialog = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      onConfirm,
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'default',
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: {
        confirm: 'bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-500 hover:to-pink-400',
        icon: null,
      },
      danger: {
        confirm: 'bg-gradient-to-r from-error-dark to-error text-white hover:from-error hover:to-error-light',
        icon: (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/20">
            <svg className="h-7 w-7 text-error-light" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
        ),
      },
      success: {
        confirm: 'bg-gradient-to-r from-success-dark to-success text-white hover:from-success hover:to-success-light',
        icon: (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/20">
            <svg className="h-7 w-7 text-success-light" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        ),
      },
    };

    const styles = variantStyles[variant];

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        position="center"
        size="sm"
        showClose={false}
        className={className}
        {...props}
      >
        <div className="p-6 text-center">
          {styles.icon}

          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-white/60">
              {description}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                'flex-1 h-11 rounded-xl',
                'bg-white/10 text-white/80',
                'font-semibold',
                'transition-colors duration-200',
                'hover:bg-white/15 hover:text-white',
                'disabled:opacity-50'
              )}
            >
              {cancelLabel}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 h-11 rounded-xl',
                'font-semibold',
                'transition-all duration-200',
                'active:scale-[0.98]',
                'disabled:opacity-50',
                styles.confirm
              )}
            >
              {isLoading ? (
                <svg className="mx-auto h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
);
AlertDialog.displayName = 'AlertDialog';

/* ==========================================================================
   ACTION SHEET
   ========================================================================== */

/**
 * ActionSheet - iOS-style action sheet with options
 */
const ActionSheet = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      title,
      description,
      actions = [],
      cancelLabel = 'Cancel',
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <>
        <Overlay isOpen={isOpen} onClick={onClose} />

        <div
          ref={ref}
          className={cn(
            'fixed bottom-0 left-0 right-0',
            'p-3',
            'z-modal',
            'safe-area-bottom',
            'animate-in slide-in-from-bottom duration-300',
            className
          )}
          {...props}
        >
          {/* Actions Card */}
          <div className="rounded-2xl bg-purple-800 overflow-hidden">
            {/* Header */}
            {(title || description) && (
              <div className="px-4 py-3 text-center border-b border-white/10">
                {title && (
                  <p className="text-sm font-medium text-white/80">{title}</p>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-white/50">{description}</p>
                )}
              </div>
            )}

            {/* Action Items */}
            {actions.map((action, index) => (
              <button
                key={action.id || index}
                onClick={() => {
                  action.onPress?.();
                  if (!action.keepOpen) onClose?.();
                }}
                disabled={action.disabled}
                className={cn(
                  'flex w-full items-center justify-center gap-2',
                  'h-14 px-4',
                  'text-base font-medium',
                  'transition-colors duration-200',
                  'hover:bg-white/5',
                  'active:bg-white/10',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  index > 0 && 'border-t border-white/10',
                  action.destructive
                    ? 'text-error-light'
                    : action.primary
                      ? 'text-pink-400'
                      : 'text-white'
                )}
              >
                {action.icon && <span className="text-xl">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className={cn(
              'mt-2 w-full',
              'h-14 rounded-2xl',
              'bg-purple-800',
              'text-base font-semibold text-white',
              'transition-colors duration-200',
              'hover:bg-purple-750',
              'active:bg-purple-700'
            )}
          >
            {cancelLabel}
          </button>
        </div>
      </>
    );
  }
);
ActionSheet.displayName = 'ActionSheet';

/* ==========================================================================
   TOAST
   ========================================================================== */

const toastVariants = cva(
  [
    'fixed left-4 right-4',
    'flex items-center gap-3',
    'px-4 py-3',
    'rounded-xl',
    'shadow-lg',
    'z-toast',
    'animate-in slide-in-from-top fade-in duration-300',
  ],
  {
    variants: {
      variant: {
        default: 'bg-purple-800 text-white',
        success: 'bg-success text-white',
        error: 'bg-error text-white',
        warning: 'bg-warning text-purple-900',
        info: 'bg-cyan-500 text-white',
      },

      position: {
        top: 'top-4 safe-area-top',
        bottom: 'bottom-20 safe-area-bottom',
      },
    },

    defaultVariants: {
      variant: 'default',
      position: 'top',
    },
  }
);

/**
 * Toast - Notification toast message
 */
const Toast = React.forwardRef(
  (
    {
      className,
      isOpen,
      onClose,
      variant,
      position,
      message,
      action,
      duration = 4000,
      icon,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (isOpen && duration > 0) {
        const timer = setTimeout(() => {
          onClose?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const defaultIcons = {
      success: (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      ),
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(toastVariants({ variant, position, className }))}
        {...props}
      >
        {icon || defaultIcons[variant]}

        <span className="flex-1 text-sm font-medium">{message}</span>

        {action && (
          <button
            onClick={action.onPress}
            className="font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            {action.label}
          </button>
        )}

        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
);
Toast.displayName = 'Toast';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  Overlay,
  Modal,
  modalVariants,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  BottomSheet,
  AlertDialog,
  ActionSheet,
  Toast,
  toastVariants,
};
