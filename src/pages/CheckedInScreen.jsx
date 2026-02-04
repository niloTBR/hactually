import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import DomeGallery from '../components/DomeGallery';

// Animated Logo for splash transition
const HactuallyLogoAnimated = ({ color = 'white', size = 80 }) => (
  <svg viewBox="0 0 250 100" width={size} height={size * (100/250)} fill={color}>
    <style>{`
      @keyframes moveLeftAndMask {
        0% { transform: translateX(0); clip-path: inset(0 0 0 0); }
        100% { transform: translateX(-75px); clip-path: inset(0 75% 0 0); }
      }
      @keyframes moveRightAndMask {
        0% { transform: translateX(0); clip-path: inset(0 0 0 0); }
        100% { transform: translateX(75px); clip-path: inset(0 0 0 75%); }
      }
      .splash-semi-l { animation: moveLeftAndMask 1s linear infinite; }
      .splash-semi-r { animation: moveRightAndMask 1s linear infinite; }
      .splash-semi-l-2 { animation: moveLeftAndMask 1s linear infinite 0.33s; }
      .splash-semi-r-2 { animation: moveRightAndMask 1s linear infinite 0.33s; }
      .splash-semi-l-3 { animation: moveLeftAndMask 1s linear infinite 0.66s; }
      .splash-semi-r-3 { animation: moveRightAndMask 1s linear infinite 0.66s; }
    `}</style>
    <circle cx="125" cy="50" r="50" />
    <path className="splash-semi-l" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
    <path className="splash-semi-r" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
    <path className="splash-semi-l-2" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
    <path className="splash-semi-r-2" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
    <path className="splash-semi-l-3" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
    <path className="splash-semi-r-3" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
  </svg>
);

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

// Mock people data
const PEOPLE = [
  { id: 1, name: 'Sophia', age: 24, avatar: PROFILE_IMAGES[0], bio: 'chasing sunsets & good conversations', interests: ['Travel', 'Wine', 'Art'] },
  { id: 2, name: 'Emma', age: 26, avatar: PROFILE_IMAGES[1], bio: 'probably at a coffee shop right now', interests: ['Coffee', 'Books', 'Yoga'] },
  { id: 3, name: 'Marcus', age: 28, avatar: PROFILE_IMAGES[2], bio: 'music producer by day, dj by night', interests: ['Music', 'Vinyl', 'Tech'] },
  { id: 4, name: 'Isabella', age: 23, avatar: PROFILE_IMAGES[3], bio: 'life is short, eat the dessert first', interests: ['Food', 'Dance', 'Fashion'] },
  { id: 5, name: 'Luna', age: 25, avatar: PROFILE_IMAGES[4], bio: 'somewhere between chaos and calm', interests: ['Meditation', 'Surf', 'Photography'] },
  { id: 6, name: 'Jake', age: 27, avatar: PROFILE_IMAGES[5], bio: 'building things & breaking boundaries', interests: ['Startups', 'Fitness', 'Cars'] },
  { id: 7, name: 'Mia', age: 24, avatar: PROFILE_IMAGES[6], bio: 'finding magic in the mundane', interests: ['Film', 'Cooking', 'Plants'] },
  { id: 8, name: 'Alex', age: 29, avatar: PROFILE_IMAGES[7], bio: 'professional overthinker, amateur chef', interests: ['Gaming', 'Crypto', 'Sneakers'] },
];

// Convert PEOPLE to DomeGallery format
const GALLERY_IMAGES = PEOPLE.map(person => ({
  src: person.avatar,
  alt: person.name,
  data: person
}));

/**
 * Checked In Screen - Dome Gallery of people at venue
 * Hactually 2.0 Branding - Light theme
 */
export default function CheckedInScreen() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [showSplash, setShowSplash] = React.useState(true);
  const [splashFading, setSplashFading] = React.useState(false);

  // Mock venue data (in real app, fetch based on venueId)
  const venue = {
    id: venueId || 1,
    name: 'WHITE Dubai',
    area: 'Meydan',
  };

  // Splash transition on mount
  React.useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="h-full relative overflow-hidden bg-brown-lighter">
      {/* Subtle background accents */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(88,101,242,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(224,90,61,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Header - Location bar with venue name */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-12 px-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-brown-light/30 shadow-card">
          <MapPin className="h-4 w-4 text-blue" />
          <span className="flex-1 text-black text-sm font-bold">
            {venue.name}
          </span>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brown-lighter hover:bg-orange-light transition-colors group"
          >
            <span className="text-brown text-xs group-hover:text-orange-dark transition-colors">Leave</span>
            <LogOut className="h-3.5 w-3.5 text-brown group-hover:text-orange-dark transition-colors" />
          </button>
        </div>
      </div>

      {/* Dome Gallery */}
      <div className="absolute -inset-10 scale-125">
        <DomeGallery
          images={GALLERY_IMAGES}
          grayscale={false}
          fit={1.2}
          minRadius={300}
          segments={25}
          overlayBlurColor="#F5F1E8"
          imageBorderRadius="50%"
          autoRotate={true}
          autoRotateSpeed={0.15}
          dynamicPresence={true}
          presenceDuration={[8, 15]}
          spottedIds={[]}
        />
      </div>

      {/* Splash takeover transition */}
      {showSplash && (
        <div
          className={cn(
            "absolute inset-0 z-50 flex items-center justify-center bg-blue transition-all duration-700 ease-out",
            splashFading ? "opacity-0 scale-110" : "opacity-100 scale-100"
          )}
        >
          <HactuallyLogoAnimated color="#C94A2F" size={280} />
        </div>
      )}
    </div>
  );
}
