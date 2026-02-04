import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Heart,
  MessageCircle,
  User,
  Navigation,
  Clock,
} from 'lucide-react';
// Note: Using local images from /public/images/
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import StarBorder from '../components/StarBorder';

// Mapbox access token - replace with your own or set via env variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibmlsMGtoIiwiYSI6ImNta3M2ZjZkZTE1MWUzY3M5ZG8xZHI2MWsifQ.ryMm8IK9xAd5MEE6npZM_A';

/**
 * Home Screen - Map Discovery View (2A)
 * Light map with venue markers and Apple Wallet-style venue stack
 * Hactually 2.0 Branding
 */

// Local profile images
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

// Venue images - actual venue photos
const VENUE_IMAGES = [
  '/venues/1.jpg',
  '/venues/2.jpg',
  '/venues/3.webp',
  '/venues/4.jpg',
  '/venues/5.jpeg',
  '/venues/6.jpg',
];

// Mock venue data with people checked in - using real Dubai coordinates
const VENUES = [
  {
    id: 1,
    name: 'WHITE Dubai',
    area: 'Meydan',
    type: 'Nightclub',
    peopleCount: 47,
    distance: '130m',
    image: VENUE_IMAGES[0],
    coordinates: { lng: 55.2885, lat: 25.1688 }, // Meydan area
    people: [
      { id: 1, avatar: PROFILE_IMAGES[0] },
      { id: 2, avatar: PROFILE_IMAGES[1] },
    ],
  },
  {
    id: 2,
    name: 'Nammos',
    area: 'Four Seasons',
    type: 'Beach Club',
    peopleCount: 23,
    distance: '250m',
    image: VENUE_IMAGES[1],
    coordinates: { lng: 55.1924, lat: 25.2027 }, // Jumeirah Beach
    people: [
      { id: 3, avatar: PROFILE_IMAGES[2] },
      { id: 4, avatar: PROFILE_IMAGES[3] },
    ],
  },
  {
    id: 3,
    name: 'Coya',
    area: 'DIFC',
    type: 'Restaurant & Bar',
    peopleCount: 31,
    distance: '10m',
    image: VENUE_IMAGES[2],
    coordinates: { lng: 55.2795, lat: 25.2116 }, // DIFC
    people: [
      { id: 5, avatar: PROFILE_IMAGES[4] },
      { id: 6, avatar: PROFILE_IMAGES[5] },
    ],
  },
  {
    id: 4,
    name: 'Soho Garden',
    area: 'Meydan',
    type: 'Club & Lounge',
    peopleCount: 52,
    distance: '450m',
    image: VENUE_IMAGES[3],
    coordinates: { lng: 55.3045, lat: 25.1720 }, // Meydan
    people: [
      { id: 7, avatar: PROFILE_IMAGES[6] },
      { id: 8, avatar: PROFILE_IMAGES[7] },
    ],
  },
  {
    id: 5,
    name: 'LIV',
    area: 'Marina',
    type: 'Nightclub',
    peopleCount: 18,
    distance: '1.2km',
    image: VENUE_IMAGES[4],
    coordinates: { lng: 55.1344, lat: 25.0802 }, // Dubai Marina
    people: [
      { id: 9, avatar: PROFILE_IMAGES[4] },
      { id: 10, avatar: PROFILE_IMAGES[5] },
    ],
  },
];

// Mock location suggestions for search
const LOCATION_SUGGESTIONS = VENUES.map(v => ({
  id: v.id,
  name: v.name,
  area: `${v.area}, Dubai`,
}));

/**
 * iOS-style Location Permission Modal - Light theme
 */
