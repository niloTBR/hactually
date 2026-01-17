import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, X, Eye, LogOut, RefreshCw, LayoutGrid, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import DomeGallery from '../components/DomeGallery';
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

// Convert PEOPLE to DomeGallery format with data attached
const GALLERY_IMAGES = PEOPLE.map(person => ({
  src: person.avatar,
  alt: person.name,
  data: person // Attach full person data
}));

/**
 * Profile Card with Tilt Effect and Light Reflection
 * Inspired by ReactBits ProfileCard
 */
function ProfileCard({ person, onClose, onSpot, isSpotted }) {
  const cardRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate tilt based on mouse position from center
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -12;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;

    // Calculate mouse position as percentage for light effect
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  if (!person) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Card with tilt effect */}
      <div
        ref={cardRef}
        className="relative w-full max-w-xs animate-scale-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-200 ease-out"
          style={{
            background: 'linear-gradient(145deg, rgba(30,30,35,0.9) 0%, rgba(15,15,18,0.95) 100%)',
            transform: isHovering
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Dynamic light reflection that follows mouse */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-20"
            style={{
              background: `radial-gradient(circle 150px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12) 0%, transparent 100%)`,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Subtle gradient border glow */}
          <div
            className="absolute inset-0 pointer-events-none z-10 rounded-3xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(236,72,153,0.15) 0%, transparent 50%)`,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>

          {/* Profile image with smooth fade into card */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={person.avatar}
              alt={person.name}
              className="h-full w-full object-cover"
            />
            {/* Smooth gradient fade into card background */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(15,15,18,0.4) 50%, rgba(15,15,18,0.85) 75%, rgb(15,15,18) 100%)',
              }}
            />
            {/* Spotted badge on image */}
            {isSpotted && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-medium">
                <Eye className="h-3 w-3" />
                Spotted
              </div>
            )}
          </div>

          {/* Content area - blends with image fade */}
          <div className="px-5 pb-5 -mt-16 relative z-10">
            {/* Name & Age */}
            <h2 className="text-white text-2xl font-bold">
              {person.name}, {person.age}
            </h2>

            {/* Twitter-style bio */}
            <p className="text-white/50 text-sm mt-1 italic">
              "{person.bio}"
            </p>

            {/* Interest pills - tiny & elegant */}
            {person.interests && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {person.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/40 border border-white/10"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            {/* SPOT Button */}
            <div className="mt-5">
              {isSpotted ? (
                <div className="text-center py-3">
                  <div className="flex items-center justify-center gap-2 text-pink-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">You spotted {person.name}</span>
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">
                    They'll be notified of your interest
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="relative h-11 rounded-full p-[1px]"
                    style={{
                      background: 'linear-gradient(90deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(59, 130, 246), rgb(139, 92, 246), rgb(236, 72, 153))',
                      backgroundSize: '200% 100%',
                      animation: 'shimmerBorder 3s linear infinite',
                    }}
                  >
                    <button
                      onClick={() => onSpot(person)}
                      className={cn(
                        "w-full h-full rounded-full",
                        "bg-[#0f0f12] text-white text-sm font-semibold",
                        "flex items-center justify-center gap-2",
                        "active:scale-[0.98] transition-transform",
                        "hover:bg-[#1a1a20]"
                      )}
                    >
                      <Eye className="h-4 w-4" />
                      SPOT
                    </button>
                  </div>
                  <p className="text-center text-white/30 text-[10px] mt-2">
                    Let them know you're interested
                  </p>
                </>
              )}
            </div>
          </div>
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

/**
 * Checked In Screen - Original DomeGallery version
 */
export default function CheckedInScreen() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [spotted, setSpotted] = React.useState([]);

  // Mock venue data (in real app, fetch based on venueId)
  const venue = {
    id: venueId || 1,
    name: 'WHITE Dubai',
    area: 'Meydan',
  };

  const handleSpot = (person) => {
    if (!spotted.includes(person.id)) {
      setSpotted([...spotted, person.id]);
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

      {/* Dome Gallery - ReactBits component */}
      <div className="absolute -inset-10 scale-125">
        <DomeGallery
          images={GALLERY_IMAGES}
          grayscale={false}
          fit={1.2}
          minRadius={300}
          segments={25}
          overlayBlurColor="#0a0a0f"
          imageBorderRadius="50%"
          autoRotate={true}
          autoRotateSpeed={0.15}
          dynamicPresence={true}
          presenceDuration={[8, 15]}
          spottedIds={spotted}
          onImageClick={(item) => {
            // Find the person data from the clicked image
            const person = PEOPLE.find(p => p.avatar === item.src);
            if (person) setSelectedPerson(person);
          }}
        />
      </div>

      {/* Hint text */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
          <p className="text-white/50 text-xs">
            Tap on someone to see their profile
          </p>
          <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <RefreshCw className="h-3 w-3 text-white/50" />
          </button>
        </div>
      </div>

      {/* Profile Card Modal */}
      <ProfileCard
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSpot={handleSpot}
        isSpotted={selectedPerson ? spotted.includes(selectedPerson.id) : false}
      />

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
