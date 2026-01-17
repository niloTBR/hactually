'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * ============================================================================
 * HACTUALLY INPUT COMPONENTS
 * ============================================================================
 *
 * Mobile-first input components with dark theme, glow effects,
 * and touch-optimized interactions.
 */

/* ==========================================================================
   BASE INPUT
   ========================================================================== */

const inputVariants = cva(
  [
    'w-full',
    'rounded-xl',
    'bg-white/5',
    'border border-white/10',
    'text-white placeholder:text-white/40',
    'transition-all duration-200',
    'focus:outline-none focus:border-pink-500/50 focus:bg-white/10',
    'focus:ring-2 focus:ring-pink-500/20',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        glass: 'glass border-white/20',
        solid: 'bg-purple-800 border-purple-700',
        error: 'border-error focus:border-error focus:ring-error/20',
        success: 'border-success focus:border-success focus:ring-success/20',
      },

      inputSize: {
        sm: 'h-10 px-3 text-sm',
        md: 'h-12 px-4 text-base',  // 48px - good touch target
        lg: 'h-14 px-5 text-lg',
      },
    },

    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

/**
 * Base Input Component
 */
const Input = React.forwardRef(
  ({ className, variant, inputSize, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

/* ==========================================================================
   INPUT WITH LABEL
   ========================================================================== */

/**
 * InputField - Input with label and optional helper/error text
 */
const InputField = React.forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      required,
      variant,
      inputSize,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const effectiveVariant = error ? 'error' : variant;

    return (
      <div className={cn('space-y-1.5', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80"
          >
            {label}
            {required && <span className="ml-1 text-pink-400">*</span>}
          </label>
        )}

        <Input
          id={inputId}
          ref={ref}
          variant={effectiveVariant}
          inputSize={inputSize}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={cn(
              'text-sm',
              error ? 'text-error-light' : 'text-white/50'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
InputField.displayName = 'InputField';

/* ==========================================================================
   SEARCH INPUT
   ========================================================================== */

/**
 * SearchInput - Search field with icon and clear button
 */
const SearchInput = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      onClear,
      onSearch,
      placeholder = 'Search...',
      isLoading = false,
      variant = 'glass',
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
      }
    };

    return (
      <div className={cn('relative', className)}>
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-white/50"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            inputVariants({ variant, inputSize: 'md' }),
            'pl-12 pr-10'
          )}
          {...props}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onClear?.();
              onChange?.({ target: { value: '' } });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

/* ==========================================================================
   CHAT INPUT
   ========================================================================== */

/**
 * ChatInput - Message input with send button and optional actions
 */
const ChatInput = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      onSend,
      onAttachment,
      placeholder = 'Type a message...',
      maxLength = 500,
      disabled = false,
      isSending = false,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef(null);
    const mergedRef = ref || textareaRef;

    // Auto-resize textarea
    React.useEffect(() => {
      const textarea = mergedRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      }
    }, [value, mergedRef]);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value?.trim() && !isSending) {
          onSend?.(value);
        }
      }
    };

    const canSend = value?.trim().length > 0 && !disabled && !isSending;

    return (
      <div
        className={cn(
          'flex items-end gap-2',
          'p-3',
          'bg-purple-900/80 backdrop-blur-lg',
          'border-t border-white/10',
          'safe-area-bottom',
          className
        )}
      >
        {/* Attachment Button */}
        {onAttachment && (
          <button
            type="button"
            onClick={onAttachment}
            disabled={disabled}
            className={cn(
              'flex h-10 w-10 items-center justify-center',
              'rounded-full',
              'bg-white/10 text-white/70',
              'transition-colors duration-200',
              'hover:bg-white/15 hover:text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
        )}

        {/* Text Input */}
        <div className="relative flex-1">
          <textarea
            ref={mergedRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none',
              'rounded-2xl',
              'bg-white/5 border border-white/10',
              'px-4 py-2.5',
              'text-white placeholder:text-white/40',
              'transition-all duration-200',
              'focus:outline-none focus:border-pink-500/50 focus:bg-white/10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[44px] max-h-[120px]'
            )}
            {...props}
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => canSend && onSend?.(value)}
          disabled={!canSend}
          className={cn(
            'flex h-10 w-10 items-center justify-center',
            'rounded-full',
            'transition-all duration-200',
            canSend
              ? [
                  'bg-gradient-to-br from-pink-500 to-pink-600',
                  'text-white',
                  'shadow-glow-pink-sm',
                  'hover:shadow-glow-pink-md',
                  'active:scale-95',
                ]
              : [
                  'bg-white/10',
                  'text-white/30',
                  'cursor-not-allowed',
                ]
          )}
        >
          {isSending ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);
ChatInput.displayName = 'ChatInput';

/* ==========================================================================
   OTP INPUT
   ========================================================================== */

/**
 * OTPInput - One-time password/verification code input
 */
const OTPInput = React.forwardRef(
  (
    {
      className,
      length = 6,
      value = '',
      onChange,
      onComplete,
      error,
      autoFocus = true,
      ...props
    },
    ref
  ) => {
    const inputRefs = React.useRef([]);

    const handleChange = (index, e) => {
      const digit = e.target.value.replace(/\D/g, '').slice(-1);
      const newValue = value.split('');
      newValue[index] = digit;
      const newOTP = newValue.join('').slice(0, length);

      onChange?.(newOTP);

      // Move to next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Trigger complete callback
      if (newOTP.length === length) {
        onComplete?.(newOTP);
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace') {
        if (!value[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange?.(pastedData);

      if (pastedData.length === length) {
        onComplete?.(pastedData);
        inputRefs.current[length - 1]?.focus();
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    };

    React.useEffect(() => {
      if (autoFocus) {
        inputRefs.current[0]?.focus();
      }
    }, [autoFocus]);

    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex justify-center gap-2">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                'h-14 w-12',
                'rounded-xl',
                'bg-white/5 border-2',
                'text-center text-xl font-bold text-white',
                'transition-all duration-200',
                'focus:outline-none focus:bg-white/10',
                error
                  ? 'border-error focus:border-error'
                  : value[index]
                    ? 'border-pink-500'
                    : 'border-white/20 focus:border-pink-500'
              )}
              {...props}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-error-light">{error}</p>
        )}
      </div>
    );
  }
);
OTPInput.displayName = 'OTPInput';