function LocationPermissionModal({ onAllow, onDeny }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-8">
      <div className="bg-white rounded-2xl w-full max-w-[280px] overflow-hidden shadow-2xl">
        {/* Icon */}
        <div className="pt-6 pb-4 flex justify-center">
          <div className="h-14 w-14 rounded-full bg-blue flex items-center justify-center shadow-glow-blue">
            <MapPin className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="px-4 pb-5 text-center">
          <h3 className="text-black text-[17px] font-bold mb-2">
            Allow "Hactually" to access your location?
          </h3>
          <p className="text-brown text-[13px] leading-relaxed">
            Your location is used to discover nearby venues and show you who's around.
          </p>
        </div>

        {/* Buttons - iOS style stacked */}
        <div className="border-t border-brown-light/40">
          <button
            onClick={onAllow}
            className="w-full py-3 text-[17px] text-blue font-bold border-b border-brown-light/40 active:bg-brown-lighter"
          >
            Allow While Using App
          </button>
          <button
            onClick={onAllow}
            className="w-full py-3 text-[17px] text-blue border-b border-brown-light/40 active:bg-brown-lighter"
          >
            Allow Once
          </button>
          <button
            onClick={onDeny}
            className="w-full py-3 text-[17px] text-brown active:bg-brown-lighter"
          >
            Don't Allow
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Location Search Dropdown - Light theme
 */
function LocationSearchDropdown({ isOpen, onClose, onSelect, searchQuery, setSearchQuery }) {
  const filteredSuggestions = LOCATION_SUGGESTIONS.filter(
    loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-40">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandDown {
          from { max-height: 56px; opacity: 0.8; }
          to { max-height: 400px; opacity: 1; }
        }
      `}</style>
      <div
        className="bg-brown-lighter/90 backdrop-blur-2xl border border-brown-light/30 rounded-2xl overflow-hidden shadow-xl"
        style={{ animation: 'expandDown 0.35s cubic-bezier(0.25, 1, 0.5, 1) both' }}
      >
        {/* Search Input */}
        <div
          className="p-3 border-b border-brown-light/30"
          style={{ animation: 'slideInRight 0.3s cubic-bezier(0.25, 1, 0.5, 1) both' }}
        >
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-brown" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="flex-1 bg-transparent text-black text-sm placeholder:text-brown/40 outline-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4 text-brown" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions — staggered slide-in from left */}
        <div className="max-h-64 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((location, idx) => (
              <button
                key={location.id}
                onClick={() => onSelect(location)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-brown-mid active:bg-brown-light transition-colors text-left"
                style={{
                  animation: `slideInRight 0.35s cubic-bezier(0.25, 1, 0.5, 1) ${0.05 + idx * 0.06}s both`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-black text-sm font-bold truncate">{location.name}</p>
                  <p className="text-brown text-xs truncate">{location.area}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-brown text-sm">No locations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * User's marker - clean avatar without orb
 */
function UserMarker() {
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 250 100" width={120} height={48} fill="#5865F2">
        <style>{`
          @keyframes markerL { 0% { transform: translateX(0); clip-path: inset(0 0 0 0); } 100% { transform: translateX(-75px); clip-path: inset(0 75% 0 0); } }
          @keyframes markerR { 0% { transform: translateX(0); clip-path: inset(0 0 0 0); } 100% { transform: translateX(75px); clip-path: inset(0 0 0 75%); } }
          .mL1 { animation: markerL 1s linear infinite; }
          .mR1 { animation: markerR 1s linear infinite; }
          .mL2 { animation: markerL 1s linear infinite 0.33s; }
          .mR2 { animation: markerR 1s linear infinite 0.33s; }
          .mL3 { animation: markerL 1s linear infinite 0.66s; }
          .mR3 { animation: markerR 1s linear infinite 0.66s; }
        `}</style>
        <circle cx="125" cy="50" r="50" />
        <path className="mL1" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
        <path className="mR1" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
        <path className="mL2" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
        <path className="mR2" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
        <path className="mL3" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" />
        <path className="mR3" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" />
      </svg>
    </div>
  );
}

/**
 * Interactive Mapbox Map with light style
 */
// User's position (DIFC Dubai)
const USER_COORDS = { longitude: 55.2708, latitude: 25.2048 };

function InteractiveMap({ venues, onVenueClick, selectedVenue, centerTrigger }) {
  const [viewState, setViewState] = React.useState({
    longitude: USER_COORDS.longitude,
    latitude: USER_COORDS.latitude - 0.008,
    zoom: 12.8,
    pitch: 0,
    bearing: 0,
  });

  // Fly to user when centerTrigger changes — offset south so marker appears above cards
  React.useEffect(() => {
    if (centerTrigger > 0) {
      setViewState(v => ({ ...v, longitude: USER_COORDS.longitude, latitude: USER_COORDS.latitude - 0.008, zoom: 12.8 }));
    }
  }, [centerTrigger]);

  return (
    <div className="absolute inset-0">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        minZoom={10}
        maxZoom={18}
      >
        {/* User marker — on the map, centered on user's location */}
        <Marker
          longitude={USER_COORDS.longitude}
          latitude={USER_COORDS.latitude}
          anchor="center"
        >
          <UserMarker />
        </Marker>

        {/* Venue Markers */}
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            longitude={venue.coordinates.lng}
            latitude={venue.coordinates.lat}
            anchor="center"
          >
            <VenueMapMarker
              venue={venue}
              isSelected={selectedVenue?.id === venue.id}
              onClick={() => onVenueClick(venue)}
            />
          </Marker>
        ))}
      </Map>

      {/* Gradient overlay for UI contrast — no full tint so markers stay clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(245,241,232,0.6) 0%, transparent 25%),
            linear-gradient(to top, rgba(245,241,232,0.8) 0%, transparent 35%)
          `,
        }}
      />
    </div>
  );
}

