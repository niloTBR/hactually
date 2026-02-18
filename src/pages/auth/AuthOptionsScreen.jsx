import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import ColorBends from '../../components/ColorBends';

// Transition layer colors (same as WelcomeScreen)
const LAYER_COLORS = [
  '#4752C4',
  '#5865F2',
  '#6B75F5',
  '#7C85F7',
  '#8D94F9',
];

// Profile images for scrolling background
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

/**
 * Auth Options Screen
 * Deep blue theme with gradient veil effect
 * Includes email input directly
 */

export default function AuthOptionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOTP, verifyOTP, isLoading } = useAuthStore();
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState('options'); // 'options' | 'otp'
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [devOTP, setDevOTP] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [showTransition, setShowTransition] = React.useState(location.state?.fromTransition || false);

  const inputRefs = React.useRef([]);
  const layerRefs = React.useRef([]);

  // Animate transition layers out to reveal screen - immediately on mount
  React.useEffect(() => {
    if (!showTransition) return;

    // Use requestAnimationFrame for immediate execution after render
    const frame = requestAnimationFrame(() => {
      gsap.to(layerRefs.current, {
        x: '100%',
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        onComplete: () => {
          setShowTransition(false);
        }
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [showTransition]);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email'); return; }

    const result = await sendOTP(email);
    if (result.success) {
      setStep('otp');
      setResendTimer(30);
      if (result.devOTP) {
        setDevOTP(result.devOTP);
        console.log(`[DEV] OTP: ${result.devOTP}`);
      }
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handleOTPChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.every(d => d)) handleVerifyOTP(newOtp.join(''));
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = async (code) => {
    setError('');
    const result = await verifyOTP(email, code);
    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigate('/auth/profile-setup', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } else {
      setError(result.error || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    const result = await sendOTP(email);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
      if (result.devOTP) {
        setDevOTP(result.devOTP);
      }
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError('');
    const mockCredentials = {
      email: `user_${Date.now()}@${provider}.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    };

    const result = await login(provider, mockCredentials);

    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigate('/auth/profile-setup');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  // OTP Step - Beige mode
  if (step === 'otp') {
    return (
      <div className="h-full w-full flex flex-col relative overflow-hidden bg-brown-lighter">
        {/* Header */}
        <div className="relative z-10 flex items-center px-4 pt-4">
          <button
            onClick={() => setStep('options')}
            className="h-10 w-10 rounded-full flex items-center justify-center active:opacity-80 transition-opacity bg-brown-light/30"
          >
            <ChevronLeft className="h-5 w-5 text-brown" />
          </button>
        </div>

        {/* Content at top */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-8">
          <h1 className="text-[#5865F2] text-xl font-bold mb-2 animate-fade-in-up font-sans">
            Enter the code
          </h1>
          <p className="text-brown text-sm mb-8 animate-fade-in-up stagger-1">
            We sent a code to {email}
          </p>

          {/* Dev helper */}
          {devOTP && (
            <div className="mb-4 p-3 rounded-xl bg-blue/10 border border-blue/20 animate-fade-in-up stagger-2">
              <p className="text-blue text-xs text-center">
                Dev Mode - Code: <span className="font-mono font-bold">{devOTP}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-orange/10 border border-orange/20 animate-shake">
              <p className="text-orange text-xs font-bold text-center">{error}</p>
            </div>
          )}

          {/* OTP Input */}
          <div
            className="flex justify-center gap-1.5 mb-8 animate-fade-in-up stagger-2"
            onPaste={handleOTPPaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                disabled={isLoading}
                className={cn(
                  "w-11 h-13 rounded-xl text-center text-xl font-bold text-black focus:outline-none transition-all bg-white border border-brown-light/30",
                  digit && "border-blue"
                )}
                style={{ height: '52px' }}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center animate-fade-in-up stagger-3">
            {resendTimer > 0 ? (
              <p className="text-brown text-xs">
                Resend code in <span className="text-black font-bold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue text-xs font-bold active:opacity-80 disabled:opacity-50"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
            <div className="h-10 w-10 border-2 border-blue/30 border-t-blue rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // Options Step - Blue mode with scrolling profile images
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden font-sans bg-[#5865F2]">
      {/* Soft blur orbs */}
      <div className="absolute inset-0 overflow-hidden z-[0] pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(200,227,244,0.4) 0%, transparent 70%)',
            top: '-20%',
            left: '-30%',
            filter: 'blur(60px)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(200,227,244,0.3) 0%, transparent 70%)',
            bottom: '20%',
            right: '-10%',
            filter: 'blur(50px)',
            animation: 'float3 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.08); }
        }
      `}</style>

      {/* Shimmer animation for logo text */}
      <style>{`
        @keyframes shimmerLogo {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shimmer-logo {
          background: linear-gradient(90deg, #C8E3F4 0%, #C8E3F4 40%, #ffffff 50%, #C8E3F4 60%, #C8E3F4 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerLogo 3s ease-in-out infinite;
        }
      `}</style>

      {/* Marquee keyframes */}
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

      {/* Logo at top with text - logo 2x text height, baseline aligned */}
      <div className="relative z-10 flex items-end gap-3 px-4 pt-16 animate-fade-in">
        <img
          src="/Updated%20Logo.svg"
          alt="Hactually"
          className="h-10 w-auto"
        />
        <span className="shimmer-logo text-xl font-bold font-sans leading-none" style={{ marginBottom: '2px' }}>hactually</span>
      </div>

      {/* Scrolling profile images - two rows between logo and content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-3 py-4">
        {/* Row 1 - scrolls left */}
        <div className="overflow-hidden">
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
        <div className="overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 px-4 pb-8">
            {error && (
              <div
                className="mb-4 p-3 rounded-full animate-shake"
                style={{ backgroundColor: 'rgba(224,90,61,0.2)' }}
              >
                <p className="text-orange-light text-xs text-center font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
              </div>
            )}

            {/* Continue the moment label - light blue, left aligned, large with blur reveal */}
            <style>{`
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
              .blur-word {
                display: inline-block;
                animation: blurReveal 0.5s ease-out forwards;
                opacity: 0;
              }
            `}</style>
            <p className="text-[#C8E3F4] text-3xl text-left mb-6 font-bold font-sans">
              <span className="blur-word" style={{ animationDelay: '0ms' }}>continue</span>{' '}
              <span className="blur-word" style={{ animationDelay: '100ms' }}>the</span>{' '}
              <span className="blur-word" style={{ animationDelay: '200ms' }}>moment</span>
            </p>

            {/* Email Input with submit button */}
            <div className="relative mb-4 animate-fade-in-up stagger-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                placeholder="Enter your email"
                className="w-full h-12 pl-11 pr-12 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', fontFamily: 'Roboto, sans-serif' }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || !email.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center active:opacity-80 transition-opacity disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                {isLoading ? (
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-white" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4 animate-fade-in-up stagger-2">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Google - glass pill with light blue */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 mb-3 active:opacity-80 transition-opacity disabled:opacity-50 animate-fade-in-up stagger-3"
              style={{ backgroundColor: 'rgba(200,227,244,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(200,227,244,0.2)' }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#C8E3F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#C8E3F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#C8E3F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#C8E3F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm text-[#C8E3F4] font-bold font-sans">
                <span className="text-xs">continue with</span> Google
              </span>
            </button>

            {/* Apple - glass pill with light blue */}
            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50 animate-fade-in-up stagger-4"
              style={{ backgroundColor: 'rgba(200,227,244,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(200,227,244,0.2)' }}
            >
              <svg className="h-4 w-4" fill="#C8E3F4" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm text-[#C8E3F4] font-bold font-sans">
                <span className="text-xs">continue with</span> Apple
              </span>
            </button>

            {/* Terms */}
            <p className="text-white/30 text-[10px] text-center mt-6 font-medium animate-fade-in-up stagger-5" style={{ fontFamily: 'Roboto, sans-serif' }}>
              By continuing, you agree to our<br />Terms of Service and Privacy Policy
            </p>
      </div>

      {/* Staggered transition overlay - reveals screen */}
      {showTransition && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
          {LAYER_COLORS.map((color, i) => (
            <div
              key={i}
              ref={(el) => (layerRefs.current[i] = el)}
              className="absolute inset-0"
              style={{
                transform: 'translateX(0%)',
                backgroundColor: color,
                zIndex: LAYER_COLORS.length - i,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
