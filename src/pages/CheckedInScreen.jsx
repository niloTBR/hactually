import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, X, Eye, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

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
  { id: 1, name: 'Sophia', age: 24, avatar: PROFILE_IMAGES[0], bio: 'Love exploring new places' },
  { id: 2, name: 'Emma', age: 26, avatar: PROFILE_IMAGES[1], bio: 'Coffee enthusiast' },
  { id: 3, name: 'Marcus', age: 28, avatar: PROFILE_IMAGES[2], bio: 'Music & vibes' },
  { id: 4, name: 'Isabella', age: 23, avatar: PROFILE_IMAGES[3], bio: 'Adventure seeker' },
  { id: 5, name: 'Luna', age: 25, avatar: PROFILE_IMAGES[4], bio: 'Sunset lover' },
  { id: 6, name: 'Jake', age: 27, avatar: PROFILE_IMAGES[5], bio: 'Living the dream' },
  { id: 7, name: 'Mia', age: 24, avatar: PROFILE_IMAGES[6], bio: 'Foodie at heart' },
  { id: 8, name: 'Alex', age: 29, avatar: PROFILE_IMAGES[7], bio: 'Night owl' },
];

/**
 * Dome Gallery - Auto-scrolling 3D dome of profile images
 * Based on ReactBits DomeGallery concept
 */
function DomeGallery({ images, onImageClick }) {
  const containerRef = React.useRef(null);
  const [rotation, setRotation] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, rotation: 0 });

  // Auto-rotate
  React.useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isDragging]);

  // Mouse/touch drag
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, rotation };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = (e.clientX - dragStart.current.x) * 0.5;
    setRotation((dragStart.current.rotation + delta) % 360);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Calculate positions on a dome/sphere
  const getPosition = (index, total) => {
    const theta = ((index / total) * 360 + rotation) * (Math.PI / 180);
    const phi = Math.PI / 2.5; // Dome angle
    const radius = 280;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta) - 100;
    const y = radius * Math.cos(phi) - 150;

    // Scale based on z position (closer = bigger)
    const scale = Math.max(0.4, Math.min(1.2, (z + 300) / 400));
    const opacity = Math.max(0.3, Math.min(1, (z + 300) / 350));
    const zIndex = Math.round(z + 300);

    return { x, y, z, scale, opacity, zIndex };
  };

  // Triple the images for seamless rotation
  const displayImages = [...images, ...images, ...images];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Center point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        {displayImages.map((person, index) => {
          const pos = getPosition(index, displayImages.length);
          return (
            <button
              key={`${person.id}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(PEOPLE.find(p => p.avatar === person.avatar) || person);
              }}
              className="absolute transition-all duration-100 ease-out"
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) scale(${pos.scale})`,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
              }}
            >
              <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl shadow-black/50 hover:border-pink-500/50 transition-colors">
                <img
                  src={person.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Radial gradient overlay for dome effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(10,10,15,0.8) 70%, rgba(10,10,15,1) 100%)',
        }}
      />
    </div>
  );
}

/**
 * Profile Card with Tilt Effect on hover
 */
function ProfileCard({ person, onClose, onSpot }) {
  const cardRef = React.useRef(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate tilt based on mouse position from center
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -15;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
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
          perspective: '1000px',
        }}
      >
        <div
          className="relative bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-200 ease-out"
          style={{
            transform: isHovering
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Shine effect on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>

          {/* Profile image */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={person.avatar}
              alt={person.name}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9) 100%)',
              }}
            />

            {/* Name overlay */}
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-white text-2xl font-bold">
                {person.name}, {person.age}
              </h2>
              <p className="text-white/60 text-sm mt-1">{person.bio}</p>
            </div>
          </div>

          {/* SPOT Button */}
          <div className="p-5">
            <div
              className="relative h-12 rounded-full p-[1px]"
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
            <p className="text-center text-white/40 text-xs mt-3">
              Let them know you're interested
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Checked In Screen
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
    setSpotted([...spotted, person.id]);
    setSelectedPerson(null);
    // Could trigger animation or notification here
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
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
          <button
            onClick={() => navigate(-1)}
            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <MapPin className="h-4 w-4 text-pink-400" />
          <span className="flex-1 text-white text-sm font-medium">
            {venue.name}
          </span>
          <span className="text-white/40 text-xs">Checked in</span>
        </div>
      </div>

      {/* Dome Gallery */}
      <div className="absolute inset-0 pt-28">
        <DomeGallery
          images={PEOPLE}
          onImageClick={(person) => setSelectedPerson(person)}
        />
      </div>

      {/* Hint text */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
          <p className="text-white/50 text-xs">
            Tap on someone to see their profile
          </p>
        </div>
      </div>

      {/* Profile Card Modal */}
      <ProfileCard
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSpot={handleSpot}
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
