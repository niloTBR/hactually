import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

/**
 * ============================================================================
 * HACTUALLY FLOWS - Based on Miro Tech Spec
 * ============================================================================
 */

const FLOW_SECTIONS = [
  {
    id: 'onboarding',
    title: 'Onboarding & Account Creation',
    description: 'Allows the user to understand the value proposition, securely create their account, and build a profile that attracts the right connections.',
    screens: [
      { id: '1A', name: 'See the app introduction and understand what Hactually is about', path: '/auth/welcome', active: true },
      { id: '1B', name: 'Sign up or log in with email', path: '/auth/options', active: true },
      { id: '1C', name: 'Set up my Hactually public profile', path: '/auth/profile-setup', active: true },
    ],
  },
  {
    id: 'home',
    title: 'Home & Discovery',
    description: 'Enables the user to find and explore venues where real people are right now, making it easy to decide where to go.',
    screens: [
      { id: '2A', name: 'Discover nearby venues on an interactive map', path: '/home', active: true },
      { id: '2B', name: 'See a helpful message when no venues are nearby' },
    ],
  },
  {
    id: 'venue',
    title: 'Venue Experience',
    description: 'Lets the user check into a location and engage with people in the same space.',
    screens: [
      { id: '3A', name: 'View details or activity on a venue' },
      { id: '3B', name: 'Check into a venue and see confirmation of my check-in' },
      { id: '3C', name: 'Chat publicly with everyone at the venue' },
    ],
  },
  {
    id: 'profiles',
    title: 'Profiles & Spotting',
    description: 'Gives the user a way to learn about someone and express interest, turning a spark into a real connection.',
    screens: [
      { id: '4A', name: 'See who else is checked into the same venue as me' },
      { id: '4B', name: 'Tap on someone to see their profile' },
      { id: '4C', name: 'Spot someone I\'m interested in' },
      { id: '4D', name: 'Receive a notification when someone Spots me' },
      { id: '4E', name: 'Decide to Spot them back or decline' },
    ],
  },
  {
    id: 'communication',
    title: 'Messaging',
    description: 'Provides a private space for matched users to get to know each other and plan to meet up in person.',
    screens: [
      { id: '5A', name: 'See all my conversations in one place' },
      { id: '5B', name: 'Have a private conversation with a match' },
      { id: '5C', name: 'Send photos and media in chat' },
    ],
  },
  {
    id: 'matches',
    title: 'Matches & Interest',
    description: 'Helps the user keep track of their connections and see who\'s interested in them at a glance.',
    screens: [
      { id: '6A', name: 'View all my current matches' },
      { id: '6B', name: 'See who has Spotted me (likes received)' },
      { id: '6C', name: 'Review Spots I\'ve sent to others' },
      { id: '6D', name: 'Unmatch with someone if it\'s not working out' },
    ],
  },
  {
    id: 'monetization',
    title: 'Premium & Purchases',
    description: 'Offers the user ways to stand out and get more from the app when they\'re ready to level up.',
    screens: [
      { id: '7A', name: 'Understand the benefits of premium features' },
      { id: '7B', name: 'Purchase credits for boosts and super spots' },
      { id: '7C', name: 'Choose a subscription plan that fits my needs' },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & My Profile',
    description: 'Puts the user in control of how they present themselves and how the app works for them.',
    screens: [
      { id: '8A', name: 'View or edit my Hactually public profile' },
      { id: '8B', name: 'Manage my privacy preferences' },
      { id: '8C', name: 'Manage my notification preferences' },
      { id: '8D', name: 'Manage my account' },
    ],
  },
];

/**
 * Accordion Flow Component
 */
function FlowAccordion({ flow, index, isExpanded, onToggle }) {
  const activeCount = flow.screens.filter(s => s.active).length;
  const totalCount = flow.screens.length;

  return (
    <div className="border border-brown-light/40 rounded-2xl overflow-hidden bg-white shadow-card">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-brown-lighter/50 transition-all text-left"
      >
        <span className="h-8 w-8 rounded-xl bg-blue text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-black font-bold text-sm">{flow.title}</span>
          <p className="text-brown text-xs mt-0.5">{flow.description}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-brown">
            <span className="text-green font-bold">{activeCount}</span>/{totalCount}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-brown" />
          ) : (
            <ChevronRight className="h-5 w-5 text-brown/40" />
          )}
        </div>
      </button>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="border-t border-brown-light/30 bg-brown-lighter/30">
          {flow.screens.length === 0 ? (
            <p className="px-4 py-6 text-brown/50 text-sm text-center">No screens yet</p>
          ) : (
            <ul className="divide-y divide-brown-light/20">
              {flow.screens.map((screen) => (
                <ScreenItem key={screen.id} screen={screen} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual Screen Item
 */
function ScreenItem({ screen }) {
  const isActive = screen.active;
  const hasPath = screen.path;
  const hasPrototype = screen.prototype;

  const content = (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-blue-light/10 transition-colors">
      {/* Screen ID */}
      <span className={cn(
        "w-10 text-xs font-mono text-center py-1 px-2 rounded-lg font-bold",
        isActive ? "bg-green-light text-green" : "bg-brown-light/50 text-brown"
      )}>
        {screen.id}
      </span>

      {/* Screen Name */}
      <span className={cn(
        "flex-1 text-sm",
        isActive ? "text-black font-medium" : "text-brown"
      )}>
        {screen.name}
      </span>

      {/* Status & Links */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {hasPrototype && (
          <a
            href={screen.prototype}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue hover:text-blue-dark flex items-center gap-1 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            Figma
          </a>
        )}
        {isActive ? (
          <span className="h-2.5 w-2.5 rounded-full bg-green" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-brown-light" />
        )}
      </div>
    </div>
  );

  if (hasPath && isActive) {
    return (
      <li>
        <Link to={screen.path} className="block">
          {content}
        </Link>
      </li>
    );
  }

  return <li>{content}</li>;
}

/**
 * Flows Screen - Accordion-based flow navigation
 */
export default function FlowsScreen() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  const [expandedFlow, setExpandedFlow] = React.useState(null);

  const toggleFlow = (flowId) => {
    setExpandedFlow(prev => prev === flowId ? null : flowId);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/welcome');
  };

  const totalScreens = FLOW_SECTIONS.reduce((acc, flow) => acc + flow.screens.length, 0);
  const builtScreens = FLOW_SECTIONS.reduce((acc, flow) =>
    acc + flow.screens.filter(s => s.active).length, 0
  );

  return (
    <div className="min-h-screen bg-brown-lighter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-brown-light/30 shadow-xs">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-blue">hactually</span>
            <p className="text-xs text-brown mt-0.5">User Stories — MVP</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/design-system"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-light/30 text-blue hover:bg-blue-light/50 transition-colors text-sm font-bold"
            >
              <Eye className="h-4 w-4" />
              <span>Design System</span>
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 text-orange hover:bg-orange/20 transition-colors text-sm font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green" />
            <span className="text-brown font-medium">Built ({builtScreens})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-brown-light" />
            <span className="text-brown/60">To Build ({totalScreens - builtScreens})</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-brown-light/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-blue rounded-full transition-all"
            style={{ width: `${(builtScreens / totalScreens) * 100}%` }}
          />
        </div>
        <p className="text-xs text-brown text-center font-medium">
          {Math.round((builtScreens / totalScreens) * 100)}% complete — {builtScreens}/{totalScreens} stories
        </p>

        {/* Flow Accordions */}
        <div className="space-y-3">
          {FLOW_SECTIONS.map((flow, index) => (
            <FlowAccordion
              key={flow.id}
              flow={flow}
              index={index}
              isExpanded={expandedFlow === flow.id}
              onToggle={() => toggleFlow(flow.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