/* ==========================================================================
   PHONE INPUT
   ========================================================================== */

/**
 * PhoneInput - Phone number input with country code
 */
const PhoneInput = React.forwardRef(
  (
    {
      className,
      value,
      onChange,
      countryCode = '+971',
      onCountryCodeChange,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1.5', className)}>
        <div className="flex gap-2">
          {/* Country Code */}
          <button
            type="button"
            onClick={onCountryCodeChange}
            className={cn(
              'flex items-center justify-center gap-1',
              'h-12 px-4',
              'rounded-xl',
              'bg-white/5 border border-white/10',
              'text-white',
              'transition-all duration-200',
              'hover:bg-white/10',
              'focus:outline-none focus:border-pink-500/50'
            )}
          >
            <span className="font-medium">{countryCode}</span>
            <svg className="h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          {/* Phone Number */}
          <Input
            ref={ref}
            type="tel"
            inputMode="tel"
            value={value}
            onChange={onChange}
            placeholder="50 123 4567"
            variant={error ? 'error' : 'default'}
            className="flex-1"
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-error-light">{error}</p>
        )}
      </div>
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

/* ==========================================================================
   TEXTAREA
   ========================================================================== */

const textareaVariants = cva(
  [
    'w-full',
    'rounded-xl',
    'bg-white/5',
    'border border-white/10',
    'px-4 py-3',
    'text-white placeholder:text-white/40',
    'transition-all duration-200',
    'focus:outline-none focus:border-pink-500/50 focus:bg-white/10',
    'focus:ring-2 focus:ring-pink-500/20',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-none',
  ],
  {
    variants: {
      variant: {
        default: '',
        glass: 'glass border-white/20',
        solid: 'bg-purple-800 border-purple-700',
        error: 'border-error focus:border-error focus:ring-error/20',
      },
    },

    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Textarea Component
 */
const Textarea = React.forwardRef(
  (
    {
      className,
      variant,
      label,
      error,
      helperText,
      required,
      maxLength,
      showCount = false,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const effectiveVariant = error ? 'error' : variant;
    const characterCount = value?.length || 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80"
          >
            {label}
            {required && <span className="ml-1 text-pink-400">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(textareaVariants({ variant: effectiveVariant, className }))}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-white/40">
              {characterCount}/{maxLength}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-sm',
              error ? 'text-error-light' : 'text-white/50'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/* ==========================================================================
   SELECT INPUT
   ========================================================================== */

/**
 * Select - Styled select dropdown
 */
const Select = React.forwardRef(
  (
    {
      className,
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80"
          >
            {label}
            {required && <span className="ml-1 text-pink-400">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            className={cn(
              inputVariants({ variant: error ? 'error' : 'default', inputSize: 'md' }),
              'appearance-none pr-10 cursor-pointer',
              !value && 'text-white/40',
              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-purple-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="h-5 w-5 text-white/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="text-sm text-error-light">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

/* ==========================================================================
   TOGGLE/SWITCH
   ========================================================================== */

/**
 * Toggle - iOS-style switch component
 */
const Toggle = React.forwardRef(
  (
    {
      className,
      checked = false,
      onChange,
      label,
      description,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          'flex items-center gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Hidden checkbox */}
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Custom toggle */}
        <div
          className={cn(
            'relative h-7 w-12 flex-shrink-0',
            'rounded-full',
            'transition-all duration-200',
            checked
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-glow-pink-sm'
              : 'bg-white/20'
          )}
        >
          <div
            className={cn(
              'absolute top-1 h-5 w-5',
              'rounded-full bg-white',
              'shadow-md',
              'transition-all duration-200',
              checked ? 'left-6' : 'left-1'
            )}
          />
        </div>

        {/* Label */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span className="block font-medium text-white">{label}</span>
            )}
            {description && (
              <span className="block text-sm text-white/50">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);
Toggle.displayName = 'Toggle';

/* ==========================================================================
   EXPORTS
   ========================================================================== */

export {
  Input,
  inputVariants,
  InputField,
  SearchInput,
  ChatInput,
  OTPInput,
  PhoneInput,
  Textarea,
  textareaVariants,
  Select,
  Toggle,
};
