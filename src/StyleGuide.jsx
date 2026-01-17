'use client';

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Workflow,
  Eye,
  MapPin,
  Sparkles,
  MessageCircle,
  User,
  Settings,
  Bell,
  ChevronLeft,
  X,
  Star,
  Heart,
  Check,
  Plus,
  Send,
  Paperclip,
  Search,
  Camera,
  Edit,
  Shield,
  Users,
  Navigation,
  Flame,
  Clock,
  ChevronRight,
  Home,
  Compass,
  Mail,
  MoreHorizontal,
  Image,
  Mic,
  Phone,
  Video,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  Locate,
} from 'lucide-react';

import { cn } from './lib/utils';

/**
 * ============================================================================
 * HACTUALLY DESIGN SYSTEM - STYLE GUIDE
 * ============================================================================
 *
 * Clean, organized visual documentation.
 * Color palette: Purple + Pink only.
 */

/* ==========================================================================
   SAMPLE DATA
   ========================================================================== */

const sampleUser = {
  id: '1',
  name: 'Sarah',
  age: 26,
  photo: '/images/kateryna-hliznitsova-V3iRmqJh69I-unsplash.jpg', // Woman on boat
  bio: 'Adventure seeker & coffee enthusiast.',
  distance: 850,
  isVerified: true,
  isOnline: true,
  interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
  location: 'Dubai Marina',
};

const sampleVenue = {
  id: '1',
  name: 'Sky Bar',
  type: 'Rooftop Lounge',
  photo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80', // Rooftop bar
  distance: 450,
  peopleHere: 24,
};

const sampleMatch = {
  photo: '/images/natalia-blauth-gw2udfGe_tM-unsplash.jpg', // Man for the match
};

/* ==========================================================================
   LAYOUT COMPONENTS
   ========================================================================== */

const Section = ({ id, title, children }) => (
  <section id={id} className="py-12 border-b border-white/10 last:border-0 scroll-mt-24">
    <h2 className="text-2xl font-extralight tracking-wide text-white mb-8">{title}</h2>
    {children}
  </section>
);

const Grid = ({ cols = 2, children, className }) => (
  <div className={cn(
    'grid gap-6',
    cols === 2 && 'grid-cols-1 sm:grid-cols-2',
    cols === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols === 4 && 'grid-cols-2 sm:grid-cols-4',
    cols === 6 && 'grid-cols-3 sm:grid-cols-6',
    className
  )}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">{children}</p>
);

const Swatch = ({ color, name, hex }) => (
  <div>
    <div className={cn('h-16 rounded-xl mb-2', color)} />
    <p className="text-sm font-medium text-white">{name}</p>
    <p className="text-xs text-white/50">{hex}</p>
  </div>
);

/* ==========================================================================
   STYLE GUIDE
   ========================================================================== */

// Sidebar navigation items
const NAV_ITEMS = [
  { id: 'colors', label: 'Colors', icon: Sparkles },
  { id: 'typography', label: 'Typography', icon: Edit },
  { id: 'buttons', label: 'Buttons', icon: Plus },
  { id: 'cards', label: 'Cards', icon: Image },
  { id: 'inputs', label: 'Inputs', icon: Edit },
  { id: 'avatars', label: 'Avatars & Badges', icon: User },
  { id: 'navigation', label: 'Navigation', icon: Compass },
  { id: 'icons', label: 'Icons', icon: Star },
  { id: 'map', label: 'Map Components', icon: MapPin },
  { id: 'states', label: 'States', icon: CheckCircle },
];

