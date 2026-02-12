import * as React from 'react';

/**
 * Logo Animation Screen
 * Showcases the Hactually logo with animation
 */

export default function LogoScreen() {
  const [isAnimating, setIsAnimating] = React.useState(true);

  return (
    <div className="min-h-screen bg-[#083D9C] flex flex-col items-center justify-center overflow-hidden">
      {/* Animation keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes splitLeft {
          0%, 20% { transform: translateX(0) rotate(0deg); opacity: 1; }
          50% { transform: translateX(-40px) rotate(-5deg); opacity: 0.8; }
          80%, 100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }

        @keyframes splitRight {
          0%, 20% { transform: translateX(0) rotate(0deg); opacity: 1; }
          50% { transform: translateX(40px) rotate(5deg); opacity: 0.8; }
          80%, 100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(224, 89, 61, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(224, 89, 61, 0.6)); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-container {
          animation: breathe 4s ease-in-out infinite, pulseGlow 3s ease-in-out infinite;
        }

        .logo-left {
          transform-origin: right center;
          animation: splitLeft 4s ease-in-out infinite;
        }

        .logo-right {
          transform-origin: left center;
          animation: splitRight 4s ease-in-out infinite;
        }

        .logo-text {
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        .logo-static .logo-left,
        .logo-static .logo-right {
          animation: none;
        }

        .logo-static {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Logo Container */}
      <div
        className={`relative ${isAnimating ? 'logo-container' : 'logo-static'}`}
        onClick={() => setIsAnimating(!isAnimating)}
        style={{ cursor: 'pointer' }}
      >
        <svg
          width="200"
          height="200"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradLeft" x1="96" y1="64" x2="96" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0593D"/>
              <stop offset="1" stopColor="#D9081E"/>
            </linearGradient>
            <linearGradient id="gradRight" x1="96" y1="64" x2="96" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0593D"/>
              <stop offset="1" stopColor="#D9081E"/>
            </linearGradient>
          </defs>

          {/* Left piece */}
          <path
            className="logo-left"
            d="M64 64C64 99.3462 35.3462 128 0 128V0H64V64Z"
            fill="url(#gradLeft)"
          />

          {/* Right piece */}
          <path
            className="logo-right"
            d="M128 128H64V64C64 28.6538 92.6538 0 128 0V128Z"
            fill="url(#gradRight)"
          />
        </svg>
      </div>

      {/* Brand name */}
      <h1 className="logo-text text-white text-4xl font-black mt-8 tracking-tight">
        hactually
      </h1>

      {/* Tagline */}
      <p className="logo-text text-white/50 text-sm mt-2" style={{ animationDelay: '0.7s' }}>
        continue the moment
      </p>

      {/* Tap hint */}
      <p className="text-white/30 text-xs mt-12 logo-text" style={{ animationDelay: '1s' }}>
        tap logo to {isAnimating ? 'pause' : 'play'}
      </p>
    </div>
  );
}
