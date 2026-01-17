/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* =======================================================================
         COLORS - Hactually Brand Palette
         ======================================================================= */
      colors: {
        // Primary Purple Scale
        purple: {
          50: '#F3EBFF',
          100: '#E0D0FA',
          200: '#C4A8F2',
          300: '#A882E8',
          400: '#8B5FD4',
          500: '#6B42A8',
          600: '#4E3180',
          700: '#3D2660',
          800: '#2D1B45',
          850: '#231335',
          900: '#1A0D24',
          950: '#0D0612',
        },

        // Primary Accent - Hot Pink
        pink: {
          50: '#FFF0F7',
          100: '#FDD6EA',
          200: '#FAADD4',
          300: '#F57DBA',
          400: '#F04DA3',
          500: '#E91E8C',
          600: '#B82073',
          700: '#8C1A5D',
          800: '#6B1548',
          900: '#4A1033',
          950: '#2D0A1E',
        },

        // Secondary Accent - Cyan
        cyan: {
          50: '#ECFFFE',
          100: '#D4F9F6',
          200: '#A7EFEA',
          300: '#7AE4DC',
          400: '#4DD9CE',
          500: '#20C9BC',
          600: '#14968D',
          700: '#0F766E',
          800: '#0D5654',
          900: '#083F3E',
          950: '#042F2E',
        },

        // Tertiary Accent - Orange (Superspot)
        orange: {
          50: '#FFF7ED',
          100: '#FFE9D5',
          200: '#FFCEA0',
          300: '#FFB27A',
          400: '#FF9654',
          500: '#FF7A2E',
          600: '#D45A18',
          700: '#A84415',
          800: '#7C3012',
          900: '#4A2010',
          950: '#2D1508',
        },

        // Semantic
        success: {
          DEFAULT: '#10B981',
          dark: '#065F46',
          light: '#6EE7B7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#92400E',
          light: '#FCD34D',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#991B1B',
          light: '#FCA5A5',
        },
        info: {
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
          light: '#93C5FD',
        },
      },

      /* =======================================================================
         BACKGROUND IMAGES - Gradients
         ======================================================================= */
      backgroundImage: {
        // Brand Gradients
        'gradient-brand': 'linear-gradient(135deg, #2D1B45 0%, #B82073 100%)',
        'gradient-brand-vivid': 'linear-gradient(135deg, #3D2660 0%, #E91E8C 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #231335 0%, #3D2660 100%)',

        // Horizontal Gradients
        'gradient-pink': 'linear-gradient(90deg, #B82073 0%, #F04DA3 100%)',
        'gradient-cyan': 'linear-gradient(90deg, #14968D 0%, #4DD9CE 100%)',
        'gradient-orange': 'linear-gradient(90deg, #D45A18 0%, #FF9654 100%)',

        // Vertical Gradients
        'gradient-background': 'linear-gradient(180deg, #1A0D24 0%, #0D0612 100%)',
        'gradient-card': 'linear-gradient(180deg, #2D1B45 0%, #231335 100%)',

        // Special Effects
        'gradient-match': 'linear-gradient(135deg, #E91E8C 0%, #FF7A2E 100%)',
        'gradient-superspot': 'linear-gradient(135deg, #FF7A2E 0%, #E91E8C 50%, #6B42A8 100%)',
        'gradient-venue-hot': 'linear-gradient(135deg, #D45A18 0%, #B82073 100%)',
        'gradient-online': 'linear-gradient(135deg, #20C9BC 0%, #10B981 100%)',

        // Glass
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',

        // Mesh Gradients
        'gradient-mesh-purple': `
          radial-gradient(at 20% 30%, #3D2660 0%, transparent 50%),
          radial-gradient(at 80% 70%, #8C1A5D 0%, transparent 50%),
          #1A0D24
        `,
        'gradient-mesh-nightlife': `
          radial-gradient(at 10% 90%, #B82073 0%, transparent 40%),
          radial-gradient(at 90% 10%, #14968D 0%, transparent 40%),
          radial-gradient(at 50% 50%, #3D2660 0%, transparent 60%),
          #0D0612
        `,
      },

      /* =======================================================================
         TYPOGRAPHY
         ======================================================================= */
      fontFamily: {
        sans: ['SF Pro Text', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '3xs': ['0.625rem', { lineHeight: '1' }],      // 10px
        '2xs': ['0.6875rem', { lineHeight: '1.2' }],   // 11px
        'xs': ['0.75rem', { lineHeight: '1.25' }],     // 12px
        'sm': ['0.8125rem', { lineHeight: '1.4' }],    // 13px
        'base': ['0.9375rem', { lineHeight: '1.5' }],  // 15px
        'md': ['1rem', { lineHeight: '1.5' }],         // 16px
        'lg': ['1.125rem', { lineHeight: '1.4' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.35' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1.15' }],       // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
      },

      /* =======================================================================
         SPACING
         ======================================================================= */
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '4.5': '1.125rem',  // 18px
        '11': '2.75rem',    // 44px - min touch target
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        'safe-t': 'env(safe-area-inset-top, 0px)',
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
        'safe-l': 'env(safe-area-inset-left, 0px)',
        'safe-r': 'env(safe-area-inset-right, 0px)',
      },

      /* =======================================================================
         BORDER RADIUS
         ======================================================================= */
      borderRadius: {
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.25rem',   // 20px
        '3xl': '1.5rem',    // 24px
        '4xl': '2rem',      // 32px
      },

      /* =======================================================================
         BOX SHADOWS - Including Glow Effects
         ======================================================================= */
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.25)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.35)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.4)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.5)',

        // Colored Glows
        'glow-pink-sm': '0 0 10px rgba(233, 30, 140, 0.3)',
        'glow-pink-md': '0 0 20px rgba(233, 30, 140, 0.4)',
        'glow-pink-lg': '0 0 30px rgba(233, 30, 140, 0.5)',
        'glow-pink-xl': '0 0 50px rgba(233, 30, 140, 0.6)',

        'glow-cyan-sm': '0 0 10px rgba(32, 201, 188, 0.3)',
        'glow-cyan-md': '0 0 20px rgba(32, 201, 188, 0.4)',
        'glow-cyan-lg': '0 0 30px rgba(32, 201, 188, 0.5)',

        'glow-orange-sm': '0 0 10px rgba(255, 122, 46, 0.3)',
        'glow-orange-md': '0 0 20px rgba(255, 122, 46, 0.4)',
        'glow-orange-lg': '0 0 30px rgba(255, 122, 46, 0.5)',

        'glow-purple-sm': '0 0 10px rgba(107, 66, 168, 0.3)',
        'glow-purple-md': '0 0 20px rgba(107, 66, 168, 0.4)',

        // Card Shadows
        'card': '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(233, 30, 140, 0.3)',

        // Button Shadows
        'button-pink': '0 4px 14px rgba(233, 30, 140, 0.4)',
        'button-cyan': '0 4px 14px rgba(32, 201, 188, 0.4)',
        'button-orange': '0 4px 14px rgba(255, 122, 46, 0.4)',

        // Focus Rings
        'ring-pink': '0 0 0 3px rgba(233, 30, 140, 0.4)',
        'ring-cyan': '0 0 0 3px rgba(32, 201, 188, 0.4)',
        'ring-white': '0 0 0 3px rgba(255, 255, 255, 0.3)',
      },

      /* =======================================================================
         TRANSITIONS & ANIMATIONS
         ======================================================================= */
      transitionDuration: {
        'instant': '50ms',
        'fast': '100ms',
        'normal': '150ms',
        'moderate': '200ms',
        'slow': '300ms',
        'slower': '400ms',
        'slowest': '500ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'fade-in-up': 'fadeInUp 300ms ease-out forwards',
        'slide-in-up': 'slideInUp 300ms ease-out forwards',
        'slide-in-down': 'slideInDown 300ms ease-out forwards',
        'scale-in': 'scaleIn 200ms ease-out forwards',
        'scale-in-bounce': 'scaleInBounce 400ms ease-out forwards',
        'swipe-right': 'swipeRight 300ms ease-out forwards',
        'swipe-left': 'swipeLeft 300ms ease-out forwards',
        'match-pop': 'matchPop 500ms ease-out forwards',
        'heart-beat': 'heartBeat 1s ease-in-out',
        'spot-notification': 'spotNotification 400ms ease-out forwards',
        'marker-pop': 'markerPop 300ms ease-out forwards',
        'location-pulse': 'locationPulse 2s ease-out infinite',
        'avatar-online': 'avatarOnline 2s ease-out infinite',
        'avatar-spotted': 'avatarSpotted 1.5s ease-out infinite',
        'message-in': 'messageBubbleIn 200ms ease-out forwards',
        'gradient-shift': 'gradientShift 3s ease infinite',
        // StarBorder glow animation
        'star-movement-bottom': 'starMovementBottom 6s linear infinite alternate',
        'star-movement-top': 'starMovementTop 6s linear infinite alternate',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(233, 30, 140, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(233, 30, 140, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        slideInDown: {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        scaleInBounce: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(150%) rotate(30deg)', opacity: '0' },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-150%) rotate(-30deg)', opacity: '0' },
        },
        matchPop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        spotNotification: {
          '0%': { transform: 'scale(0.5) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.1) translateY(-5px)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        markerPop: {
          '0%': { transform: 'scale(0) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.2) translateY(-5px)' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        locationPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        avatarOnline: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(32, 201, 188, 0.7)' },
          '50%': { boxShadow: '0 0 0 8px rgba(32, 201, 188, 0)' },
        },
        avatarSpotted: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(233, 30, 140, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(233, 30, 140, 0)' },
        },
        messageBubbleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        // StarBorder glow keyframes
        starMovementBottom: {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        starMovementTop: {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },

      /* =======================================================================
         Z-INDEX
         ======================================================================= */
      zIndex: {
        'below': '-1',
        'raised': '10',
        'dropdown': '100',
        'sticky': '200',
        'header': '300',
        'overlay': '400',
        'modal': '500',
        'popover': '600',
        'toast': '700',
        'tooltip': '800',
        'max': '9999',
      },

      /* =======================================================================
         ASPECT RATIOS
         ======================================================================= */
      aspectRatio: {
        'profile': '4/5',
        'venue': '16/9',
        'avatar': '1/1',
      },

      /* =======================================================================
         BACKDROP BLUR
         ======================================================================= */
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
    },
  },

  plugins: [
    // Custom plugin for Hactually utilities
    function({ addUtilities, addComponents }) {
      // Glass morphism utilities
      addUtilities({
        '.glass': {
          background: 'rgba(45, 27, 69, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-light': {
          background: 'rgba(45, 27, 69, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          background: 'rgba(13, 6, 18, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      });

      // Touch feedback
      addUtilities({
        '.touch-feedback': {
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        },
      });

      // Safe area padding
      addUtilities({
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        },
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top, 0px)',
        },
        '.px-safe': {
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        },
      });

      // Gradient text utilities
      addUtilities({
        '.text-gradient-pink': {
          background: 'linear-gradient(135deg, #F04DA3, #B82073)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-brand': {
          background: 'linear-gradient(135deg, #E91E8C, #20C9BC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-match': {
          background: 'linear-gradient(135deg, #E91E8C, #FF7A2E)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      });
    },
  ],
};