/**
 * Venue marker for the Mapbox map
 */
function VenueMapMarker({ venue, isSelected, onClick }) {
  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative transition-transform duration-300",
        isSelected && "scale-110 z-20"
      )}
    >
      {/* Avatar stack */}
      <div className="relative flex items-center">
        {venue.people.slice(0, 2).map((person, idx) => (
          <div
            key={person.id}
            className={cn(
              "h-9 w-9 rounded-full border-2 border-white overflow-hidden",
              "shadow-md",
              idx > 0 && "-ml-5"
            )}
          >
            <img
              src={person.avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {extraPeople > 0 && <AnimatedBadge count={extraPeople} size="md" />}
      </div>

      {/* Venue name label */}
      <div className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 mt-1.5",
        "px-2 py-0.5 rounded-full",
        "bg-white/90 backdrop-blur-sm shadow-card",
        "text-[10px] font-bold text-black whitespace-nowrap"
      )}>
        {venue.name}
      </div>
    </button>
  );
}

/**
 * Animated Border Badge for +N count - spinning conic gradient
 */
function AnimatedBadge({ count, size = 'md' }) {
  const sizes = {
    sm: { outer: 'h-8 w-8', margin: '-ml-5', text: 'text-[10px]', inset: 'inset-[1px]' },
    md: { outer: 'h-9 w-9', margin: '-ml-5', text: 'text-[11px]', inset: 'inset-[1px]' },
    lg: { outer: 'h-10 w-10', margin: '-ml-5', text: 'text-xs', inset: 'inset-[1px]' },
  };
  const s = sizes[size];

  return (
    <div className={cn("relative", s.outer, s.margin)}>
      {/* Spinning gradient border */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: 'conic-gradient(from 0deg, #5865F2, #E05A3D, #4A7C7C, #5865F2)',
          animationDuration: '3s',
        }}
      />
      {/* Inner circle */}
      <div className={cn("absolute rounded-full bg-brown-lighter flex items-center justify-center", s.inset)}>
        <span className={cn("font-black text-black", s.text)}>+{count > 99 ? '99' : count}</span>
      </div>
    </div>
  );
}


/**
 * Auto-rotating Card Stack - 3D effect with stacked cards visible at top
 * Smooth expand/collapse transition for fluid user experience
 */
