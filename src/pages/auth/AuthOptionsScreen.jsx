import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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

export default function AuthOptionsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOTP, verifyOTP, isLoading } = useAuthStore();
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState('options');
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [devOTP, setDevOTP] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [showTransition, setShowTransition] = React.useState(location.state?.fromTransition || false);
  const inputRefs = React.useRef([]);
  const layerRefs = React.useRef([]);

  React.useEffect(() => {
    if (!showTransition) return;
    requestAnimationFrame(() => {
      gsap.to(layerRefs.current, { x: '100%', duration: 0.35, stagger: 0.05, ease: 'power2.out', onComplete: () => setShowTransition(false) });
    });
  }, [showTransition]);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const validateEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleEmailSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Please enter your email');
    if (!validateEmail(email)) return setError('Please enter a valid email');
    const result = await sendOTP(email);
    if (result.success) {
      setStep('otp');
      setResendTimer(30);
      if (result.devOTP) setDevOTP(result.devOTP);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else setError(result.error || 'Failed to send OTP');
  };

  const handleOTPChange = (i, v) => {
    if (v && !/^\d$/.test(v)) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    setError('');
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
    if (v && i === 5 && newOtp.every(d => d)) handleVerifyOTP(newOtp.join(''));
  };

  const handleOTPKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handleOTPPaste = e => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (data.length === 6) {
      setOtp(data.split(''));
      inputRefs.current[5]?.focus();
      handleVerifyOTP(data);
    }
  };

  const handleVerifyOTP = async code => {
    setError('');
    const result = await verifyOTP(email, code);
    if (result.success) {
      navigate(result.isNewUser || !result.user.onboardingComplete ? '/auth/profile-setup' : '/home', { replace: true });
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
      if (result.devOTP) setDevOTP(result.devOTP);
    }
  };

  const handleOAuth = async provider => {
    setError('');
    const result = await login(provider, { email: `user_${Date.now()}@${provider}.com`, name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User` });
    if (result.success) navigate(result.isNewUser || !result.user.onboardingComplete ? '/auth/profile-setup' : '/home');
    else setError(result.error || 'Login failed');
  };

  // OTP Step
  if (step === 'otp') {
    return (
      <div className="h-full w-full flex flex-col relative overflow-hidden bg-brown-lighter">
        <div className="relative z-10 flex items-center px-4 pt-4">
          <button onClick={() => setStep('options')} className="h-10 w-10 rounded-full flex items-center justify-center bg-brown-light/30 active:opacity-80">
            <ChevronLeft className="h-5 w-5 text-brown" />
          </button>
        </div>
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-8">
          <h1 className="text-blue text-xl font-bold mb-2 animate-fade-in-up font-sans">Enter the code</h1>
          <p className="text-brown text-sm mb-8 animate-fade-in-up stagger-1">We sent a code to {email}</p>
          {devOTP && <div className="mb-4 p-3 rounded-xl bg-blue/10 border border-blue/20 animate-fade-in-up stagger-2"><p className="text-blue text-xs text-center">Dev Mode - Code: <span className="font-mono font-bold">{devOTP}</span></p></div>}
          {error && <div className="mb-4 p-3 rounded-xl bg-orange/10 border border-orange/20 animate-shake"><p className="text-orange text-xs font-bold text-center">{error}</p></div>}
          <div className="flex justify-center gap-1.5 mb-8 animate-fade-in-up stagger-2" onPaste={handleOTPPaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={el => (inputRefs.current[i] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOTPChange(i, e.target.value)} onKeyDown={e => handleOTPKeyDown(i, e)} disabled={isLoading} className={`w-11 h-13 rounded-xl text-center text-xl font-bold text-black focus:outline-none bg-white border ${digit ? 'border-blue' : 'border-brown-light/30'}`} style={{ height: 52 }} />
            ))}
          </div>
          <div className="text-center animate-fade-in-up stagger-3">
            {resendTimer > 0 ? <p className="text-brown text-xs">Resend code in <span className="text-black font-bold">{resendTimer}s</span></p> : <button onClick={handleResend} disabled={isLoading} className="text-blue text-xs font-bold active:opacity-80 disabled:opacity-50">Resend Code</button>}
          </div>
        </div>
        {isLoading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50"><div className="h-10 w-10 border-2 border-blue/30 border-t-blue rounded-full animate-spin" /></div>}
      </div>
    );
  }

  // Options Step
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-blue font-sans">
      <div className="relative z-10 flex items-end gap-3 px-4 pt-16 animate-fade-in">
        <img src="/Updated%20Logo.svg" alt="" className="h-10 w-auto" />
        <span className="shimmer-logo text-xl font-bold leading-none mb-0.5">hactually</span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-3 py-4">
        <ProfileRow images={PROFILES} speed={40} />
        <ProfileRow images={[...PROFILES.slice(4), ...PROFILES.slice(0, 4)]} right speed={50} />
      </div>

      <div className="relative z-10 px-4 pb-8">
        {error && <div className="mb-4 p-3 rounded-full bg-orange/20 animate-shake"><p className="text-orange-light text-xs text-center font-bold">{error}</p></div>}
        <p className="text-blue-light text-3xl font-bold mb-6">
          <span className="animate-blur-reveal inline-block" style={{ animationDelay: '0ms' }}>continue</span>{' '}
          <span className="animate-blur-reveal inline-block" style={{ animationDelay: '100ms' }}>the</span>{' '}
          <span className="animate-blur-reveal inline-block" style={{ animationDelay: '200ms' }}>moment</span>
        </p>

        <div className="relative mb-4 animate-fade-in-up stagger-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()} placeholder="Enter your email" className="w-full h-12 pl-11 pr-12 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none bg-white/15 backdrop-blur-md" />
          <button onClick={handleEmailSubmit} disabled={isLoading || !email.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center bg-white/15 active:opacity-80 disabled:opacity-30">
            {isLoading ? <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-4 w-4 text-white" />}
          </button>
        </div>

        <div className="flex items-center gap-4 my-4 animate-fade-in-up stagger-2">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-xs uppercase tracking-widest font-bold">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <button onClick={() => handleOAuth('google')} disabled={isLoading} className="w-full h-12 rounded-full flex items-center justify-center gap-2 mb-3 bg-blue-light/15 backdrop-blur-md border border-blue-light/20 active:opacity-80 disabled:opacity-50 animate-fade-in-up stagger-3">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#C8E3F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#C8E3F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#C8E3F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#C8E3F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span className="text-sm text-blue-light font-bold"><span className="text-xs">continue with</span> Google</span>
        </button>

        <button onClick={() => handleOAuth('apple')} disabled={isLoading} className="w-full h-12 rounded-full flex items-center justify-center gap-2 bg-blue-light/15 backdrop-blur-md border border-blue-light/20 active:opacity-80 disabled:opacity-50 animate-fade-in-up stagger-4">
          <svg className="h-4 w-4" fill="#C8E3F4" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          <span className="text-sm text-blue-light font-bold"><span className="text-xs">continue with</span> Apple</span>
        </button>

        <p className="text-white/30 text-xs text-center mt-6 font-medium animate-fade-in-up stagger-5">By continuing, you agree to our<br />Terms of Service and Privacy Policy</p>
      </div>

      {showTransition && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {LAYERS.map((bg, i) => (
            <div key={i} ref={el => (layerRefs.current[i] = el)} className={`absolute inset-0 ${bg}`} style={{ zIndex: LAYERS.length - i }} />
          ))}
        </div>
      )}
    </div>
  );
}
