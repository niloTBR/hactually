/**
 * ============================================================================
 * HACTUALLY 2.0 DESIGN SYSTEM - STYLE GUIDE
 * ============================================================================
 *
 * A comprehensive showcase of the Hactually 2.0 design system featuring:
 * - Colours (4 colors: Blue, Orange, Brown, Green - 2 shades each + gradients)
 * - Typography (Ezra font family - 4 weights)
 * - Buttons
 * - Inputs
 * - Badges
 * - Tabs
 * - Icons
 * - Map Components
 */

import React, { useState } from 'react';
import {
  MapPin, Heart, MessageCircle, User, Search, Settings, Bell,
  Home, Compass, Star, ChevronRight, ChevronLeft, X, Check,
  Plus, Minus, Eye, EyeOff, Camera, Image, Send, Filter,
  Clock, Calendar, Map, Navigation, Zap, Sparkles, Crown,
  Shield, Lock, Unlock, Mail, Phone, Globe, Share2, Bookmark,
  MoreHorizontal, MoreVertical, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  RefreshCw, Download, Upload, Edit, Trash2, Copy, ExternalLink,
  Palette, Type, MousePointer, FormInput, Tag, LayoutList, Grid3X3, MapPinned
} from 'lucide-react';

// ============================================================================
// NAVIGATION SECTIONS
// ============================================================================

const sections = [
  { id: 'logo', label: 'Logo', icon: Eye },
  { id: 'colours', label: 'Colours', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: MousePointer },
  { id: 'inputs', label: 'Inputs', icon: FormInput },
  { id: 'badges', label: 'Badges', icon: Tag },
  { id: 'tabs', label: 'Tabs', icon: LayoutList },
  { id: 'icons', label: 'Icons', icon: Grid3X3 },
  { id: 'map', label: 'Map Components', icon: MapPinned },
];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