function VenueStack({ venues, onSelectVenue }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [dismissing, setDismissing] = React.useState(false);
  const [dragY, setDragY] = React.useState(0);
  const touchRef = React.useRef(null);

  // Reorder venues so active is on top
  const orderedVenues = [
    ...venues.slice(activeIndex),
    ...venues.slice(0, activeIndex),
  ];

  // Cycle to next card: front card slides down, goes to back of stack
  const cycleNext = React.useCallback(() => {
    if (dismissing) return;
    setDismissing(true);
    setDragY(0); // zero immediately so CSS transitions activate
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % venues.length);
      setDismissing(false);
    }, 400);
  }, [dismissing, venues.length]);

  // Swipe-down gesture on front card
  const handleTouchStart = (e) => {
    touchRef.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (touchRef.current === null) return;
    const dy = e.touches[0].clientY - touchRef.current;
    if (dy > 0) setDragY(dy);
  };
  const handleTouchEnd = () => {
    if (dragY > 50) {
      cycleNext();
    } else {
      setDragY(0);
    }
    touchRef.current = null;
  };

  // Mouse drag on front card (desktop support)
  // Listeners attached once on mousedown, removed on mouseup — no effect churn
  const dragYRef = React.useRef(0);
  const cycleNextRef = React.useRef(cycleNext);
  cycleNextRef.current = cycleNext;

  const handleMouseDown = React.useCallback((e) => {
    const startY = e.clientY;
    e.preventDefault();

    const onMove = (ev) => {
      const dy = ev.clientY - startY;
      if (dy > 0) {
        dragYRef.current = dy;
        setDragY(dy);
      }
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (dragYRef.current > 50) {
        cycleNextRef.current();
      } else {
        setDragY(0);
      }
      dragYRef.current = 0;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-20",
        isExpanded
          ? "inset-0 bg-brown-lighter/95 backdrop-blur-xl"
          : "bottom-0 pb-24"
      )}
    >
      {/* Light gradient background when collapsed */}
      {!isExpanded && (
        <div
          className="absolute inset-0 -top-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,241,232,0.5) 20%, rgba(245,241,232,0.9) 50%, rgba(245,241,232,1) 100%)',
          }}
        />
      )}

      {/* Header with expand/collapse button */}
      <div className={cn(
        "relative px-4",
        isExpanded ? "pt-14" : ""
      )}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-2 py-2 mb-2"
        >
          <span className="text-black text-sm font-bold">
            Where people are tonight
          </span>
          <div className="flex items-center gap-1 text-brown">
            <span className="text-[10px]">{isExpanded ? 'Close' : 'View all'}</span>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              !isExpanded && "rotate-180"
            )} />
          </div>
        </button>
      </div>

      {/* Animated container that grows/shrinks */}
      <div
        className={cn(
          "relative overflow-hidden px-4",
          isExpanded ? "pb-24 overflow-y-auto" : ""
        )}
        style={{
          maxHeight: isExpanded ? 'calc(100vh - 140px)' : '165px',
          transition: 'max-height 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Content: either stacked view or full list */}
        {!isExpanded ? (
          // Collapsed: Stacked cards — swipe down front card or tap second card to cycle
          <div className="relative h-[165px]">
            {orderedVenues.slice(0, 4).map((venue, index) => {
              const isTop = index === 0;
              const isSecond = index === 1;
              // During dismiss: back cards step forward simultaneously
              const depth = dismissing && !isTop ? index - 1 : index;
              // Width: 100% → 90% → 80% → 70%
              const widthPct = [100, 90, 80, 70][depth];
              const sidePct = (100 - widthPct) / 2;
              const yOffset = isTop
                ? (dismissing ? '0px' : `${dragY}px`)
                : `${-depth * 16}px`;
              // Front card: scale up + fade, drops BEHIND back cards
              const scale = isTop && dismissing ? 1.05 : 1;
              const zIdx = isTop && dismissing ? 0 : 10 - index;
              const isHidden = index === 3 && !dismissing;
              return (
                <div
                  key={venue.id}
                  onClick={() => {
                    if (isTop && !dismissing && dragY === 0) onSelectVenue(venue);
                    if (isSecond && !dismissing) cycleNext();
                  }}
                  onTouchStart={isTop ? handleTouchStart : undefined}
                  onTouchMove={isTop ? handleTouchMove : undefined}
                  onTouchEnd={isTop ? handleTouchEnd : undefined}
                  onMouseDown={isTop ? handleMouseDown : undefined}
                  className={cn(
                    "absolute bottom-0",
                    (isTop || isSecond) && "cursor-pointer",
                  )}
                  style={{
                    transform: `translateY(${yOffset}) scale(${scale})`,
                    left: `${sidePct}%`,
                    right: `${sidePct}%`,
                    zIndex: zIdx,
                    opacity: (isTop && dismissing) || isHidden ? 0 : 1,
                    willChange: 'transform, opacity',
                    transition: dragY === 0
                      ? `transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${isTop ? '0s' : `${index * 0.06}s`}, opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${isTop ? '0s' : `${index * 0.06}s`}, left 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${isTop ? '0s' : `${index * 0.06}s`}, right 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${isTop ? '0s' : `${index * 0.06}s`}`
                      : 'none',
                  }}
                >
                  <VenueCard venue={venue} depth={Math.min(depth, 2)} />
                </div>
              );
            })}
          </div>
        ) : (
          // Expanded: Scrollable list with stagger animation
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {venues.map((venue, index) => (
              <div
                key={venue.id}
                onClick={() => {
                  setIsExpanded(false);
                  onSelectVenue(venue);
                }}
                className="cursor-pointer animate-fade-in-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                <VenueCard venue={venue} depth={0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Venue Card - Image background with gradient overlay
 */
function VenueCard({ venue, depth = 0 }) {
  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);

  // Cream overlay opacity for cards deeper in stack: 0%, 25%, 50%
  const overlayOpacity = [0, 0.25, 0.5][depth] || 0;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Venue image - full bleed */}
      <img
        src={venue.image}
        alt={venue.name}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Progressive blur — only on front card (back cards have cream overlay) */}
      {depth === 0 && (
        <>
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 10%, black 55%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 55%)',
            }}
          >
            <img src={venue.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'blur(8px)', transform: 'scale(1.05) translateZ(0)' }} />
          </div>
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 35%, black 85%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 35%, black 85%)',
            }}
          >
            <img src={venue.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'blur(28px)', transform: 'scale(1.1) translateZ(0)' }} />
          </div>
        </>
      )}

      {/* Content at bottom */}
      <div className="relative z-10 flex flex-col justify-end min-h-[130px]">
        <div className="flex-1" />
        <div className="rounded-t-2xl p-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex flex-shrink-0">
              {venue.people.slice(0, 2).map((person, idx) => (
                <div
                  key={person.id}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 border-white/40 overflow-hidden",
                    "shadow-lg shadow-black/30",
                    idx > 0 && "-ml-5"
                  )}
                >
                  <img src={person.avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {extraPeople > 0 && <AnimatedBadge count={extraPeople} size="md" />}
            </div>

            {/* Venue info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{venue.name}</h3>
              <p className="text-white/60 text-xs truncate">{venue.type} · {venue.distance}</p>
            </div>

            {/* Right arrow */}
            <ChevronRight className="h-5 w-5 text-white/40 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Cream overlay for back cards in stack */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: `rgba(245,241,232,${overlayOpacity})` }}
        />
      )}
    </div>
  );
}

