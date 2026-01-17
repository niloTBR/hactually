import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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

// Mock venue data with people checked in
const VENUES = [
  {
    id: 1,
    name: 'WHITE Dubai',
    area: 'Meydan',
    type: 'Nightclub',
    peopleCount: 47,
    position: { top: '25%', left: '60%' },
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
    position: { top: '45%', left: '30%' },
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
    position: { top: '55%', left: '55%' },
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
    position: { top: '35%', left: '75%' },
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
    position: { top: '65%', left: '40%' },
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
 * Dark Map Background - simple gradient
 */
function DarkMap({ children }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0f]">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Purple ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)
          `,
        }}
      />
      {children}
    </div>
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
 * Venue Map Marker with profile avatars
 */
function VenueMarker({ venue, onClick, isSelected }) {
  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
        "transition-all duration-300",
        isSelected && "scale-110 z-20"
      )}
      style={{ top: venue.position.top, left: venue.position.left }}
    >
      {/* Avatar stack - super close together with 1px borders */}
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

        {/* Animated +N indicator */}
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
 * Auto-rotating Card Stack - 3D effect with stacked cards visible at top
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
    <>
      {/* Collapsed Stack View - at bottom with 3D stack effect visible at top */}
      {!isExpanded && (
        <div className="absolute bottom-24 left-4 right-4 z-20">
          {/* Header with expand button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center justify-between px-2 py-2 mb-4"
          >
            <span className="text-white/70 text-xs font-medium">
              {venues.length} venues nearby
            </span>
            <div className="flex items-center gap-1 text-white/50">
              <span className="text-[10px]">View all</span>
              <ChevronDown className="h-3.5 w-3.5 rotate-180" />
            </div>
          </button>

          {/* Stacked cards - 3D effect with cards peeking from top */}
          <div className="relative h-[90px]">
            {orderedVenues.slice(0, 3).map((venue, index) => {
              const isTop = index === 0;
              // Cards stack UP (negative Y) so the 3D effect is at the top
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
        </div>
      )}

      {/* Expanded Full List */}
      {isExpanded && (
        <div className="absolute inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl">
          {/* Header - same style as collapsed */}
          <div className="px-4 pt-14">
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full flex items-center justify-between px-2 py-2 mb-2"
            >
              <span className="text-white/70 text-xs font-medium">
                {venues.length} venues nearby
              </span>
              <div className="flex items-center gap-1 text-white/50">
                <span className="text-[10px]">Close</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>

          {/* Scrollable list */}
          <div className="px-4 pb-24 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 100px)' }}>
            {venues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => {
                  setIsExpanded(false);
                  onSelectVenue(venue);
                }}
                className="cursor-pointer"
              >
                <VenueCard venue={venue} depth={0} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Individual Venue Card - Dark gradient with subtle border for 3D stack effect
 */
function VenueCard({ venue, depth = 0 }) {
  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);

  // Darker cards as they go deeper in stack
  const bgColors = [
    'bg-[#1c1c22]',  // Top card - lightest
    'bg-[#16161a]',  // Second
    'bg-[#111114]',  // Third - darkest
  ];

  return (
    <div className={cn(
      bgColors[depth] || bgColors[0],
      "rounded-2xl p-4 border border-white/[0.08]"
    )}>
      <div className="flex items-center gap-3">
        {/* Avatar stack - super close together, 1px borders */}
        <div className="flex flex-shrink-0">
          {venue.people.slice(0, 2).map((person, idx) => (
            <div
              key={person.id}
              className={cn(
                "h-10 w-10 rounded-full border border-white/10 overflow-hidden",
                idx > 0 && "-ml-5"
              )}
            >
              <img src={person.avatar} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          {extraPeople > 0 && <AnimatedBadge count={extraPeople} size="lg" />}
        </div>

        {/* Venue info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{venue.name}</h3>
          <p className="text-white/40 text-xs truncate">{venue.type} · {venue.area}</p>
        </div>

        {/* Right arrow */}
        <ChevronRight className="h-5 w-5 text-white/30 flex-shrink-0" />
      </div>
    </div>
  );
}

/**
 * Venue Details Modal
 */
function VenueModal({ venue, onClose }) {
  if (!venue) return null;
  const extraPeople = Math.max(0, venue.peopleCount - venue.people.length);

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-h-[85%] bg-[#1c1c1e] rounded-t-3xl overflow-hidden animate-slide-in-up">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header image */}
        <div className="relative h-36 bg-gradient-to-br from-purple-900/80 to-pink-900/80">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Title & Info */}
          <div>
            <h2 className="text-2xl font-bold text-white">{venue.name}</h2>
            <p className="text-white/50 text-sm mt-1">{venue.type} · {venue.area}, Dubai</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
              <span className="text-white text-sm font-medium">{venue.peopleCount} people here</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
              <Clock className="h-4 w-4 text-white/40" />
              <span className="text-white/60 text-sm">Open now</span>
            </div>
          </div>

          {/* People here */}
          <div>
            <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
              People Here
            </h3>
            <div className="flex items-center">
              {venue.people.map((person, idx) => (
                <div
                  key={person.id}
                  className={cn(
                    "h-12 w-12 rounded-full border border-white/10 overflow-hidden",
                    idx > 0 && "-ml-5"
                  )}
                >
                  <img src={person.avatar} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {extraPeople > 0 && (
                <div className="relative h-12 w-12 -ml-5">
                  {/* Spinning gradient border */}
                  <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(236, 72, 153), rgb(139, 92, 246), rgb(236, 72, 153))',
                      animationDuration: '3s',
                    }}
                  />
                  <div className="absolute inset-[1px] rounded-full bg-[#1c1c1e] flex items-center justify-center text-sm font-bold text-white">
                    +{extraPeople}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Check In Button */}
          <button className={cn(
            "w-full py-4 rounded-2xl font-semibold text-white",
            "bg-gradient-to-r from-pink-500 to-purple-600",
            "shadow-lg shadow-pink-500/25",
            "active:scale-[0.98] transition-transform"
          )}>
            Check In Here
          </button>
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
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive ? "text-pink-400" : "text-white/40"
                  )}
                />
                {/* Label only shows when active - animated gradient text */}
                {isActive && (
                  <span
                    className="text-xs font-semibold relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(90deg, rgb(236, 72, 153), rgb(139, 92, 246), rgb(236, 72, 153))',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmerText 2s linear infinite',
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
    <div className="h-full bg-purple-950 relative overflow-hidden">
      {/* Dark Map Background */}
      <DarkMap>
        {/* Venue Markers on Map */}
        {VENUES.map((venue) => (
          <VenueMarker
            key={venue.id}
            venue={venue}
            isSelected={selectedVenue?.id === venue.id}
            onClick={() => setModalVenue(venue)}
          />
        ))}
      </DarkMap>

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
            !isSearchOpen && "[&>div:first-child]:opacity-0 [&>div:nth-child(2)]:opacity-0"
          )}
          color="rgb(236, 72, 153)"
          speed="4s"
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
