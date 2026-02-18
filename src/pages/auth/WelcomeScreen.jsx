import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { cn } from '../../lib/utils';

/**
 * Onboarding Welcome Screen
 * Deep blue theme with horizontally scrolling profiles
 */

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

const SLIDES = [
  {
    lines: ["You've", "shared a look with someone before."],
    video: "/Hactually%20Videos/Video_1.mov",
  },
  {
    lines: ["The moment was real. Acting on it wasn't easy."],
    video: "/Hactually%20Videos/Video_2.mov",
  },
  {
    lines: ["continue the moment with hactually"],
    showProfiles: true,
    hasShimmer: true,
    centered: true,
    smallerFont: true,
  },
  {
    lines: ["Meet the ones", "you almost missed!"],
    video: "/Hactually%20Videos/Video_4.mov",
    videoAlign: 'right',
    slowMo: true,
    isFinal: true,
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

const NUM_LAYERS = 5; // Staggered menu layers

// Gradient colors for the staggered layers (from ReactBits style)
const LAYER_COLORS = [
  '#4752C4',
  '#5865F2',
  '#6B75F5',
  '#7C85F7',
  '#8D94F9',
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const pauseStartRef = React.useRef(null);
  const elapsedBeforePauseRef = React.useRef(0);
  const videoRefs = React.useRef([]);
  const layerRefs = React.useRef([]);
  const transitionTimelineRef = React.useRef(null);
  const totalSlides = SLIDES.length;

  // Pause/play videos when holding
  React.useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) {
        if (isPaused) {
          video.pause();
        } else {
          video.play().catch(() => {}); // Ignore autoplay errors
        }
      }
    });
  }, [isPaused]);

  // Auto-advance timer with smooth progress (pauses when holding)
  React.useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    elapsedBeforePauseRef.current = 0;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime + elapsedBeforePauseRef.current;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && slide < totalSlides - 1) {
        setSlide(s => s + 1);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [slide, totalSlides, isPaused]);

  // Handle press and hold to pause (like Instagram)
  const handlePointerDown = (e) => {
    setIsPaused(true);
    pauseStartRef.current = Date.now();
    // Store current progress as elapsed time
    elapsedBeforePauseRef.current = (progress / 100) * SLIDE_DURATION;
  };

  const handlePointerUp = (e) => {
    if (isPaused) {
      setIsPaused(false);
    }
  };

  const goToSlide = (index) => {
    setSlide(index);
    setProgress(0);
  };

  const next = () => {
    if (slide < totalSlides - 1) {
      goToSlide(slide + 1);
    }
  };

  const prev = () => {
    if (slide > 0) {
      goToSlide(slide - 1);
    }
  };

  // Handle tap navigation like Instagram stories (only if not a long press)
  const tapStartRef = React.useRef(null);

  const handleTapStart = (e) => {
    tapStartRef.current = Date.now();
    handlePointerDown(e);
  };

  const handleTapEnd = (e) => {
    handlePointerUp(e);

    // Only navigate if it was a quick tap (less than 200ms)
    const tapDuration = Date.now() - (tapStartRef.current || 0);
    if (tapDuration < 200) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const isLeftSide = x < rect.width / 2;

      if (isLeftSide) {
        prev();
      } else {
        next();
      }
    }
  };

  const finish = () => {
    localStorage.setItem('hactually-onboarding-seen', 'true');
    setIsTransitioning(true);
  };

  // Run GSAP animation after transition layers are mounted
  React.useEffect(() => {
    if (!isTransitioning) return;

    // Small delay to ensure refs are populated
    const timer = setTimeout(() => {
      const tl = gsap.timeline();
      transitionTimelineRef.current = tl;

      // Animate layers in from left with stagger (slightly slower)
      tl.to(layerRefs.current, {
        x: '0%',
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.in',
        onComplete: () => {
          // Navigate immediately when bars fully cover - replace to avoid back issues
          navigate('/auth/options', { state: { fromTransition: true }, replace: true });
        }
      });
    }, 10);

    return () => clearTimeout(timer);
  }, [isTransitioning, navigate]);

  const currentSlide = SLIDES[slide];

  return (
    <div
      className="h-full w-full flex flex-col relative overflow-hidden bg-[#5865F2] font-sans"
      onPointerDown={handleTapStart}
      onPointerUp={handleTapEnd}
      onPointerLeave={handlePointerUp}
    >
      {/* Video Backgrounds with fade transition */}
      {SLIDES.map((s, i) => s.video && (
        <div key={s.video} className="absolute inset-0 z-0">
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
              if (el && s.slowMo) el.playbackRate = 0.5;
            }}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
            style={{
              opacity: slide === i ? 1 : 0,
              objectFit: 'cover',
              objectPosition: s.videoAlign === 'right' ? '70% center' : 'center center',
            }}
          >
            <source src={s.video.replace('.mov', '.mp4')} type="video/mp4" />
            <source src={s.video} type="video/quicktime" />
          </video>
          {/* Progressive blur layers from bottom */}
          {[...Array(6)].map((_, blurIdx) => (
            <div
              key={blurIdx}
              className="absolute left-0 right-0 transition-opacity duration-700 ease-in-out pointer-events-none"
              style={{
                opacity: slide === i ? 1 : 0,
                bottom: 0,
                height: `${15 + blurIdx * 8}%`,
                backdropFilter: `blur(${(6 - blurIdx) * 4}px)`,
                WebkitBackdropFilter: `blur(${(6 - blurIdx) * 4}px)`,
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
          ))}
        </div>
      ))}


      {/* Marquee, shimmer, and blur reveal animation keyframes */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #E05A3D 0%, #E05A3D 40%, #D9081E 50%, #E05A3D 60%, #E05A3D 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes blurReveal {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }
        .blur-reveal-word {
          display: inline-block;
          animation: blurReveal 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes gradientMove {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .profile-row {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        .profile-row-1 { animation-delay: 0ms; }
        .profile-row-2 { animation-delay: 100ms; }
        .profile-row-3 { animation-delay: 200ms; }
        .profile-row-4 { animation-delay: 300ms; }
      `}</style>

      {/* Top gradient overlay - darker blue */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(30, 40, 80, 0.9) 0%, rgba(88, 101, 242, 0) 100%)',
        }}
      />

      {/* Instagram Stories style progress bars - with safe area and matching padding */}
      <div className="relative z-20 flex gap-1 w-full px-4 mt-6" style={{ paddingTop: 'max(env(safe-area-inset-top), 24px)' }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
            className="flex-1 h-1 rounded-full bg-[#C8E3F4]/30 overflow-hidden cursor-pointer"
          >
            <div
              className="h-full rounded-full bg-[#C8E3F4]"
              style={{
                width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%',
                transition: i === slide ? 'none' : 'width 0.3s ease'
              }}
            />
          </div>
        ))}
      </div>

      {/* Logo at top left - like Instagram stories */}
      <div className="relative z-20 flex items-center px-4 pt-4 pb-4 animate-fade-in">
        <img
          src="/Updated%20Logo.svg"
          alt="Hactually"
          className="h-8 w-auto"
        />
      </div>

      {/* Content area for profiles slide - flex container for true centering */}
      {currentSlide.showProfiles ? (
        <div className="flex-1 flex flex-col relative z-10 pb-6" style={{ animation: 'fadeIn 0.8s ease-out forwards' }}>
          {/* Top Profile Rows */}
          <div
            key={`profiles-top-${slide}`}
            className="flex flex-col gap-3"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
            }}
          >
            {/* Row 1 - scrolls left */}
            <div className="overflow-hidden profile-row profile-row-1">
              <div
                className="flex gap-3"
                style={{ animation: 'marqueeLeft 40s linear infinite', width: 'max-content' }}
              >
                {[...PROFILE_IMAGES, ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
                  <div key={`r1-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8E3F4]/25">
                    <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - scrolls right */}
            <div className="overflow-hidden profile-row profile-row-2">
              <div
                className="flex gap-3"
                style={{ animation: 'marqueeRight 50s linear infinite', width: 'max-content' }}
              >
                {[...PROFILE_IMAGES.slice(4), ...PROFILE_IMAGES.slice(0, 4), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
                  <div key={`r2-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8E3F4]/25">
                    <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Centered Text */}
          <div className="flex-1 flex items-center justify-center px-4 py-4">
            <div
              key={slide}
              className="text-[#C8E3F4] font-bold leading-tight font-sans text-center text-[26px]"
            >
              {currentSlide.lines.map((line, lineIdx) => (
                <div key={lineIdx}>
                  {line.split(' ').map((word, i) => {
                    const isHactually = word.toLowerCase() === 'hactually';
                    const totalPrevWords = currentSlide.lines.slice(0, lineIdx).join(' ').split(' ').filter(w => w).length;
                    return (
                      <React.Fragment key={`${lineIdx}-${i}`}>
                        <span
                          className={`blur-reveal-word ${isHactually ? 'shimmer-text' : ''}`}
                          style={{ animationDelay: `${(totalPrevWords + i) * 100}ms` }}
                        >
                          {word}
                        </span>
                        <span> </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Profile Rows */}
          <div
            key={`profiles-bottom-${slide}`}
            className="flex flex-col gap-3"
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
            }}
          >
            {/* Row 3 - scrolls left */}
            <div className="overflow-hidden profile-row profile-row-3">
              <div
                className="flex gap-3"
                style={{ animation: 'marqueeLeft 55s linear infinite', width: 'max-content' }}
              >
                {[...PROFILE_IMAGES.slice(2), ...PROFILE_IMAGES.slice(0, 2), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
                  <div key={`r3-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8E3F4]/25">
                    <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 4 - scrolls right */}
            <div className="overflow-hidden profile-row profile-row-4">
              <div
                className="flex gap-3"
                style={{ animation: 'marqueeRight 35s linear infinite', width: 'max-content' }}
              >
                {[...PROFILE_IMAGES.slice(6), ...PROFILE_IMAGES.slice(0, 6), ...PROFILE_IMAGES, ...PROFILE_IMAGES].map((src, i) => (
                  <div key={`r4-${i}`} className="h-24 w-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C8E3F4]/25">
                    <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Spacer to push content down */}
          <div className="flex-1" />

          {/* Text Content - bottom left */}
          <div className={`relative z-10 px-4 ${currentSlide.isFinal ? 'mb-4' : 'pb-4'}`}>
            <div
              key={slide}
              className={`text-[#C8E3F4] font-bold leading-tight font-sans text-left text-[32px]`}
            >
              {currentSlide.lines.map((line, lineIdx) => (
                <div key={lineIdx}>
                  {line.split(' ').map((word, i) => {
                    const totalPrevWords = currentSlide.lines.slice(0, lineIdx).join(' ').split(' ').filter(w => w).length;
                    return (
                      <React.Fragment key={`${slide}-${lineIdx}-${i}`}>
                        <span
                          className="blur-reveal-word"
                          style={{ animationDelay: `${(totalPrevWords + i) * 80}ms` }}
                        >
                          {word}
                        </span>
                        <span> </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom section - button only on final slide */}
      <div className={`relative z-10 px-4 ${currentSlide.isFinal ? 'pb-8 pt-4' : ''}`}>
        {currentSlide.isFinal && (
          <div className="w-full relative h-12 rounded-full overflow-hidden">
            {/* Animated gradient border */}
            <div
              className="absolute inset-0 rounded-full animate-gradient-shift"
              style={{
                background: 'linear-gradient(90deg, #D9081E, #E0593D, #FF7F5C, #D9081E)',
                backgroundSize: '300% 100%',
                animation: 'gradientMove 3s linear infinite',
              }}
            />
            {/* Transparent inner (outline effect) */}
            <div
              className="absolute rounded-full"
              style={{
                inset: '2px',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(10px)',
              }}
            />

            <button
              onClick={(e) => { e.stopPropagation(); finish(); }}
              className="absolute inset-0 z-10 flex items-center justify-center select-none active:opacity-80 transition-opacity"
            >
              <span className="text-xs text-[#C8E3F4] font-bold uppercase tracking-widest font-sans">
                Start Spotting
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Staggered menu transition effect */}
      {isTransitioning && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
          {LAYER_COLORS.map((color, i) => (
            <div
              key={i}
              ref={(el) => (layerRefs.current[i] = el)}
              className="absolute inset-0"
              style={{
                transform: 'translateX(-100%)',
                backgroundColor: color,
                zIndex: NUM_LAYERS - i,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