const Sidebar = ({ activeSection, onNavigate }) => (
  <aside className="fixed left-6 top-6 bottom-6 w-56 bg-white rounded-2xl shadow-xl z-sidebar overflow-hidden">
    {/* Logo */}
    <div className="p-5 border-b border-brown-light/20">
      <span className="text-xl font-black text-blue font-sans">hactually</span>
    </div>

    {/* Navigation */}
    <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
      <ul className="space-y-1">
        {sections.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-moderate ${
                activeSection === id
                  ? 'bg-blue text-white'
                  : 'text-brown hover:bg-blue-light/30 hover:text-blue'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

// ============================================================================
// SECTION WRAPPER COMPONENT
// ============================================================================

const Section = ({ id, title, description, children, className = '' }) => (
  <section id={id} className={`mb-20 scroll-mt-8 ${className}`}>
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-black mb-2">{title}</h2>
      {description && (
        <p className="text-brown text-lg">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const SubSection = ({ title, children, className = '' }) => (
  <div className={`mb-8 ${className}`}>
    <h3 className="text-xl font-semibold text-blue-dark mb-4">{title}</h3>
    {children}
  </div>
);

// ============================================================================
// HACTUALLY LOGO COMPONENT
// ============================================================================

const HactuallyLogo = ({ className = '', color = 'white', size = 80, useGradient = false }) => (
  <svg
    viewBox="0 0 192 128"
    width={size}
    height={size * (128/192)}
    className={className}
    fill={useGradient ? "url(#logoGradient)" : color}
  >
    {useGradient && (
      <defs>
        <linearGradient id="logoGradient" x1="128" y1="64" x2="128" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0593D"/>
          <stop offset="1" stopColor="#D9081E"/>
        </linearGradient>
      </defs>
    )}
    {/* Left shape - rectangle with quarter circle cut from bottom-right */}
    <path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64Z" />
    {/* Right shape - rectangle with quarter circle cut from top-left */}
    <path d="M192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" />
  </svg>
);

// ============================================================================
// HACTUALLY BANNER COMPONENT
// ============================================================================

const HactuallyBanner = ({
  imageSrc = '/images/brooke-cagle-Ss3wTFJPAVY-unsplash.jpg'
}) => (
  <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-orange-light">
    {/* Single image masked into logo shape */}
    <div className="absolute inset-y-0 right-0 w-[60%] overflow-hidden">
      <svg
        viewBox="0 0 192 128"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-y-0 right-0 h-full"
      >
        <defs>
          {/* Combined logo shape clip path */}
          <clipPath id="bannerMask">
            <path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64Z" />
            <path d="M192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" />
          </clipPath>
        </defs>
        {/* Single image across both shapes */}
        <image
          href={imageSrc}
          x="0"
          y="0"
          width="192"
          height="128"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#bannerMask)"
        />
      </svg>
    </div>

    {/* Logo text */}
    <span className="absolute left-12 top-1/2 -translate-y-1/2 text-7xl font-black text-orange font-sans">hactually</span>
  </div>
);

const HactuallyBannerBlue = () => (
  <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-blue">
    {/* Logo shape on the left - same as first banner */}
    <div className="absolute inset-y-0 left-0 w-[60%] overflow-hidden">
      <svg
        viewBox="0 0 192 128"
        preserveAspectRatio="xMinYMid slice"
        className="absolute inset-y-0 left-0 h-full"
      >
        <defs>
          <linearGradient id="bannerBlueGradient" x1="128" y1="64" x2="128" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E0593D"/>
            <stop offset="1" stopColor="#D9081E"/>
          </linearGradient>
        </defs>
        <path d="M96 64C96 99.3462 67.3462 128 32 128H0V0H96V64Z" fill="url(#bannerBlueGradient)" />
        <path d="M192 128H96V64C96 28.6538 124.654 0 160 0H192V128Z" fill="url(#bannerBlueGradient)" />
      </svg>
    </div>

    {/* Text on the right - mirrored from first banner */}
    <span className="absolute right-12 top-1/2 -translate-y-1/2 text-7xl font-black text-blue-light z-10 font-sans">hactually</span>
  </div>
);

// ============================================================================
// COLOUR SWATCH COMPONENT
// ============================================================================

const ColorSwatch = ({ name, hex, textColor = 'text-white', isGradient = false, gradientClass = '' }) => (
  <div className="flex flex-col">
    <div
      className={`h-16 rounded-xl shadow-sm ${isGradient ? gradientClass : ''}`}
      style={!isGradient ? { backgroundColor: hex } : undefined}
    />
    <span className="text-xs text-brown mt-1.5 font-medium">{name}</span>
    {hex && <span className="text-xs text-brown/60 font-mono">{hex}</span>}
  </div>
);

const ColorGroup = ({ name, colors }) => (
  <div>
    <h4 className="text-xs font-bold text-brown-dark mb-3 uppercase tracking-wider">{name}</h4>
    <div className="grid grid-cols-3 gap-3">
      {colors.map((item, index) => (
        <ColorSwatch
          key={index}
          name={item.name}
          hex={item.hex}
          textColor={item.textColor || 'text-white'}
          isGradient={item.isGradient}
          gradientClass={item.gradientClass}
        />
      ))}
    </div>
  </div>
);

// ============================================================================
// BUTTON COMPONENT (Fully Rounded, Single Size)
// ============================================================================

const Button = ({
  variant = 'blue',
  outline = false,
  children,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full h-11 px-5 text-sm gap-2 transition-all duration-moderate touch-feedback focus:outline-none';

  const solidVariants = {
    blue: 'bg-blue text-white hover:bg-blue-dark active:opacity-90 shadow-glow-blue focus:ring-2 focus:ring-blue focus:ring-offset-2',
    orange: 'bg-orange text-white hover:bg-orange-dark active:opacity-90 shadow-glow-orange focus:ring-2 focus:ring-orange focus:ring-offset-2',
    brown: 'bg-brown text-white hover:bg-brown-dark active:opacity-90 shadow-glow-brown focus:ring-2 focus:ring-brown focus:ring-offset-2',
    green: 'bg-green text-white hover:bg-green-dark active:opacity-90 shadow-glow-green focus:ring-2 focus:ring-green focus:ring-offset-2',
  };

  const textColors = {
    blue: 'text-blue',
    orange: 'text-orange',
    brown: 'text-brown',
    green: 'text-green',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  if (outline) {
    return (
      <div className="relative inline-flex rounded-full p-[1px] overflow-hidden">
        <span
          className="absolute inset-[-100%] animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, #5865F2, #E05A3D, #4A7C7C, #8A8B73, #5865F2)',
          }}
        />
        <button
          className={`relative ${baseStyles} bg-brown-mid ${textColors[variant]} ${disabledStyles} ${className}`}
          disabled={disabled}
          {...props}
        >
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${baseStyles} ${solidVariants[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

const Input = ({
  label,
  placeholder,
  type = 'text',
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const baseStyles = 'w-full h-12 rounded-full border transition-all duration-moderate focus:outline-none focus:ring-2 focus:ring-offset-1 font-medium placeholder:text-brown/50 px-5';

  const state = disabled
    ? 'border-brown-light/30 bg-brown-light/30 text-brown/50 cursor-not-allowed'
    : 'border-brown-light bg-white text-black focus:border-blue focus:ring-blue-light';

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-bold text-black mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown">
            <Icon size={18} />
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseStyles} ${state} ${Icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brown hover:text-blue"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

const Badge = ({ variant = 'blue', children, icon: Icon, className = '' }) => {
  const baseStyles = 'inline-flex items-center font-bold rounded-full px-2.5 py-1 text-xs gap-1';

  const variants = {
    blue: 'bg-blue-light text-blue',
    orange: 'bg-orange-light text-orange',
    brown: 'bg-brown-light text-brown',
    green: 'bg-green-light text-green',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

// ============================================================================
// TAB COMPONENT
// ============================================================================

const Tabs = ({ tabs, activeTab, onChange, variant = 'default' }) => {
  const variants = {
    default: {
      container: 'flex gap-1 p-1 bg-brown-light/30 rounded-full',
      tab: 'flex-1 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-moderate',
      active: 'bg-blue text-white shadow-sm',
      inactive: 'text-brown hover:text-blue',
    },
    pills: {
      container: 'flex gap-2',
      tab: 'px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-moderate',
      active: 'bg-blue text-white shadow-glow-blue',
      inactive: 'text-brown hover:bg-blue-light hover:text-blue',
    },
    underline: {
      container: 'flex gap-6 border-b-2 border-brown-light/30',
      tab: 'pb-3 text-sm font-bold transition-all duration-moderate border-b-2 -mb-0.5',
      active: 'text-blue border-blue',
      inactive: 'text-brown border-transparent hover:text-blue hover:border-blue-light',
    },
  };

  const style = variants[variant];

  return (
    <div className={style.container}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`${style.tab} ${activeTab === index ? style.active : style.inactive}`}
        >
          {tab.icon && <tab.icon size={16} className="mr-2 inline-block" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// MAP COMPONENTS
// ============================================================================

const MapMarker = ({ type = 'default', active = false, count }) => {
  const types = {
    default: active
      ? 'bg-blue text-white shadow-glow-blue'
      : 'bg-white text-blue shadow-md border-2 border-blue-light',
    user: 'bg-orange text-white shadow-glow-orange',
    venue: 'bg-green text-white shadow-glow-green',
    cluster: 'bg-brown text-white shadow-lg',
  };

  return (
    <div className={`w-12 h-12 ${types[type]} rounded-full flex items-center justify-center transition-all duration-moderate`}>
      {count ? (
        <span className="text-sm font-bold">{count}</span>
      ) : type === 'user' ? (
        <User size={20} />
      ) : type === 'venue' ? (
        <MapPin size={20} />
      ) : (
        <MapPin size={20} />
      )}
    </div>
  );
};

const LocationCard = ({ name, distance, type, active = false }) => (
  <div className={`px-4 py-3 rounded-full transition-all duration-moderate ${
    active
      ? 'bg-white shadow-md'
      : 'bg-white/60 hover:bg-white hover:shadow-sm'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        type === 'venue' ? 'bg-green text-white' : 'bg-orange text-white'
      }`}>
        {type === 'venue' ? <MapPin size={14} /> : <User size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-black truncate">{name}</h4>
      </div>
      <span className="text-xs text-brown font-medium flex-shrink-0">{distance}</span>
      <ChevronRight size={16} className="text-brown/50 flex-shrink-0" />
    </div>
  </div>
);

// ============================================================================
// MAIN STYLE GUIDE COMPONENT
// ============================================================================

export default function StyleGuide() {
  const [activeSection, setActiveSection] = useState('logo');
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabPills, setActiveTabPills] = useState(0);
  const [activeTabUnderline, setActiveTabUnderline] = useState(0);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Color palette data - 4 colors, 2 shades each + gradients
  const colorPalette = {
    blue: [
      { name: 'Light', hex: '#C8E3F4' },
      { name: 'Default', hex: '#5865F2' },
      { name: 'Gradient', isGradient: true, gradientClass: 'bg-gradient-blue' },
    ],
    orange: [
      { name: 'Light', hex: '#F5C4C4' },
      { name: 'Default', hex: '#E05A3D' },
      { name: 'Gradient', isGradient: true, gradientClass: 'bg-gradient-orange' },
    ],
    brown: [
      { name: 'Light', hex: '#E5D9C3' },
      { name: 'Default', hex: '#8A8B73' },
      { name: 'Gradient', isGradient: true, gradientClass: 'bg-gradient-brown' },
    ],
    green: [
      { name: 'Light', hex: '#D4E4A5' },
      { name: 'Default', hex: '#4A7C7C' },
      { name: 'Gradient', isGradient: true, gradientClass: 'bg-gradient-green' },
    ],
  };

  const tabsData = [
    { label: 'Discover', icon: Compass },
    { label: 'Messages', icon: MessageCircle },
    { label: 'Profile', icon: User },
  ];

  const icons = [
    { icon: Heart, name: 'Heart' },
    { icon: MessageCircle, name: 'Message' },
    { icon: MapPin, name: 'MapPin' },
    { icon: User, name: 'User' },
    { icon: Search, name: 'Search' },
    { icon: Settings, name: 'Settings' },
    { icon: Bell, name: 'Bell' },
    { icon: Home, name: 'Home' },
    { icon: Compass, name: 'Compass' },
    { icon: Star, name: 'Star' },
    { icon: Camera, name: 'Camera' },
    { icon: Image, name: 'Image' },
    { icon: Send, name: 'Send' },
    { icon: Filter, name: 'Filter' },
    { icon: Clock, name: 'Clock' },
    { icon: Calendar, name: 'Calendar' },
    { icon: Map, name: 'Map' },
    { icon: Navigation, name: 'Navigation' },
    { icon: Zap, name: 'Zap' },
    { icon: Sparkles, name: 'Sparkles' },
    { icon: Crown, name: 'Crown' },
    { icon: Shield, name: 'Shield' },
    { icon: Lock, name: 'Lock' },
    { icon: Unlock, name: 'Unlock' },
    { icon: Mail, name: 'Mail' },
    { icon: Phone, name: 'Phone' },
    { icon: Globe, name: 'Globe' },
    { icon: Share2, name: 'Share' },
    { icon: Bookmark, name: 'Bookmark' },
    { icon: Edit, name: 'Edit' },
    { icon: Trash2, name: 'Trash' },
    { icon: Copy, name: 'Copy' },
  ];

  return (
    <div className="min-h-screen bg-brown-lighter">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto pl-72 pr-12 py-12">
        <div>

          {/* ================================================================
              LOGO SECTION
              ================================================================ */}
          <section id="logo" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Logo</h2>
              <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">App Icons</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square rounded-3xl bg-orange-light flex items-center justify-center">
                  <HactuallyLogo size={140} useGradient />
                </div>
                <div className="aspect-square rounded-3xl bg-blue-light flex items-center justify-center">
                  <HactuallyLogo size={140} color="#5865F2" />
                </div>
                <div className="aspect-square rounded-3xl bg-brown-light flex items-center justify-center">
                  <HactuallyLogo size={140} color="#6A6B5A" />
                </div>
                <div className="aspect-square rounded-3xl bg-green-light flex items-center justify-center">
                  <HactuallyLogo size={140} color="#3A6262" />
                </div>
              </div>

              <hr className="border-brown/20 my-8" />

              <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Banner</h4>
              <HactuallyBanner />

              <div className="mt-6" />
              <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Banner (Blue Variant)</h4>
              <HactuallyBannerBlue />

            </div>
          </section>

          {/* ================================================================
              COLOURS SECTION
              ================================================================ */}
          <section id="colours" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Colours</h2>

              {/* Primary */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Primary</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-24 rounded-xl bg-white flex items-center justify-center border border-brown-light/30">
                    <span className="text-lg font-black text-blue font-sans">hactually</span>
                  </div>
                  <div className="h-24 rounded-xl bg-blue-light flex items-center justify-center">
                    <span className="text-lg font-black text-blue font-sans">hactually</span>
                  </div>
                  <div className="h-24 rounded-xl bg-blue flex items-center justify-center">
                    <span className="text-lg font-black text-white font-sans">hactually</span>
                  </div>
                  <div className="h-24 rounded-xl bg-gradient-blue flex items-center justify-center">
                    <span className="text-lg font-black text-white font-sans">hactually</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-1.5">
                  <div className="flex flex-col"><span className="text-xs text-brown font-medium">White</span><span className="text-xs text-brown/60 font-mono">#FFFFFF</span></div>
                  <div className="flex flex-col"><span className="text-xs text-brown font-medium">Light</span><span className="text-xs text-brown/60 font-mono">#C8E3F4</span></div>
                  <div className="flex flex-col"><span className="text-xs text-brown font-medium">Default</span><span className="text-xs text-brown/60 font-mono">#5865F2</span></div>
                  <div className="flex flex-col"><span className="text-xs text-brown font-medium">Gradient</span></div>
                </div>
              </div>

              <hr className="border-brown/20 mb-8" />

              {/* Accents */}
              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Accents</h4>
                <div className="grid grid-cols-3 gap-8">
                  <ColorGroup name="Orange" colors={colorPalette.orange} />
                  <ColorGroup name="Olive" colors={colorPalette.brown} />
                  <ColorGroup name="Green" colors={colorPalette.green} />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              TYPOGRAPHY SECTION
              ================================================================ */}
          <section id="typography" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Typography</h2>

              {/* Font Family */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Font Family</h4>
                <p className="text-3xl font-black text-blue mb-2 font-sans">hactually</p>
                <p className="text-xs text-brown font-mono">font-family: 'Ezra', sans-serif</p>
              </div>

              <hr className="border-brown/20 mb-8" />

              {/* Font Weights */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Font Weights</h4>
                <div className="flex flex-wrap gap-6">
                  <div><span className="text-xl font-normal text-brown-dark">Regular</span><span className="text-xs text-brown ml-2">400</span></div>
                  <div><span className="text-xl font-medium text-brown-dark">Medium</span><span className="text-xs text-brown ml-2">500</span></div>
                  <div><span className="text-xl font-bold text-brown-dark">Bold</span><span className="text-xs text-brown ml-2">700</span></div>
                  <div><span className="text-xl font-black text-brown-dark">Black</span><span className="text-xs text-brown ml-2">900</span></div>
                </div>
              </div>

              <hr className="border-brown/20 mb-8" />

              {/* Type Scale */}
              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Type Scale</h4>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3"><span className="text-3xl font-black text-brown-dark">Display</span><span className="text-xs text-brown">40px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-2xl font-bold text-brown-dark">Heading</span><span className="text-xs text-brown">32px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-xl font-bold text-brown-dark">Title</span><span className="text-xs text-brown">24px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-lg font-medium text-brown-dark">Subtitle</span><span className="text-xs text-brown">20px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-base text-brown-dark">Body</span><span className="text-xs text-brown">16px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-sm text-brown-dark">Small</span><span className="text-xs text-brown">14px</span></div>
                  <div className="flex items-baseline gap-3"><span className="text-xs text-brown-dark">Caption</span><span className="text-xs text-brown">12px</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              BUTTONS SECTION
              ================================================================ */}
          <section id="buttons" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Buttons</h2>

              {/* Solid */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Solid</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="blue">Blue</Button>
                  <Button variant="orange">Orange</Button>
                  <Button variant="brown">Brown</Button>
                  <Button variant="green">Green</Button>
                </div>
              </div>

              <hr className="border-brown/20 mb-8" />

              {/* Outline */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Outline</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="blue" outline>Blue</Button>
                  <Button variant="orange" outline>Orange</Button>
                  <Button variant="brown" outline>Brown</Button>
                  <Button variant="green" outline>Green</Button>
                </div>
              </div>

              <hr className="border-brown/20 mb-8" />

              {/* With Icons */}
              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="blue" icon={Heart}>Like</Button>
                  <Button variant="orange" icon={Send} iconPosition="right">Send</Button>
                  <Button variant="green" icon={MapPin}>Location</Button>
                  <Button variant="brown" outline icon={Plus}>Add</Button>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              INPUTS SECTION
              ================================================================ */}
          <section id="inputs" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Inputs</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Input label="Email" placeholder="you@example.com" type="email" />
                  <Input label="Password" placeholder="Enter password" type="password" />
                  <Input label="Search" placeholder="Search..." icon={Search} />
                </div>
                <div className="space-y-4">
                  <Input label="Default" placeholder="Default state" />
                  <Input label="With Icon" placeholder="Search something..." icon={Search} />
                  <Input label="Disabled" placeholder="Cannot edit" disabled />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              BADGES SECTION
              ================================================================ */}
          <section id="badges" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Badges</h2>
              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Color Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="blue">Blue</Badge>
                  <Badge variant="orange">Orange</Badge>
                  <Badge variant="brown">Brown</Badge>
                  <Badge variant="green">Green</Badge>
                </div>
              </div>
              <hr className="border-brown/20 mb-8" />
              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="blue" icon={Star}>Featured</Badge>
                  <Badge variant="orange" icon={Zap}>Hot</Badge>
                  <Badge variant="brown" icon={MapPin}>Nearby</Badge>
                  <Badge variant="green" icon={Check}>Verified</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              TABS SECTION
              ================================================================ */}
          <section id="tabs" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Tabs</h2>

              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Segmented</h4>
                <Tabs tabs={tabsData} activeTab={activeTab} onChange={setActiveTab} variant="default" />
              </div>

              <hr className="border-brown/20 mb-8" />

              <div className="mb-8">
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Pills</h4>
                <Tabs tabs={tabsData} activeTab={activeTabPills} onChange={setActiveTabPills} variant="pills" />
              </div>

              <hr className="border-brown/20 mb-8" />

              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Underline</h4>
                <Tabs tabs={tabsData} activeTab={activeTabUnderline} onChange={setActiveTabUnderline} variant="underline" />
              </div>
            </div>
          </section>

          {/* ================================================================
              ICONS SECTION
              ================================================================ */}
          <section id="icons" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-brown-dark mb-8">Icons</h2>

              <div className="grid grid-cols-8 gap-4 mb-8">
                {icons.map(({ icon: Icon, name }, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 p-2">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-brown">{name}</span>
                  </div>
                ))}
              </div>

              <hr className="border-brown/20 mb-8" />

              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Icon Colors</h4>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-light flex items-center justify-center"><Star size={20} className="text-blue" /></div>
                  <div className="w-12 h-12 rounded-full bg-orange-light flex items-center justify-center"><Heart size={20} className="text-orange" /></div>
                  <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center"><Check size={20} className="text-green" /></div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center"><MapPin size={20} className="text-brown" /></div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              MAP COMPONENTS SECTION
              ================================================================ */}
          <section id="map" className="mb-16 scroll-mt-8">
            <div className="bg-brown-mid rounded-2xl p-8 space-y-8">
              <h2 className="text-2xl font-bold text-brown-dark">Map Components</h2>

              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Map Markers</h4>
                <div className="flex items-center gap-6">
                  <div className="text-center"><MapMarker type="default" /><p className="text-xs text-brown mt-2">Default</p></div>
                  <div className="text-center"><MapMarker type="default" active /><p className="text-xs text-brown mt-2">Active</p></div>
                  <div className="text-center"><MapMarker type="user" /><p className="text-xs text-brown mt-2">User</p></div>
                  <div className="text-center"><MapMarker type="venue" /><p className="text-xs text-brown mt-2">Venue</p></div>
                  <div className="text-center"><MapMarker type="cluster" count={12} /><p className="text-xs text-brown mt-2">Cluster</p></div>
                </div>
              </div>

              <hr className="border-brown/20" />

              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Location Cards</h4>
                <div className="grid grid-cols-2 gap-4">
                  <LocationCard name="The Grand Hotel" distance="0.3 km" type="venue" />
                  <LocationCard name="Sarah, 28" distance="0.5 km" type="user" active />
                </div>
              </div>

              <hr className="border-brown/20" />

              <div>
                <h4 className="text-xs font-bold text-brown-dark mb-4 uppercase tracking-wider">Map Controls</h4>
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col gap-1 bg-white rounded-full p-1">
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue hover:bg-blue-light"><Plus size={20} /></button>
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue hover:bg-blue-light"><Minus size={20} /></button>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-blue hover:bg-blue-light"><Navigation size={20} /></button>
                  <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-blue hover:bg-blue-light"><Filter size={20} /></button>
                  <button className="w-12 h-12 rounded-full bg-blue shadow-glow-blue flex items-center justify-center text-white"><Map size={20} /></button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