/**
 * Venue Takeover — animated mask on venue image
 * Circle by default; radiates when pressing & holding
 */
const _makeMaskSvg = (ps) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 100">
    <style>
      @keyframes vmL { 0% { transform: translateX(0); clip-path: inset(0 0 0 0); } 100% { transform: translateX(-75px); clip-path: inset(0 75% 0 0); } }
      @keyframes vmR { 0% { transform: translateX(0); clip-path: inset(0 0 0 0); } 100% { transform: translateX(75px); clip-path: inset(0 0 0 75%); } }
      .vmL1 { animation: vmL 1s linear infinite; animation-play-state: ${ps}; }
      .vmR1 { animation: vmR 1s linear infinite; animation-play-state: ${ps}; }
      .vmL2 { animation: vmL 1s linear infinite 0.33s; animation-play-state: ${ps}; }
      .vmR2 { animation: vmR 1s linear infinite 0.33s; animation-play-state: ${ps}; }
      .vmL3 { animation: vmL 1s linear infinite 0.66s; animation-play-state: ${ps}; }
      .vmR3 { animation: vmR 1s linear infinite 0.66s; animation-play-state: ${ps}; }
    </style>
    <circle cx="125" cy="50" r="50" fill="white"/>
    <path class="vmL1" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" fill="white"/>
    <path class="vmR1" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" fill="white"/>
    <path class="vmL2" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" fill="white"/>
    <path class="vmR2" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" fill="white"/>
    <path class="vmL3" d="M 125 0 L 125 100 A 50 50 0 0 1 125 0 Z" fill="white"/>
    <path class="vmR3" d="M 125 0 L 125 100 A 50 50 0 0 0 125 0 Z" fill="white"/>
  </svg>