export default function StyleGuide() {
  const [activeNav, setActiveNav] = React.useState('discover');
  const [activeTab, setActiveTab] = React.useState('nearby');
  const [toggleOn, setToggleOn] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('colors');

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-purple-950/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extralight tracking-widest text-white uppercase">Hactually</h1>
              <p className="text-xs font-light text-white/50 tracking-wide">Design System</p>
            </div>
          </div>
          <Link
            to="/flows"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            <Workflow className="h-4 w-4" />
            Flows
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24 p-6 space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  activeSection === id
                    ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 text-pink-400 border border-pink-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 min-w-0">
        {/* =====================================================
            COLORS
            ===================================================== */}
        <Section id="colors" title="Colors">
          <Label>Purple Scale</Label>
          <Grid cols={6} className="mb-8">
            <Swatch color="bg-purple-950" name="950" hex="#0D0612" />
            <Swatch color="bg-purple-900" name="900" hex="#1A0D24" />
            <Swatch color="bg-purple-800" name="800" hex="#2D1B45" />
            <Swatch color="bg-purple-700" name="700" hex="#3D2660" />
            <Swatch color="bg-purple-600" name="600" hex="#4E3180" />
            <Swatch color="bg-purple-500" name="500" hex="#6B42A8" />
          </Grid>

          <Label>Pink Scale</Label>
          <Grid cols={6} className="mb-8">
            <Swatch color="bg-pink-950" name="950" hex="#2D0A1E" />
            <Swatch color="bg-pink-900" name="900" hex="#4A1033" />
            <Swatch color="bg-pink-700" name="700" hex="#8C1A5D" />
            <Swatch color="bg-pink-600" name="600" hex="#B82073" />
            <Swatch color="bg-pink-500" name="500" hex="#E91E8C" />
            <Swatch color="bg-pink-400" name="400" hex="#F04DA3" />
          </Grid>

          <Label>Gradients</Label>
          <Grid cols={3}>
            <div>
              <div className="h-20 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 mb-2" />
              <p className="text-sm text-white">Primary</p>
            </div>
            <div>
              <div className="h-20 rounded-xl bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 mb-2" />
              <p className="text-sm text-white">Match</p>
            </div>
            <div>
              <div className="h-20 rounded-xl bg-gradient-to-br from-purple-800 to-purple-900 mb-2" />
              <p className="text-sm text-white">Card</p>
            </div>
          </Grid>
        </Section>

        {/* =====================================================
            TYPOGRAPHY
            ===================================================== */}
        <Section id="typography" title="Typography">
          <Label>Headlines (SF Pro - Thin)</Label>
          <div className="space-y-3 mb-8">
            <h1 className="text-5xl font-thin tracking-wide text-white">Display — 48px Thin</h1>
            <h2 className="text-3xl font-extralight tracking-wide text-white">Heading — 30px Extralight</h2>
            <h3 className="text-2xl font-light tracking-wide text-white">Title — 24px Light</h3>
          </div>

          <Label>Body Text (SF Pro)</Label>
          <div className="space-y-3">
            <p className="text-lg font-normal text-white">Body Large — 18px Regular</p>
            <p className="text-base font-normal text-white">Body — 16px Regular</p>
            <p className="text-sm font-medium text-white/70">Small — 14px Medium</p>
            <p className="text-xs font-medium text-white/50">Caption — 12px Medium</p>
          </div>
        </Section>

        {/* =====================================================
            BUTTONS
            ===================================================== */}
        <Section id="buttons" title="Buttons">
          <Label>Primary</Label>
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="h-11 px-6 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all">
              Primary Button
            </button>
            <button className="h-11 px-6 rounded-full bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/15 transition-all">
              Secondary
            </button>
            <button className="h-11 px-6 rounded-full text-white/70 font-semibold hover:text-white hover:bg-white/10 transition-all">
              Ghost
            </button>
          </div>

          <Label>Sizes</Label>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button className="h-8 px-4 text-xs rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-lg shadow-pink-500/20">Small</button>
            <button className="h-10 px-5 text-sm rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-lg shadow-pink-500/20">Medium</button>
            <button className="h-12 px-6 text-base rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-lg shadow-pink-500/20">Large</button>
          </div>

          <Label>Icon Buttons</Label>
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="h-11 w-11 rounded-full bg-white/10 text-white/70 flex items-center justify-center hover:bg-white/15 hover:text-white transition-all">
              <Settings className="h-5 w-5" />
            </button>
            <button className="h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Heart className="h-5 w-5" />
            </button>
            <button className="h-11 w-11 rounded-full bg-white/10 border-2 border-white/20 text-white/70 flex items-center justify-center hover:bg-white/15 transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <Label>Dating Actions</Label>
          <div className="flex items-center gap-4">
            {/* Reject */}
            <button className="h-14 w-14 rounded-full bg-white/10 border-2 border-white/30 text-white/60 flex items-center justify-center hover:bg-white/15 hover:text-white transition-all active:scale-95">
              <X className="h-6 w-6" />
            </button>
            {/* Superspot */}
            <button className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all active:scale-95">
              <Star className="h-5 w-5" />
            </button>
            {/* Spot */}
            <button className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all active:scale-95">
              <Eye className="h-6 w-6" />
            </button>
          </div>
        </Section>

        {/* =====================================================
            CARDS
            ===================================================== */}
        <Section id="cards" title="Cards">
          <Grid cols={2}>
            {/* Profile Card - Glass Style */}
            <div>
              <Label>Profile Card</Label>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden max-w-xs border border-white/10 shadow-xl">
                <div className="relative aspect-[3/4]">
                  <img src={sampleUser.photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
                    <MapPin className="h-3.5 w-3.5 text-pink-400" />
                    <span className="text-xs text-white font-medium">850m</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-white font-medium">Online</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-lg">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Sarah, 26</h3>
                    <Shield className="h-4 w-4 text-pink-400" />
                  </div>
                  <p className="text-sm text-white/50 mt-0.5">Dubai Marina</p>
                  <p className="text-sm text-white/70 mt-2">{sampleUser.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sampleUser.interests.map((interest) => (
                      <span key={interest} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/70">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Card - Glass Style */}
            <div>
              <Label>Venue Card</Label>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden max-w-xs border border-white/10 shadow-xl">
                <div className="relative aspect-video">
                  <img src={sampleVenue.photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full px-2 py-0.5 shadow-lg">
                    <Flame className="h-3 w-3 text-white" />
                    <span className="text-xs font-bold text-white">Hot</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{sampleVenue.name}</h4>
                      <p className="text-sm text-white/50">{sampleVenue.type}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-pink-500/20 backdrop-blur-sm rounded-full px-2 py-0.5 border border-pink-500/20">
                      <Users className="h-3 w-3 text-pink-400" />
                      <span className="text-xs font-medium text-pink-400">{sampleVenue.peopleHere}</span>
                    </div>
                  </div>
                  <button className="w-full h-10 mt-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all">
                    <MapPin className="h-4 w-4" />
                    Check In
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <Label>Match Card</Label>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 max-w-xs border border-white/10 shadow-xl">
                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  It's a Match!
                </h3>
                <p className="text-sm text-white/60 text-center mt-1">You and Sarah spotted each other</p>
                <div className="flex justify-center items-center mt-6 -space-x-4">
                  <div className="h-20 w-20 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
                    <img src={sampleMatch.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center z-10 shadow-lg shadow-pink-500/30">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-20 w-20 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
                    <img src={sampleUser.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button className="w-full h-11 mt-6 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all">
                  <MessageCircle className="h-5 w-5" />
                  Send Message
                </button>
              </div>
            </div>
          </Grid>
        </Section>

        {/* =====================================================
            INPUTS
            ===================================================== */}
        <Section id="inputs" title="Inputs">
          <Grid cols={2}>
            <div className="space-y-4">
              <Label>Text Input</Label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full h-12 px-5 rounded-full bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 transition-all"
              />

              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-12 pl-14 pr-5 rounded-full bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>

              <Label>With Error</Label>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue="invalid-email"
                  className="w-full h-12 px-5 rounded-full bg-white/5 ring-2 ring-red-500 text-white placeholder:text-white/40 focus:outline-none"
                />
                <p className="text-xs text-red-400 mt-1.5 pl-5">Please enter a valid email</p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>OTP Input</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 rounded-2xl bg-white/5 text-center text-xl font-bold text-white focus:outline-none focus:bg-white/10 transition-all"
                  />
                ))}
              </div>

              <Label>Toggle</Label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={cn(
                    'relative h-7 w-12 rounded-full transition-all',
                    toggleOn ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-white/20'
                  )}
                  onClick={() => setToggleOn(!toggleOn)}
                >
                  <div className={cn(
                    'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
                    toggleOn ? 'left-6' : 'left-1'
                  )} />
                </div>
                <span className="text-white">Show me on map</span>
              </label>

              <Label>Chat Input</Label>
              <div className="flex items-center gap-2 p-2 rounded-full bg-white/5">
                <button className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white/70 transition-colors flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full h-9 px-3 pr-10 rounded-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-pink-400 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        </Section>

        {/* =====================================================
            AVATARS & BADGES
            ===================================================== */}
        <Section id="avatars" title="Avatars & Badges">
          <Label>Avatar Sizes</Label>
          <div className="flex items-end gap-4 mb-8">
            {[
              { size: 'h-8 w-8', label: 'XS' },
              { size: 'h-10 w-10', label: 'SM' },
              { size: 'h-12 w-12', label: 'MD' },
              { size: 'h-14 w-14', label: 'LG' },
              { size: 'h-20 w-20', label: 'XL' },
            ].map(({ size, label }) => (
              <div key={label} className="text-center">
                <div className={cn('rounded-full overflow-hidden', size)}>
                  <img src={sampleUser.photo} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Label>With Status</Label>
          <div className="flex gap-4 mb-8">
            {[
              { status: 'bg-green-500', label: 'Online' },
              { status: 'bg-pink-500', label: 'Spotted' },
              { status: 'bg-purple-500', label: 'Offline' },
            ].map(({ status, label }) => (
              <div key={label} className="text-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img src={sampleUser.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className={cn('absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-purple-950', status)} />
                </div>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Label>Badges</Label>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="h-6 px-2.5 rounded-lg bg-white/10 text-xs font-medium text-white/70 flex items-center">Default</span>
            <span className="h-6 px-2.5 rounded-lg bg-pink-500 text-xs font-medium text-white flex items-center">Primary</span>
            <span className="h-6 px-2.5 rounded-lg bg-pink-500/20 text-xs font-medium text-pink-400 flex items-center">Soft</span>
            <span className="h-6 px-2.5 rounded-lg border border-pink-500/50 text-xs font-medium text-pink-400 flex items-center">Outline</span>
            <span className="h-6 px-2.5 rounded-lg bg-green-500 text-xs font-medium text-white flex items-center">Success</span>
            <span className="h-6 px-2.5 rounded-lg bg-red-500 text-xs font-medium text-white flex items-center">Error</span>
          </div>

          <Label>Interest Tags</Label>
          <div className="flex flex-wrap gap-2">
            <span className="h-8 px-3 rounded-full bg-white/10 text-sm text-white/70 flex items-center">Travel</span>
            <span className="h-8 px-3 rounded-full bg-pink-500/20 border border-pink-500/30 text-sm text-pink-400 flex items-center">Photography</span>
            <span className="h-8 px-3 rounded-full bg-pink-500/20 border border-pink-500/30 text-sm text-pink-400 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              Match
            </span>
          </div>
        </Section>

        {/* =====================================================
            NAVIGATION
            ===================================================== */}
        <Section id="navigation" title="Navigation">
          <Label>Bottom Navigation</Label>
          <div className="bg-purple-900 rounded-full p-2 mb-8">
            <div className="flex">
              {[
                { id: 'discover', icon: Eye, label: 'Discover' },
                { id: 'venues', icon: MapPin, label: 'Venues', badge: 3 },
                { id: 'matches', icon: Sparkles, label: 'Matches', badge: 12 },
                { id: 'messages', icon: MessageCircle, label: 'Messages' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(({ id, icon: Icon, label, badge }) => (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-3 rounded-full transition-colors',
                    activeNav === id ? 'text-pink-400' : 'text-white/50 hover:text-white/70'
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {badge && (
                      <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Label>Header</Label>
          <div className="bg-purple-900 rounded-full px-4 h-14 flex items-center justify-between mb-8">
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="font-semibold text-white">Profile</span>
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500" />
            </button>
          </div>

          <Label>Tabs</Label>
          <div className="space-y-4">
            <div className="flex border-b border-white/10">
              {['Nearby', 'Popular', 'New'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={cn(
                    'px-4 py-3 text-sm font-medium transition-colors relative',
                    activeTab === tab.toLowerCase() ? 'text-pink-400' : 'text-white/50 hover:text-white/70'
                  )}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-1 p-1 bg-white/5 rounded-full w-fit">
              {['All', 'Online', 'Nearby'].map((seg) => (
                <button
                  key={seg}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full transition-all',
                    seg === 'All' ? 'bg-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
                  )}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* =====================================================
            ICONS
            ===================================================== */}
        <Section id="icons" title="Icons">
          <Label>Common Icons (Lucide)</Label>
          <div className="flex flex-wrap gap-4">
            {[
              Eye, Heart, Star, MapPin, MessageCircle, User, Settings, Bell, Search,
              Camera, Edit, Shield, Users, Flame, Check, X, Plus, Send, ChevronRight,
              Home, Compass, Mail, Phone, Video, Info, AlertCircle, CheckCircle
            ].map((Icon, i) => (
              <div key={i} className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </div>
            ))}
          </div>
        </Section>

        {/* =====================================================
            MAP COMPONENTS
            ===================================================== */}
        <Section id="map" title="Map Components">
          <Grid cols={2}>
            <div>
              <Label>Map Markers</Label>
              <div className="flex items-end gap-6 p-6 bg-purple-900 rounded-3xl">
                {/* User Marker */}
                <div className="text-center">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-pink-500 overflow-hidden shadow-lg shadow-pink-500/30">
                      <img src={sampleUser.photo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-pink-500" />
                  </div>
                  <p className="text-xs text-white/40 mt-3">User</p>
                </div>

                {/* Venue Marker */}
                <div className="text-center">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-purple-700 flex items-center justify-center shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
                      24
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-3">Venue</p>
                </div>

                {/* Current Location */}
                <div className="text-center">
                  <div className="relative">
                    <div className="h-5 w-5 rounded-full bg-pink-500 border-4 border-white shadow-lg shadow-pink-500/50" />
                    <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping" />
                  </div>
                  <p className="text-xs text-white/40 mt-3">You</p>
                </div>
              </div>
            </div>

            <div>
              <Label>Map Controls</Label>
              <div className="flex gap-2">
                <div className="flex flex-col bg-purple-800 rounded-full overflow-hidden shadow-lg">
                  <button className="h-11 w-11 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <div className="h-px bg-white/10" />
                  <button className="h-11 w-11 flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors">
                    <ZoomOut className="h-5 w-5" />
                  </button>
                </div>
                <button className="h-11 w-11 rounded-full bg-purple-800 flex items-center justify-center text-white/70 hover:bg-purple-700 shadow-lg transition-colors">
                  <Locate className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Grid>
        </Section>

        {/* =====================================================
            STATES
            ===================================================== */}
        <Section id="states" title="States">
          <Grid cols={3}>
            <div className="p-6 bg-purple-800 rounded-3xl text-center">
              <Loader2 className="h-8 w-8 text-pink-400 mx-auto animate-spin" />
              <p className="text-sm text-white/60 mt-3">Loading</p>
            </div>
            <div className="p-6 bg-purple-800 rounded-3xl text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              <p className="text-sm text-white/60 mt-3">Success</p>
            </div>
            <div className="p-6 bg-purple-800 rounded-3xl text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-sm text-white/60 mt-3">Error</p>
            </div>
          </Grid>
        </Section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-white/30">Hactually Design System v1.0</p>
        </div>
      </footer>
    </div>
  );
}
