import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, X, Eye, LogOut, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import InfiniteMenu from '../components/InfiniteMenu';

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

// Mock people data with Twitter-style bios and interests
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

// Convert PEOPLE to InfiniteMenu format
const MENU_ITEMS = PEOPLE.map(person => ({
  image: person.avatar,
  title: person.name,
  description: person.bio,
  data: person
}));

/**
 * Checked In Screen V2 - InfiniteMenu WebGL version
 * Shows profile info below the active item
 */
export default function CheckedInScreenV2() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isMoving, setIsMoving] = React.useState(false);
  const [spotted, setSpotted] = React.useState([]);

  // Mock venue data
  const venue = {
    id: venueId || 1,
    name: 'WHITE Dubai',
    area: 'Meydan',
  };

  const activePerson = PEOPLE[activeIndex % PEOPLE.length];
  const isActiveSpotted = spotted.includes(activePerson?.id);

  const handleSpot = () => {
    if (activePerson && !spotted.includes(activePerson.id)) {
      setSpotted([...spotted, activePerson.id]);
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-[#0a0a0f]">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Header - Location bar with venue name */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-12 px-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/10 backdrop-blur-xl">
          <MapPin className="h-4 w-4 text-pink-400" />
          <span className="flex-1 text-white text-sm font-medium">
            {venue.name}
          </span>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/20 transition-colors group"
          >
            <span className="text-white/40 text-xs group-hover:text-red-400 transition-colors">Leave venue</span>
            <LogOut className="h-3.5 w-3.5 text-white/40 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Infinite Menu - WebGL 3D Sphere - Upper portion */}
      <div className="absolute inset-x-0 top-0 h-[55%]">
        <InfiniteMenu
          items={MENU_ITEMS}
          scale={1.0}
          onActiveChange={(index) => setActiveIndex(index)}
          onMovementChange={setIsMoving}
        />
      </div>

      {/* Active Profile Info - Below the sphere */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-[45%] flex flex-col items-center justify-start pt-4 px-6",
          "transition-all duration-300",
          isMoving ? "opacity-30 translate-y-4" : "opacity-100 translate-y-0"
        )}
      >
        {activePerson && (
          <>
            {/* Name & Age */}
            <h2 className="text-white text-2xl font-bold text-center">
              {activePerson.name}, {activePerson.age}
            </h2>

            {/* Bio */}
            <p className="text-white/50 text-sm mt-2 text-center italic max-w-[280px]">
              "{activePerson.bio}"
            </p>

            {/* Interest pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {activePerson.interests?.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/10"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* SPOT Button */}
            <div className="mt-6 w-full max-w-xs">
              {isActiveSpotted ? (
                <div className="text-center py-3">
                  <div className="flex items-center justify-center gap-2 text-pink-400">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">You spotted {activePerson.name}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-2">
                    They'll be notified of your interest
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="relative h-12 rounded-full p-[2px]"
                    style={{
                      background: 'linear-gradient(90deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(59, 130, 246), rgb(139, 92, 246), rgb(236, 72, 153))',
                      backgroundSize: '200% 100%',
                      animation: 'shimmerBorder 3s linear infinite',
                    }}
                  >
                    <button
                      onClick={handleSpot}
                      className={cn(
                        "w-full h-full rounded-full",
                        "bg-[#0f0f12] text-white text-sm font-semibold",
                        "flex items-center justify-center gap-2",
                        "active:scale-[0.98] transition-transform",
                        "hover:bg-[#1a1a20]"
                      )}
                    >
                      <Eye className="h-4 w-4" />
                      SPOT {activePerson.name}
                    </button>
                  </div>
                  <p className="text-center text-white/30 text-xs mt-2">
                    Let them know you're interested
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Hint text with refresh */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
          <p className="text-white/50 text-xs">
            Swipe to browse
          </p>
          <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <RefreshCw className="h-3 w-3 text-white/50" />
          </button>
        </div>
      </div>

      {/* CSS for shimmer border animation */}
      <style>{`
        @keyframes shimmerBorder {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
