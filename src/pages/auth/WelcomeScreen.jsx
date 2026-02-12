import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * Onboarding Welcome Screen
 * Deep blue theme with horizontally scrolling profiles
 */

// Profile images
const PROFILE_IMAGES = [
  '/images/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg',
  '/images/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg',
  '/images/daniel-monteiro-uGVqeh27EHE-unsplash.jpg',
  '/images/brooke-cagle-KriecpTIWgY-unsplash.jpg',
  '/images/natalia-blauth-gw2udfGe_tM-unsplash.jpg',
  '/images/jakob-owens-lkMJcGDZLVs-unsplash.jpg',
  '/images/rayul-_M6gy9oHgII-unsplash.jpg',
  '/images/arrul-lin-sYhUhse5uT8-unsplash.jpg',
];

const SLIDES = [
  {
    text: "You've shared a look with someone before.",
  },
  {
    text: "Not because the moment wasn't real. But because acting on it wasn't easy.",
  },
  {
    text: "hactually helps you continue the moment.",
    isFinal: true,
  },
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);
  const totalSlides = SLIDES.length;

  const next = () => {
    if (slide < totalSlides - 1) {
      setSlide(slide + 1);
    }
  };

  const finish = () => {
    localStorage.setItem('hactually-onboarding-seen', 'true');
    navigate('/auth/options');
  };

  const currentSlide = SLIDES[slide];

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-[#083D9C]">
      {/* Marquee and shimmer animation keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #E05A3D 0%, #E05A3D 40%, #D9081E 50%, #E05A3D 60%, #E05A3D 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      {/* Logo at top - same height as bottom section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-8 pb-6 animate-fade-in" style={{ minHeight: '120px' }}>
        <img
          src="/images/logo.svg"
          alt="Hactually"
          className="h-12 w-auto"
        />
      </div>

      {/* Top Profile Rows - below logo, fade downward */}
      <div
        className="relative z-0 flex flex-col gap-3 mt-6"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Row 1 - scrolls left */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marqueeLeft 40s linear infinite', width: 'max-content' }}
          >
            {[...PROFILE_IMAGES, ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r1-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/25">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - scrolls right */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marqueeRight 50s linear infinite', width: 'max-content' }}
          >
            {[...PROFILE_IMAGES.slice(4), ...PROFILE_IMAGES.slice(0, 4), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r2-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/25">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Text Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <p
          key={slide}
          className="text-white text-lg font-bold text-center leading-relaxed animate-fade-in-up"
        >
          {currentSlide.isFinal ? (
            <>
              <span className="shimmer-text">hactually</span>
              {' '}helps you continue the moment.
            </>
          ) : (
            currentSlide.text
          )}
        </p>
      </div>

      {/* Bottom Profile Rows - above pagination, fade upward */}
      <div
        className="relative z-0 flex flex-col gap-3 mb-6"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Row 3 - scrolls left */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marqueeLeft 55s linear infinite', width: 'max-content' }}
          >
            {[...PROFILE_IMAGES.slice(2), ...PROFILE_IMAGES.slice(0, 2), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r3-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/25">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 4 - scrolls right */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marqueeRight 35s linear infinite', width: 'max-content' }}
          >
            {[...PROFILE_IMAGES.slice(6), ...PROFILE_IMAGES.slice(0, 6), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r4-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/25">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section - pagination and button - same height as logo section */}
      <div className="relative z-10 px-6 pb-8 pt-4 animate-fade-in-up stagger-2" style={{ minHeight: '120px' }}>
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                slide === i
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/30"
              )}
            />
          ))}
        </div>

        {/* Button with shimmer border */}
        <div className="w-full relative h-12 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full p-[1.5px] animate-gradient-shift"
            style={{
              background: 'linear-gradient(90deg, #D9081E, #E0593D, #FF7F5C, #D9081E)',
              backgroundSize: '200% 100%',
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: '#083D9C' }}
            />
          </div>

          <button
            onClick={currentSlide.isFinal ? finish : next}
            className="absolute inset-0 z-10 flex items-center justify-center select-none active:opacity-80 transition-opacity"
          >
            <span className="text-xs text-white font-bold uppercase tracking-widest">
              {currentSlide.isFinal ? 'Get Started' : 'Next'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
