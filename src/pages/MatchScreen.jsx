import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

/**
 * Match Screen - "This is hactually happenning"
 * Celebration screen when two users match
 */

const MATCH_DATA = {
  user1: {
    name: 'Priya',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  },
  user2: {
    name: 'Marcus',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
};

// Background sparkles
const SPARKLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 80,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
}));

// Orbiting particles around countdown
const ORBIT_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  angle: (i / 12) * 360,
  size: Math.random() * 3 + 2,
  radius: 55 + Math.random() * 15,
  duration: 4 + Math.random() * 2,
  delay: Math.random() * 2,
}));

export default function MatchScreen() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = React.useState(3);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#4a0d1a] via-[#2d0a10] to-[#0d0304]">

      {/* Ambient glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-orange-500/10 rounded-full blur-[100px]" />

      {/* Background sparkles */}
      {SPARKLES.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: 'rgba(251, 191, 36, 0.9)',
            boxShadow: `0 0 ${s.size * 3}px rgba(251, 191, 36, 0.6)`,
            animation: `sparkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Interlocking Ring Avatars */}
      <div className="relative z-10 flex items-center justify-center mb-6">
        {/* Left Ring */}
        <div className="relative w-[110px] h-[110px]">
          <div className="absolute inset-[-6px] rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-50 blur-md" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 p-[3px]">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={MATCH_DATA.user1.photo}
                alt={MATCH_DATA.user1.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Ring */}
        <div className="relative w-[110px] h-[110px] -ml-5">
          <div className="absolute inset-[-6px] rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-50 blur-md" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 p-[3px]">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={MATCH_DATA.user2.photo}
                alt={MATCH_DATA.user2.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="relative z-10 text-center mb-6 px-6">
        <h1 className="text-[26px] font-bold text-white leading-tight">
          This is hactually
        </h1>
        <h1 className="text-[26px] font-bold text-white mb-2 leading-tight">
          happenning.
        </h1>
        <p className="text-white/50 text-[15px]">You've both liked each other.</p>
      </div>

      {/* Countdown with orbiting particles */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-orange-400/60 text-sm mb-6 tracking-wider">Chat starts in...</p>

        {/* Countdown container */}
        <div className="relative w-36 h-36 flex items-center justify-center">

          {/* Orbiting particles */}
          {ORBIT_PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: '#fbbf24',
                boxShadow: `0 0 ${p.size * 2}px rgba(251, 191, 36, 0.8)`,
                animation: `orbit ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
                transformOrigin: 'center',
                '--orbit-radius': `${p.radius}px`,
                '--start-angle': `${p.angle}deg`,
              }}
            />
          ))}

          {/* Glow ring */}
          <div className="absolute inset-4 rounded-full border border-orange-500/20" />
          <div className="absolute inset-2 rounded-full border border-orange-500/10" />

          {/* Inner circle with number */}
          <div className="relative w-[80px] h-[80px] rounded-full bg-gradient-to-b from-[#3d1515] to-[#1a0505] flex items-center justify-center border border-orange-600/30 shadow-lg shadow-orange-500/20">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-500">
              {countdown}
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => navigate('/flows')}
        className="relative z-10 mt-10 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-95"
      >
        <MessageCircle className="w-4 h-4" />
        Start chatting
      </button>

      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(var(--start-angle)) translateX(var(--orbit-radius)) rotate(calc(-1 * var(--start-angle)));
          }
          to {
            transform: rotate(calc(var(--start-angle) + 360deg)) translateX(var(--orbit-radius)) rotate(calc(-1 * (var(--start-angle) + 360deg)));
          }
        }
      `}</style>
    </div>
  );
}
