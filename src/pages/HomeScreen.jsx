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
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

/**
 * Home Screen - Map Discovery View (2A)
 * Dark map with venue markers and Apple Wallet-style venue stack
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
 * iOS-style Location Permission Modal
 */
function LocationPermissionModal({ onAllow, onDeny }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-8">
      <div className="bg-[#1c1c1e] rounded-2xl w-full max-w-[280px] overflow-hidden">
        {/* Icon */}
        <div className="pt-6 pb-4 flex justify-center">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <MapPin className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="px-4 pb-5 text-center">
          <h3 className="text-white text-[17px] font-semibold mb-2">
            Allow "Hactually" to access your location?
          </h3>
          <p className="text-[#8e8e93] text-[13px] leading-relaxed">
            Your location is used to discover nearby venues and show you who's around.
          </p>
        </div>

        {/* Buttons - iOS style stacked */}
        <div className="border-t border-white/10">
          <button
            onClick={onAllow}
            className="w-full py-3 text-[17px] text-[#0a84ff] font-medium border-b border-white/10 active:bg-white/5"
          >
            Allow While Using App
          </button>
          <button
            onClick={onAllow}
            className="w-full py-3 text-[17px] text-[#0a84ff] border-b border-white/10 active:bg-white/5"
          >
            Allow Once
          </button>
          <button
            onClick={onDeny}
            className="w-full py-3 text-[17px] text-[#0a84ff] active:bg-white/5"
          >
            Don't Allow
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Location Search Dropdown
 */
function LocationSearchDropdown({ isOpen, onClose, onSelect, searchQuery, setSearchQuery }) {
  const filteredSuggestions = LOCATION_SUGGESTIONS.filter(
    loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-40">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Search Input */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4 text-white/40" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="max-h-64 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((location) => (
              <button
                key={location.id}
                onClick={() => onSelect(location)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{location.name}</p>
                  <p className="text-white/40 text-xs truncate">{location.area}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-white/40 text-sm">No locations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Mapbox Map with dark style
 */
function InteractiveMap({ venues, onVenueClick, selectedVenue }) {
  const [viewState, setViewState] = React.useState({
    longitude: 55.2708, // DIFC center
    latitude: 25.2048,
    zoom: 12,
    pitch: 45, // Slight 3D tilt
    bearing: 0,
  });

  return (
    <div className="absolute inset-0">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
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

      {/* Gradient overlay for better UI contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%),
            linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)
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
        "relative transition-all duration-300",
        isSelected && "scale-110 z-20"
      )}
    >
      {/* Avatar stack */}
      <div className="relative flex items-center">
        {venue.people.slice(0, 2).map((person, idx) => (
          <div
            key={person.id}
            className={cn(
              "h-9 w-9 rounded-full border border-white/20 overflow-hidden",
              "shadow-lg shadow-black/50",
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
        "bg-black/70 backdrop-blur-sm",
        "text-[10px] font-medium text-white whitespace-nowrap"
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
          background: 'conic-gradient(from 0deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(236, 72, 153), rgb(139, 92, 246), rgb(236, 72, 153))',
          animationDuration: '3s',
        }}
      />
      {/* Inner circle */}
      <div className={cn("absolute rounded-full bg-[#0f0f12] flex items-center justify-center", s.inset)}>
        <span className={cn("font-bold text-white", s.text)}>+{count > 99 ? '99' : count}</span>
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

  // Auto-rotate cards every 4 seconds when not expanded
  React.useEffect(() => {
    if (isExpanded) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % venues.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isExpanded, venues.length]);

  // Reorder venues so active is on top
  const orderedVenues = [
    ...venues.slice(activeIndex),
    ...venues.slice(0, activeIndex),
  ];

  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-20 transition-all duration-500 ease-out",
        isExpanded
          ? "inset-0 bg-[#0a0a0f]/95 backdrop-blur-xl"
          : "bottom-24"
      )}
    >
      {/* Dark gradient background when collapsed - fades from transparent to dark */}
      {!isExpanded && (
        <div
          className="absolute inset-0 -top-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      )}

      {/* Header with expand/collapse button */}
      <div className={cn(
        "relative transition-all duration-500 ease-out",
        isExpanded ? "px-4 pt-14" : "px-4"
      )}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-2 py-2 mb-4"
        >
          <span className="text-white/80 text-sm font-medium">
            Where people are tonight
          </span>
          <div className="flex items-center gap-1 text-white/50">
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
          "transition-all duration-500 ease-out overflow-hidden",
          isExpanded ? "px-4 pb-24" : ""
        )}
        style={{
          maxHeight: isExpanded ? 'calc(100vh - 140px)' : '120px',
        }}
      >
        {/* Content: either stacked view or full list */}
        {!isExpanded ? (
          // Collapsed: Stacked cards with 3D effect
          <div className="relative h-[120px]">
            {orderedVenues.slice(0, 3).map((venue, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={venue.id}
                  onClick={() => isTop && onSelectVenue(venue)}
                  className={cn(
                    "absolute left-0 right-0 bottom-0 transition-all duration-500 ease-out",
                    isTop && "cursor-pointer"
                  )}
                  style={{
                    transform: `translateY(${-index * 12}px) scale(${1 - index * 0.04})`,
                    zIndex: 10 - index,
                  }}
                >
                  <VenueCard venue={venue} depth={index} />
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

  // Opacity decreases for deeper cards in stack
  const opacityLevels = [1, 0.9, 0.8];

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{ opacity: opacityLevels[depth] || 1 }}
    >
      {/* Venue image background */}
      <div className="absolute inset-0">
        <img
          src={venue.image}
          alt={venue.name}
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay - fades to black at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

      {/* Content overlaid on image */}
      <div className="relative z-10 p-4 pt-10">
        <div className="flex items-center gap-3">
          {/* Avatar stack - super close together */}
          <div className="flex flex-shrink-0">
            {venue.people.slice(0, 2).map((person, idx) => (
              <div
                key={person.id}
                className={cn(
                  "h-9 w-9 rounded-full border border-white/20 overflow-hidden",
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
            <h3 className="text-white font-semibold text-sm truncate">{venue.name}</h3>
            <p className="text-white/50 text-xs truncate">{venue.type} · {venue.distance}</p>
          </div>

          {/* Right arrow */}
          <ChevronRight className="h-5 w-5 text-white/40 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

/**
 * Venue Details Modal - Frosted glass with animated images
 */
function VenueModal({ venue, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [userCredits] = React.useState(5); // Mock user credits

  // Cycle through images like a gif
  React.useEffect(() => {
    if (!venue) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % VENUE_IMAGES.length);
    }, 1500); // Change image every 1.5s
    return () => clearInterval(interval);
  }, [venue]);

  if (!venue) return null;

  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);
  const checkInCost = 1; // Credits needed to check in

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal content - frosted glass, no borders */}
      <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
        >
          <X className="h-4 w-4 text-white/70" />
        </button>

        {/* Animated image slideshow */}
        <div className="relative h-48 overflow-hidden">
          {VENUE_IMAGES.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                currentImageIndex % 4 === idx ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)',
            }}
          />
          {/* Image indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  currentImageIndex % 4 === idx
                    ? "w-4 bg-white"
                    : "w-1 bg-white/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Venue name & distance */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{venue.name}</h2>
              <p className="text-white/50 text-sm">{venue.type} · {venue.area}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
              <span className="text-white/90 text-sm font-medium">{venue.distance}</span>
            </div>
          </div>

          {/* People avatars */}
          <div className="flex items-center gap-3">
            <div className="flex flex-shrink-0">
              {venue.people.slice(0, 3).map((person, idx) => (
                <div
                  key={person.id}
                  className={cn(
                    "h-10 w-10 rounded-full border border-white/20 overflow-hidden",
                    "shadow-lg shadow-black/20",
                    idx > 0 && "-ml-4"
                  )}
                >
                  <img src={person.avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {extraPeople > 0 && <AnimatedBadge count={extraPeople} size="lg" />}
            </div>
            <span className="text-white/60 text-sm">{venue.peopleCount} people here</span>
          </div>

          {/* Happening message */}
          <div className="text-center py-2">
            <p className="text-white/80 text-base font-medium">
              It's already happening inside ✨
            </p>
          </div>

          {/* Check In Button */}
          <button className={cn(
            "w-full py-4 rounded-2xl font-semibold text-white",
            "bg-gradient-to-r from-pink-500 to-purple-600",
            "shadow-lg shadow-pink-500/30",
            "active:scale-[0.98] transition-transform"
          )}>
            Check In · {checkInCost} credit
          </button>

          {/* Credits remaining */}
          <p className="text-center text-white/40 text-xs">
            You have <span className="text-white/70 font-medium">{userCredits} credits</span> remaining
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Floating Island Bottom Navigation - Glass style with animated gradient text
 */
function BottomNavIsland({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'discover', icon: Navigation, label: 'Nearby' },
    { id: 'matches', icon: Heart, label: 'Matches' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-white/5 backdrop-blur-2xl rounded-full px-3 py-3 shadow-2xl">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-white/10"
                    : "hover:bg-white/5 active:bg-white/10"
                )}
              >
                {/* Icon - pink when active */}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive ? "text-pink-400" : "text-white/40"
                  )}
                />
                {/* Label with animated gradient when active */}
                {isActive && (
                  <span
                    className="text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(90deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(59, 130, 246), rgb(139, 92, 246), rgb(236, 72, 153))',
                      backgroundSize: '300% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmerText 1s linear infinite',
                    }}
                  >
                    {item.label}
                  </span>
                )}
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
    <div className="h-full relative overflow-hidden">
      {/* Interactive Mapbox Map */}
      <InteractiveMap
        venues={VENUES}
        selectedVenue={selectedVenue}
        onVenueClick={(venue) => setModalVenue(venue)}
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
        {/* Location Island */}
        <StarBorder
          as="button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn(
            "w-full",
            !isSearchOpen && "[&>div:first-child]:opacity-0 [&>div:nth-child(2)]:opacity-0",
            isSearchOpen && "[&>div:first-child]:opacity-100 [&>div:nth-child(2)]:opacity-100"
          )}
          color="rgb(236, 72, 153)"
          speed="2s"
        >
          <div className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl",
            "bg-black/40 backdrop-blur-xl border border-white/10",
            "hover:bg-black/50 active:bg-black/60 transition-all"
          )}>
            <MapPin className="h-4 w-4 text-pink-400" />
            <span className="flex-1 text-white text-sm font-medium text-left">
              {currentLocation}
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-white/40 transition-transform",
              isSearchOpen && "rotate-180"
            )} />
          </div>
        </StarBorder>

        {/* Location Search Dropdown */}
        <LocationSearchDropdown
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleSelectLocation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
      />
    </div>
  );
}
