import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

/**
 * OTP Verification Screen
 * Verifies phone number with 6-digit code
 * Flow: OTP -> Profile Setup (new user) or Home (existing user)
 */
export default function OTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP, isLoading } = useAuthStore();

  const phone = location.state?.phone || '';
  const devOTP = location.state?.devOTP; // For development

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(30);
  const inputRefs = React.useRef([]);

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first input
  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle OTP input
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5 && newOtp.every(d => d)) {
      handleVerify(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  // Verify OTP
  const handleVerify = async (code) => {
    setError('');
    const result = await verifyOTP(phone, code);

    if (result.success) {
      if (result.isNewUser || !result.user.onboardingComplete) {
        navigate('/auth/profile-setup', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } else {
      setError(result.error || 'Invalid code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendTimer > 0) return;

    const result = await sendOTP(phone);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();

      // Update devOTP if available
      if (result.devOTP) {
        console.log(`[DEV] New OTP: ${result.devOTP}`);
      }
    }
  };

  // Format phone for display
  const formatPhone = (p) => {
    if (!p) return '';
    return p.replace(/(\+\d+)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  };

  return (
    <div className="min-h-screen bg-purple-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6">
        <h1 className="text-3xl font-extralight tracking-wide text-white mb-2">
          Verify your number
        </h1>
        <p className="text-white/50 font-light mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-white font-medium mb-8">
          {formatPhone(phone)}
        </p>

        {/* Dev helper */}
        {devOTP && (
          <div className="mb-6 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
            <p className="text-pink-400 text-sm text-center">
              Dev Mode - Your code: <span className="font-mono font-bold">{devOTP}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className={cn(
                'w-12 h-16 rounded-2xl bg-white/5 text-center text-2xl font-bold text-white focus:outline-none transition-all',
                error && 'ring-2 ring-red-500',
                digit && 'bg-white/10'
              )}
            />
          ))}
        </div>

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-white/40 text-sm">
              Resend code in <span className="text-white/70">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-pink-400 text-sm font-medium flex items-center gap-2 mx-auto hover:text-pink-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Resend Code
            </button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-purple-950/80 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-3 border-white/20 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  );
}
