import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { GradientVeil } from '../../components/GradientVeil';

/**
 * Email Auth Screen
 * Deep blue theme with gradient veil
 */

export default function EmailAuthScreen() {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, isLoading } = useAuthStore();

  const [step, setStep] = React.useState('email');
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
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

  const handleSendOTP = async () => {
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
        console.log(`[DEV] New OTP: ${result.devOTP}`);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#083D9C' }}>
      {/* Gradient Veil Effect */}
      <GradientVeil
        colors={['#D9081E', '#E0593D', '#FF7F5C']}
        opacity={0.35}
        blur={120}
        position="top"
        animate={false}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button
          onClick={() => step === 'otp' ? setStep('email') : navigate(-1)}
          className="h-10 w-10 rounded-full flex items-center justify-center active:opacity-80 transition-opacity"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-8">
        {step === 'email' ? (
          <>
            <h1
              className="text-white text-lg font-bold mb-2 animate-fade-in-up"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.1)' }}
            >
              What's your email?
            </h1>
            <p className="text-white/50 text-xs mb-8 animate-fade-in-up stagger-1">
              We'll send you a verification code
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-full animate-shake" style={{ backgroundColor: 'rgba(224,90,61,0.2)' }}>
                <p className="text-orange-light text-xs font-bold">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="relative mb-6 animate-fade-in-up stagger-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoFocus
                className="w-full h-12 pl-11 pr-4 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Continue Button */}
            <div className="w-full relative h-12 rounded-full overflow-hidden animate-fade-in-up stagger-3">
              <div
                className="absolute inset-0 rounded-full p-[1.5px] animate-gradient-shift"
                style={{
                  background: 'linear-gradient(90deg, #D9081E, #E0593D, #FF7F5C, #D9081E)',
                  backgroundSize: '200% 100%',
                }}
              >
                <div className="w-full h-full rounded-full" style={{ backgroundColor: '#083D9C' }} />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={isLoading || !email.trim()}
                className="absolute inset-0 z-10 flex items-center justify-center gap-2 select-none active:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-xs text-white font-bold uppercase tracking-widest">Continue</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1
              className="text-white text-lg font-bold mb-2 animate-fade-in-up"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.1)' }}
            >
              Enter the code
            </h1>
            <p className="text-white/50 text-xs mb-1 animate-fade-in-up stagger-1">
              We sent a 6-digit code to
            </p>
            <p className="text-white font-bold text-sm mb-8 animate-fade-in-up stagger-1">
              {email}
            </p>

            {/* Dev helper */}
            {devOTP && (
              <div
                className="mb-4 p-3 rounded-full animate-fade-in-up stagger-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <p className="text-white text-xs text-center">
                  Dev Mode - Code: <span className="font-mono font-bold">{devOTP}</span>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-full animate-shake" style={{ backgroundColor: 'rgba(224,90,61,0.2)' }}>
                <p className="text-orange-light text-xs font-bold">{error}</p>
              </div>
            )}

            {/* OTP Input */}
            <div
              className="flex justify-center gap-2 mb-8 animate-fade-in-up stagger-2"
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
                    "w-11 h-14 rounded-xl text-center text-xl font-bold text-white focus:outline-none transition-all",
                    digit && "ring-1 ring-white/30"
                  )}
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                />
              ))}
            </div>

            {/* Resend */}
            <div className="text-center animate-fade-in-up stagger-3">
              {resendTimer > 0 ? (
                <p className="text-white/40 text-xs">
                  Resend code in <span className="text-white font-bold">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-white text-xs font-bold active:opacity-80 disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Loading overlay */}
      {isLoading && step === 'otp' && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
