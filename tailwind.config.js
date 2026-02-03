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
         COLORS - Hactually 2.0 Brand Palette
         4 Core Colors: Blue, Orange, Brown, Green
         Each with 2 shades + gradient
         ======================================================================= */
      colors: {
        // Primary - Blue (from Screenshot 5.41.48)
        blue: {
          light: '#C8E3F4',  // Light blue text (from the logo)
          DEFAULT: '#5865F2', // Deep vibrant blue (the background)
          dark: '#4752C4',   // Darker blue for hover
        },

        // Accent - Coral/Red (the circles)
        orange: {
          light: '#F5C4C4',  // Soft pink (background from image 2)
          DEFAULT: '#E05A3D', // Deep coral/terracotta red
          dark: '#C94A2F',   // Darker for hover
        },

        // Secondary - Cream/Olive
        brown: {
          lighter: '#F5F1E8', // Lightest cream (page bg)
          mid: '#EDE5D5',     // Mid cream (between bg and cards)
          light: '#E5D9C3',   // Cream (cards)
          DEFAULT: '#8A8B73', // Olive/khaki green
          dark: '#6A6B5A',    // Darker olive for hover
        },

        // Accent - Green/Teal
        green: {
          light: '#D4E4A5',  // Light lime/sage green
          DEFAULT: '#4A7C7C', // Teal green (the circles)
          dark: '#3A6262',   // Darker teal for hover
        },

      },

      /* =======================================================================
         BACKGROUND IMAGES - Gradients
         ======================================================================= */
      backgroundImage: {
        // Primary gradient (light top-right to dark bottom-left)
        'gradient-blue': 'linear-gradient(225deg, #C8E3F4 0%, #5865F2 100%)',
        // Coral/Red gradient (light top-right to dark bottom-left)
        'gradient-orange': 'linear-gradient(225deg, #F5C4C4 0%, #E05A3D 100%)',
        // Brown/Olive gradient (light top-right to dark bottom-left)
        'gradient-brown': 'linear-gradient(225deg, #E5D9C3 0%, #8A8B73 100%)',
        // Green gradient (light top-right to dark bottom-left)
        'gradient-green': 'linear-gradient(225deg, #D4E4A5 0%, #4A7C7C 100%)',
      },

      /* =======================================================================
         TYPOGRAPHY - Ezra Font Family
         ======================================================================= */
      fontFamily: {
        sans: ['Ezra', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Ezra', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],     // 12px - captions, labels
        'sm': ['0.875rem', { lineHeight: '1.4' }],     // 14px - secondary text
        'base': ['1rem', { lineHeight: '1.5' }],       // 16px - body text
        'lg': ['1.25rem', { lineHeight: '1.4' }],      // 20px - subheadings
        'xl': ['1.5rem', { lineHeight: '1.3' }],       // 24px - headings
        '2xl': ['2rem', { lineHeight: '1.2' }],        // 32px - large headings
        '3xl': ['2.5rem', { lineHeight: '1.1' }],      // 40px - display
      },

      /* =======================================================================
         SPACING
         ======================================================================= */
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '11': '2.75rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        'safe-t': 'env(safe-area-inset-top, 0px)',
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
        'safe-l': 'env(safe-area-inset-left, 0px)',
        'safe-r': 'env(safe-area-inset-right, 0px)',
      },

      /* =======================================================================
         BORDER RADIUS
         ======================================================================= */
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      /* =======================================================================
         BOX SHADOWS
         ======================================================================= */
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.15)',

        // Colored shadows
        'glow-blue': '0 4px 14px rgba(91, 103, 202, 0.3)',
        'glow-orange': '0 4px 14px rgba(224, 123, 103, 0.3)',
        'glow-green': '0 4px 14px rgba(126, 200, 190, 0.3)',
        'glow-brown': '0 4px 14px rgba(139, 107, 85, 0.3)',

        // Card & button
        'card': '0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 14px rgba(91, 103, 202, 0.25)',
      },

      /* =======================================================================
         TRANSITIONS
         ======================================================================= */
      transitionDuration: {
        'fast': '100ms',
        'normal': '150ms',
        'moderate': '200ms',
        'slow': '300ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* =======================================================================
         ANIMATIONS
         ======================================================================= */
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },

      /* =======================================================================
         Z-INDEX
         ======================================================================= */
      zIndex: {
        'sidebar': '100',
        'header': '200',
        'overlay': '300',
        'modal': '400',
        'toast': '500',
      },
    },
  },

  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.touch-feedback': {
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        },
        '.text-gradient-brand': {
          background: 'linear-gradient(135deg, #5B67CA, #E07B67)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      });
    },
  ],
};