`;
const VENUE_MASK_STATIC = `url("data:image/svg+xml,${encodeURIComponent(_makeMaskSvg('paused'))}")`;
const VENUE_MASK_ANIMATED = `url("data:image/svg+xml,${encodeURIComponent(_makeMaskSvg('running'))}")`;

function VenueModal({ venue, onClose, onCheckIn }) {
  const [userCredits] = React.useState(5);
  const [holding, setHolding] = React.useState(false);
  const [holdComplete, setHoldComplete] = React.useState(false);
  const [marqueeSpeed, setMarqueeSpeed] = React.useState(1);
  const holdTimerRef = React.useRef(null);
  const holdStartRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const maskUrl = holding || holdComplete ? VENUE_MASK_ANIMATED : VENUE_MASK_STATIC;

  // Press & hold — 2 second timer with progressive marquee speedup
  const startHold = () => {
    setHolding(true);
    holdStartRef.current = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - holdStartRef.current) / 2000, 1);
      setMarqueeSpeed(1 + p * p * 7);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    holdTimerRef.current = setTimeout(() => {
      setHoldComplete(true);
      setMarqueeSpeed(8);
      setTimeout(() => {
        if (onCheckIn) onCheckIn(venue);
      }, 300);
    }, 2000);
  };
  const endHold = () => {
    setHolding(false);
    setMarqueeSpeed(1);
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null; }
  };

  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!venue) return null;

  return (
    <div
      className="absolute inset-0 z-50"
      style={{
        backgroundColor: holding || holdComplete ? '#5865F2' : '#8A8B73',
        transition: holding || holdComplete ? 'background-color 2s linear' : 'background-color 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerBorder {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Top bar — location pill + close button */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          style={{ backgroundColor: 'rgba(245,241,232,0.15)' }}
        >
          <MapPin className="h-3 w-3 text-brown-lighter/70" />
          <span className="text-brown-lighter/70 text-[11px] font-medium">{venue.area} · {venue.distance}</span>
          <ChevronRight className="h-3 w-3 text-brown-lighter/70" />
        </a>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ backgroundColor: 'rgba(245,241,232,0.15)' }}
        >
          <X className="h-5 w-5 text-brown-lighter" />
        </button>
      </div>

      {/* Scrolling profile rows — between top edge and venue circle */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        className="absolute left-0 right-0 z-10 flex flex-col justify-center gap-3"
        style={{ top: '48px', bottom: 'calc(50% + 150px)' }}
      >
        <div className="overflow-hidden">
          <div className="flex gap-3" style={{ animation: `marqueeLeft ${60 / marqueeSpeed}s linear infinite`, width: 'max-content' }}>
            {[...PROFILE_IMAGES, ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r1-${i}`} className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/15">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-3" style={{ animation: `marqueeRight ${70 / marqueeSpeed}s linear infinite`, width: 'max-content' }}>
            {[...PROFILE_IMAGES.slice(4), ...PROFILE_IMAGES.slice(0, 4), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
              <div key={`r2-${i}`} className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/15">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venue image — BIG circle, progressively turns red during hold */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex-shrink-0"
          style={{
            width: '520px',
            height: '280px',
            maskImage: maskUrl,
            WebkitMaskImage: maskUrl,
            maskSize: 'auto 100%',
            WebkitMaskSize: 'auto 100%',
            maskPosition: 'center center',
            WebkitMaskPosition: 'center center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${venue.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#C94A2F',
              opacity: holding || holdComplete ? 1 : 0,
              transition: holding || holdComplete ? 'opacity 2s linear' : 'opacity 0.3s ease-out',
            }}
          />
        </div>
      </div>

      {/* Venue info — perfectly centered between circle bottom and button top */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center justify-center"
        style={{
          top: 'calc(50% + 140px)',
          bottom: 'calc(40px + 48px + 12px + 16px + 16px)',
          animation: 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.3s both',
        }}
      >
        <p className="text-brown-lighter text-xs"><span className="font-bold">{venue.peopleCount}</span> people checked in to <span className="font-bold">{venue.name}</span></p>
        <p className="mt-1 text-brown-lighter text-[10px] italic">It's hactually happening.</p>
      </div>

      {/* Bottom section — button + credits */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center px-8">
        {/* Press & Hold button */}
        <div
          className="w-full max-w-[280px] relative h-12 rounded-full overflow-hidden"
          style={{
            animation: 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.5s both',
          }}
        >
          {/* Shimmer border */}
          <div
            className="absolute inset-0 rounded-full p-[1.5px]"
            style={{
              background: 'linear-gradient(90deg, #5865F2, #E05A3D, #4A7C7C, #5865F2, #E05A3D)',
              backgroundSize: '200% 100%',
              animation: 'shimmerBorder 2s linear infinite',
            }}
          >
            <div className="w-full h-full rounded-full" style={{ backgroundColor: '#8A8B73' }} />
          </div>

          {/* Hold fill progress */}
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: 'rgba(245,241,232,0.35)',
              width: holding ? '100%' : '0%',
              transition: holding ? 'width 2s linear' : 'width 0.3s ease-out',
            }}
          />

          {/* Button text */}
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="absolute inset-0 z-10 flex items-center justify-center select-none"
          >
            {holding || holdComplete ? (
              <span className="text-[10px] text-brown-lighter font-bold uppercase tracking-wide">Checking In</span>
            ) : (
              <span className="text-[10px] text-brown-lighter font-bold uppercase tracking-wide">Press & Hold to Check In · 1 credit</span>
            )}
          </button>
        </div>

        {/* Credits remaining */}
        <p
          className="mt-3 text-brown-lighter/50 text-xs"
          style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) 0.6s both' }}
        >
          You have <span className="text-brown-lighter font-bold">{userCredits} credits</span> remaining
        </p>
      </div>
    </div>
  );
}

