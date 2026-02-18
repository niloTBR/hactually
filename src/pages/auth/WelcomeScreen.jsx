import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const PROFILES = [
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
  { lines: ["You've", "shared a look with someone before."], video: '/Hactually%20Videos/Video_1.mp4' },
  { lines: ["The moment was real. Acting on it wasn't easy."], video: '/Hactually%20Videos/Video_2.mp4' },
  { lines: ["continue the moment", "with hactually"], profiles: true },
  { lines: ["Meet the ones", "you almost missed!"], video: '/Hactually%20Videos/Video_4.mp4', final: true },
];

const LAYERS = ['bg-blue-dark', 'bg-blue', 'bg-blue/80', 'bg-blue/60', 'bg-blue/40'];

const ProfileRow = ({ images, right, speed = 40 }) => (
  <div className="overflow-hidden">
    <div className={`flex gap-3 w-max ${right ? 'animate-marquee-right' : 'animate-marquee-left'}`} style={{ animationDuration: `${speed}s` }}>
      {[...images, ...images, ...images].map((src, i) => (
        <img key={i} src={src} alt="" className="h-24 w-24 rounded-full object-cover border-2 border-blue-light/25 shrink-0" loading="eager" />
      ))}
    </div>
  </div>
);

const BlurText = ({ lines, center }) => {
  let wordIndex = 0;
  return (
    <span className={`flex flex-col ${center ? 'items-center' : ''}`}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className={`flex flex-wrap gap-x-2 ${center ? 'justify-center' : ''}`}>
          {line.split(' ').map((word) => {
            const idx = wordIndex++;
            const isHactually = word.toLowerCase() === 'hactually';
            return (
              <span
                key={idx}
                className="animate-blur-reveal"
                style={{
                  animationDelay: `${idx * 80}ms`,
                  ...(isHactually && {
                    background: 'linear-gradient(90deg, #E05A3D 0%, #E05A3D 40%, #D9081E 50%, #E05A3D 60%, #E05A3D 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }),
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(false);
  const videoRefs = React.useRef([]);
  const layerRefs = React.useRef([]);
  const tapTime = React.useRef(0);
  const current = SLIDES[slide];

  React.useEffect(() => {
    videoRefs.current.forEach(v => v && (paused ? v.pause() : v.play().catch(() => {})));
  }, [paused]);

  React.useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(((Date.now() - start) / 5000) * 100, 100);
      setProgress(p);
      if (p >= 100 && slide < SLIDES.length - 1) setSlide(s => s + 1);
    }, 16);
    return () => clearInterval(id);
  }, [slide, paused]);

  React.useEffect(() => {
    if (!transitioning) return;
    gsap.to(layerRefs.current, { x: '0%', duration: 0.35, stagger: 0.05, ease: 'power2.in', onComplete: () => navigate('/auth/options', { state: { fromTransition: true }, replace: true }) });
  }, [transitioning, navigate]);

  const handleTap = e => {
    if (Date.now() - tapTime.current < 200) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
      x < e.currentTarget.offsetWidth / 2 ? slide > 0 && setSlide(slide - 1) : slide < SLIDES.length - 1 && setSlide(slide + 1);
    }
    setPaused(false);
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-blue font-sans" onPointerDown={() => { tapTime.current = Date.now(); setPaused(true); }} onPointerUp={handleTap} onPointerLeave={() => setPaused(false)}>
      {SLIDES.map((s, i) => s.video && (
        <video key={i} ref={el => { videoRefs.current[i] = el; if (el && s.final) el.playbackRate = 0.5; }} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{ opacity: slide === i ? 1 : 0, objectPosition: s.final ? '70% center' : 'center' }} src={s.video} />
      ))}

      {current.video && <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-blue to-transparent z-[1] pointer-events-none" />}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-dark/80 to-transparent z-[2] pointer-events-none" />

      <div className="relative z-20 flex gap-1 px-4 pt-12">
        {SLIDES.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-blue-light/30 overflow-hidden cursor-pointer" onClick={e => { e.stopPropagation(); setSlide(i); }}>
            <div className="h-full bg-blue-light rounded-full" style={{ width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%' }} />
          </div>
        ))}
      </div>

      <div className="relative z-20 px-4 pt-4">
        <img src="/Updated%20Logo.svg" alt="" className="h-8 w-auto" />
      </div>

      {current.profiles ? (
        <div className="flex-1 flex flex-col z-10 py-8">
          <div className="flex flex-col gap-3" style={{ mask: 'linear-gradient(black, transparent)', WebkitMask: 'linear-gradient(black, transparent)' }}>
            <ProfileRow images={PROFILES} speed={40} />
            <ProfileRow images={[...PROFILES.slice(4), ...PROFILES.slice(0, 4)]} right speed={50} />
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-blue-light text-[32px] font-bold text-center leading-tight"><BlurText lines={current.lines} center /></p>
          </div>
          <div className="flex flex-col gap-3" style={{ mask: 'linear-gradient(transparent, black)', WebkitMask: 'linear-gradient(transparent, black)' }}>
            <ProfileRow images={[...PROFILES.slice(2), ...PROFILES.slice(0, 2)]} speed={55} />
            <ProfileRow images={[...PROFILES.slice(6), ...PROFILES.slice(0, 6)]} right speed={35} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-end z-10 px-4 pb-4">
          <p key={slide} className="text-blue-light text-[32px] font-bold leading-tight"><BlurText lines={current.lines} /></p>
        </div>
      )}

      {current.final && (
        <div className="relative z-10 px-4 pb-8">
          <button onClick={e => { e.stopPropagation(); localStorage.setItem('hactually-onboarding-seen', 'true'); setTransitioning(true); }} className="w-full h-12 rounded-full relative overflow-hidden active:opacity-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-dark via-orange to-orange-dark bg-[length:300%_100%] animate-gradient-border" />
            <div className="absolute inset-[2px] rounded-full backdrop-blur-md" />
            <span className="relative z-10 text-xs text-blue-light font-bold uppercase tracking-widest">Start Spotting</span>
          </button>
        </div>
      )}

      {transitioning && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {LAYERS.map((bg, i) => (
            <div key={i} ref={el => (layerRefs.current[i] = el)} className={`absolute inset-0 ${bg}`} style={{ transform: 'translateX(-100%)', zIndex: LAYERS.length - i }} />
          ))}
        </div>
      )}
    </div>
  );
}
