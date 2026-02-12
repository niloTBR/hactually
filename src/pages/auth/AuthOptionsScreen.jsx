import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft, ScanFace } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import ColorBends from '../../components/ColorBends';

/**
 * Auth Options Screen
 * Deep blue theme with gradient veil effect
 * Includes email input directly
 */

export default function AuthOptionsScreen() {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP, isLoading } = useAuthStore();
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [step, setStep] = React.useState('options'); // 'options' | 'otp'
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [devOTP, setDevOTP] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);

  const inputRefs = React.useRef([]);

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
          <h1 className="text-black text-xl font-bold mb-2 animate-fade-in-up">
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

  // Options Step - Blue mode
  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Blue base + ColorBends overlay */}
      <div className="absolute inset-0 bg-[#083D9C]" />
      <ColorBends
        colors={['#D9081E', '#E0593D', '#FF7F5C']}
        transparent={true}
        rotation={0}
        speed={0.4}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.5}
        noise={0.08}
      />

      {/* Logo at top */}
      <div className="relative z-10 flex flex-col items-center pt-16 animate-fade-in">
        <img
          src="/images/logo.svg"
          alt="Hactually"
          className="h-14 w-auto"
        />
        <span className="text-white text-xl font-black mt-3 tracking-tight">hactually</span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-8">
        <>
            {error && (
              <div
                className="mb-4 p-3 rounded-full animate-shake"
                style={{ backgroundColor: 'rgba(224,90,61,0.2)' }}
              >
                <p className="text-orange-light text-xs text-center font-bold">{error}</p>
              </div>
            )}

            {/* Continue with email label */}
            <p className="text-white text-sm text-center mb-3 font-bold animate-fade-in-up">
              Continue with email
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
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
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

            {/* Face ID icon - below email */}
            <div className="flex items-center justify-center mb-4 animate-fade-in-up stagger-2">
              <ScanFace className="h-12 w-12 text-white" strokeWidth={1} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4 animate-fade-in-up stagger-2">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Google - glass pill */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 mb-3 active:opacity-80 transition-opacity disabled:opacity-50 animate-fade-in-up stagger-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm text-white font-bold">
                Continue with Google
              </span>
            </button>

            {/* Apple - glass pill */}
            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50 animate-fade-in-up stagger-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="h-4 w-4" fill="#fff" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm text-white font-bold">
                Continue with Apple
              </span>
            </button>

            {/* Terms */}
            <p className="text-white/30 text-[10px] text-center mt-6 font-medium animate-fade-in-up stagger-5">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
      </div>
    </div>
  );
}
