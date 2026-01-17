import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Heart, Clock, Users, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Onboarding Screen - Beautiful full-height slides with tilted cards
 */

const PROFILES = [
  {
    name: 'Sophia',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
  },
  {
    name: 'Hala',
    age: 26,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    tags: ['Entrepreneur', 'Foodie'],
    verified: true,
    nearby: true,
  },
  {
    name: 'Marcus',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
];

const RADAR_USERS = [
  { photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', x: 70, y: -60 },
  { photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', x: -65, y: 50 },
  { photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', x: 55, y: 65 },
  { photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', x: -50, y: -45 },
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);
  const totalSlides = 6;

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setSlide(index);
    }
  };

  const next = () => goToSlide(slide + 1);
  const prev = () => goToSlide(slide - 1);

  const finish = () => {
    localStorage.setItem('hactually-onboarding-seen', 'true');
    navigate('/auth/login');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-purple-900 via-purple-950 to-black overflow-hidden relative">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 flex-shrink-0">
        {slide > 0 ? (
          <button
            onClick={prev}
            className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronRight className="h-5 w-5 text-white/80 rotate-180" />
          </button>
        ) : (
          <div className="h-9 w-9" />
        )}
        {slide < totalSlides - 1 && (
          <button
            onClick={finish}
            className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Content Area - Takes remaining space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0">

        {/* SLIDE 0 & 1: Profile Cards */}
        {(slide === 0 || slide === 1) && (
          <div className="flex flex-col items-center w-full">
            {/* Title */}
            <h1 className="text-2xl font-light text-white text-center mb-2 leading-tight">
              {slide === 0 ? (
                <>Meet real people<br />around you right now</>
              ) : (
                <>Go ahead.<br />Try to swipe.</>
              )}
            </h1>
            {slide === 1 && (
              <p className="text-white/50 text-sm mb-4">Can't? That's the point.</p>
            )}

            {/* Cards Stack */}
            <div className="relative w-full h-[320px] flex items-center justify-center mt-4">
              {/* Left Card */}
              <div
                className={cn(
                  "absolute w-[140px] h-[200px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300",
                  slide === 1 ? "opacity-30 scale-90" : "opacity-80"
                )}
                style={{
                  left: '10%',
                  transform: 'rotate(-12deg) translateY(20px)',
                  zIndex: 1,
                }}
              >
                <img
                  src={PROFILES[0].photo}
                  alt={PROFILES[0].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-medium">{PROFILES[0].name}, {PROFILES[0].age}</span>
                </div>
              </div>

              {/* Center Card (Main) */}
              <div
                className={cn(
                  "absolute w-[180px] h-[260px] rounded-2xl overflow-hidden transition-all duration-300",
                  slide === 1 ? "opacity-40 scale-95" : ""
                )}
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(236,72,153,0.3)',
                }}
              >
                <img
                  src={PROFILES[1].photo}
                  alt={PROFILES[1].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-transparent to-transparent" />

                {/* Nearby Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-pink-500 rounded-full px-2 py-1">
                  <MapPin className="h-3 w-3 text-white" />
                  <span className="text-[10px] text-white font-medium">Near you</span>
                </div>

                {/* Profile Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-lg">{PROFILES[1].name}, {PROFILES[1].age}</span>
                    <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PROFILES[1].tags.map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium",
                          i === 0 ? "bg-pink-500 text-white" : "bg-white/20 text-white/90"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Card */}
              <div
                className={cn(
                  "absolute w-[140px] h-[200px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300",
                  slide === 1 ? "opacity-30 scale-90" : "opacity-80"
                )}
                style={{
                  right: '10%',
                  transform: 'rotate(12deg) translateY(20px)',
                  zIndex: 1,
                }}
              >
                <img
                  src={PROFILES[2].photo}
                  alt={PROFILES[2].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-medium">{PROFILES[2].name}, {PROFILES[2].age}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: Didn't work? */}
        {slide === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center mb-8 backdrop-blur-sm">
              <Heart className="h-12 w-12 text-pink-400" />
            </div>
            <h1 className="text-3xl font-light text-white mb-3">Didn't work?</h1>
            <p className="text-xl text-white/60">This time it's real.</p>
          </div>
        )}

        {/* SLIDE 3: Timeline */}
        {slide === 3 && (
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center mb-8 backdrop-blur-sm">
              <Clock className="h-12 w-12 text-pink-400" />
            </div>
            <h1 className="text-2xl font-light text-white mb-8 leading-tight">
              Dating apps make<br />you wait days
            </h1>

            {/* Timeline visualization */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-white/30" />
                <span className="text-white/40 text-xs mt-2">7 days</span>
              </div>
              <div className="w-8 h-px bg-white/20" />
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-white/40" />
                <span className="text-white/40 text-xs mt-2">3 days</span>
              </div>
              <div className="w-8 h-px bg-gradient-to-r from-white/20 to-pink-500/50" />
              <div className="flex flex-col items-center">
                <div className="h-4 w-4 rounded-full bg-pink-500 animate-pulse shadow-lg shadow-pink-500/50" />
                <span className="text-pink-400 text-xs mt-2 font-bold">NOW</span>
              </div>
            </div>

            <p className="text-white/60">Hactually makes it happen now.</p>
          </div>
        )}

        {/* SLIDE 4: Radar */}
        {slide === 4 && (
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center mb-6 backdrop-blur-sm">
              <Users className="h-12 w-12 text-pink-400" />
            </div>
            <h1 className="text-2xl font-light text-white mb-8 leading-tight">
              Real people.<br />Real time.
            </h1>

            {/* Radar visualization */}
            <div className="relative w-52 h-52 mb-6">
              {/* Radar rings */}
              <div className="absolute inset-0 rounded-full border border-pink-500/10" />
              <div className="absolute inset-4 rounded-full border border-pink-500/15" />
              <div className="absolute inset-8 rounded-full border border-pink-500/20" />
              <div className="absolute inset-12 rounded-full border border-pink-500/25" />

              {/* Center (You) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-semibold shadow-xl shadow-pink-500/40 z-10">
                You
              </div>

              {/* Other users */}
              {RADAR_USERS.map((user, i) => (
                <div
                  key={i}
                  className="absolute h-10 w-10 rounded-full overflow-hidden border-2 border-white/40 shadow-lg animate-pulse"
                  style={{
                    top: `calc(50% + ${user.y}px - 20px)`,
                    left: `calc(50% + ${user.x}px - 20px)`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  <img src={user.photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <p className="text-white/60">Only see those around right now</p>
          </div>
        )}

        {/* SLIDE 5: Location Permission */}
        {slide === 5 && (
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center mb-8 backdrop-blur-sm">
              <Sparkles className="h-12 w-12 text-pink-400" />
            </div>
            <h1 className="text-2xl font-light text-white mb-4 leading-tight">
              Meet the ones<br />you almost missed
            </h1>
            <p className="text-white/50 text-sm mb-8 max-w-[250px]">
              Enable location to discover people at venues near you
            </p>

            <button
              onClick={finish}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold text-lg shadow-xl shadow-pink-500/30 flex items-center gap-2 active:scale-95 transition-transform"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </button>

            <p className="text-white/40 text-xs mt-6">We never track. We only connect.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between flex-shrink-0">
        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                slide === i
                  ? "w-6 bg-pink-500"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Next button */}
        {slide < totalSlides - 1 && (
          <button
            onClick={next}
            className="flex items-center gap-1 text-white/80 text-sm font-medium hover:text-white transition-colors active:scale-95"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