/**
 * Floating Island Bottom Navigation - Light glass style with animated gradient text
 */
const NAV_TIMING = {
  ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
  bubbleIn:       '0.5s',
  bubbleOutDur:   '0.35s',
  bubbleOutDelay: '0.02s',
  labelInDur:     '0.5s',
  labelInDelay:   '0.06s',
  labelOut:       '0.35s',
};

function BottomNavIsland({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'discover', icon: Navigation, label: 'Nearby' },
    { id: 'matches', icon: Heart, label: 'Matches' },
    { id: 'messages', icon: MessageCircle, label: 'Inbox' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const [hoveredTab, setHoveredTab] = React.useState(null);
  const targetId = hoveredTab || activeTab;
  const T = NAV_TIMING;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
      <style>{`
        @keyframes shimmerText {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
      `}</style>
      <div className="bg-orange rounded-full px-3 py-3 shadow-glow-orange">
        <div className="relative flex items-center gap-1">
          {navItems.map((item) => {
            const active = targetId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className="relative flex items-center px-3 py-3 rounded-full"
              >
                {/* Bubble — circle reveal from icon center */}
                <div
                  className="absolute inset-0 rounded-full bg-blue pointer-events-none"
                  style={{
                    willChange: 'clip-path',
                    clipPath: `circle(${active ? '150px' : '0px'} at 20px 50%)`,
                    transition: active
                      ? `clip-path ${T.bubbleIn} ${T.ease}`
                      : `clip-path ${T.bubbleOutDur} ${T.ease} ${T.bubbleOutDelay}`,
                  }}
                />
                <item.icon className="relative z-10 h-4 w-4 text-brown-lighter" />
                {/* Label — expands button width, text revealed by overflow:hidden */}
                <span
                  className="relative z-10 text-xs font-black overflow-hidden whitespace-nowrap"
                  style={{
                    willChange: 'max-width',
                    maxWidth: active ? '80px' : '0px',
                    marginLeft: active ? '8px' : '0px',
                    transition: active
                      ? `max-width ${T.labelInDur} ${T.ease} ${T.labelInDelay}, margin-left ${T.labelInDur} ${T.ease} ${T.labelInDelay}`
                      : `max-width ${T.labelOut} ${T.ease}, margin-left ${T.labelOut} ${T.ease}`,
                    background: 'linear-gradient(90deg, #C8E3F4, #F5C4C4, #D4E4A5, #C8E3F4, #F5C4C4)',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: active ? 'shimmerText 1s linear infinite' : 'none',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Home Screen
 */
export default function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // State
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [locationGranted, setLocationGranted] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState('DIFC, Dubai');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('discover');
  const [selectedVenue, setSelectedVenue] = React.useState(null);
  const [modalVenue, setModalVenue] = React.useState(null);
  const [centerTrigger, setCenterTrigger] = React.useState(0);

  // Check if location permission already granted
  React.useEffect(() => {
    const hasLocationPermission = localStorage.getItem('locationPermission');
    if (!hasLocationPermission) {
      // Small delay before showing modal for better UX
      const timer = setTimeout(() => setShowLocationModal(true), 500);
      return () => clearTimeout(timer);
    } else {
      setLocationGranted(true);
    }
  }, []);

  const handleAllowLocation = () => {
    localStorage.setItem('locationPermission', 'granted');
    setLocationGranted(true);
    setShowLocationModal(false);
  };

  const handleDenyLocation = () => {
    localStorage.setItem('locationPermission', 'denied');
    setShowLocationModal(false);
  };

  const handleSelectLocation = (location) => {
    setCurrentLocation(location.name);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Handle tab navigation
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Navigate to different screens based on tab
    if (tabId === 'matches') navigate('/matches');
    else if (tabId === 'messages') navigate('/messages');
    else if (tabId === 'profile') navigate('/profile');
    // 'discover' stays on current screen
  };

  return (
    <div className="h-full relative overflow-hidden bg-brown-lighter">
      {/* Interactive Mapbox Map */}
      <InteractiveMap
        venues={VENUES}
        selectedVenue={selectedVenue}
        onVenueClick={(venue) => setModalVenue(venue)}
        centerTrigger={centerTrigger}
      />

      {/* Location Permission Modal */}
      {showLocationModal && (
        <LocationPermissionModal
          onAllow={handleAllowLocation}
          onDeny={handleDenyLocation}
        />
      )}

      {/* Floating Island Top Bar */}
      <div className="absolute top-12 left-4 right-4 z-20">
        {/* Location Island + Dropdown wrapper — higher z so dropdown covers Me button */}
        <div className="relative z-10">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-full",
            "bg-brown-lighter/80 backdrop-blur-2xl border border-brown-light/30 shadow-card",
            "hover:bg-brown-lighter/90 active:bg-brown-lighter transition-colors"
          )}
        >
          <MapPin className="h-4 w-4 text-blue" />
          <span className="flex-1 text-black text-sm font-bold text-left">
            {currentLocation}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-brown transition-transform",
            isSearchOpen && "rotate-180"
          )} />
        </button>

        {/* Location Search Dropdown */}
        <LocationSearchDropdown
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleSelectLocation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        </div>

        {/* Center on Me button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => setCenterTrigger(c => c + 1)}
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-xl border border-brown-light/30 shadow-card flex items-center justify-center hover:bg-white active:scale-95 transition-colors duration-150"
          >
            <Navigation className="h-4 w-4 text-blue" />
          </button>
        </div>
      </div>

      {/* Auto-rotating Venue Stack */}
      <VenueStack
        venues={VENUES}
        onSelectVenue={(venue) => setModalVenue(venue)}
      />

      {/* Floating Island Bottom Navigation */}
      <BottomNavIsland
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Venue Details Modal */}
      <VenueModal
        venue={modalVenue}
        onClose={() => setModalVenue(null)}
        onCheckIn={(venue) => {
          setModalVenue(null);
          navigate(`/checked-in/${venue.id}`);
        }}
      />
    </div>
  );
}
