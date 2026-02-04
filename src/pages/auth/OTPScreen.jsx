import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

/**
 * OTP Verification Screen - Hactually 2.0 Branding
 * Warm cream background, blue accents, white inputs
 */
export default function OTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP, isLoading } = useAuthStore();

  const phone = location.state?.phone || '';
  const devOTP = location.state?.devOTP;

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(30);
  const inputRefs = React.useRef([]);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every(d => d)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const handleResend = async () => {
    if (resendTimer > 0) return;

    const result = await sendOTP(phone);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();

      if (result.devOTP) {
        console.log(`[DEV] New OTP: ${result.devOTP}`);
      }
    }
  };

  const formatPhone = (p) => {
    if (!p) return '';
    return p.replace(/(\+\d+)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  };

  return (
    <div className="min-h-screen bg-brown-lighter flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-white shadow-card flex items-center justify-center text-brown hover:bg-brown-mid transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 px-6">
        <h1 className="text-3xl font-bold text-black mb-2">
          Verify your number
        </h1>
        <p className="text-brown mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-black font-bold mb-8">
          {formatPhone(phone)}
        </p>

        {/* Dev helper */}
        {devOTP && (
          <div className="mb-6 p-3 rounded-2xl bg-blue-light/30 border border-blue/20">
            <p className="text-blue text-sm text-center font-medium">
              Dev Mode - Your code: <span className="font-mono font-black">{devOTP}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-orange-light border border-orange/20">
            <p className="text-orange-dark text-sm font-medium">{error}</p>
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
                'w-12 h-16 rounded-2xl bg-white text-center text-2xl font-black text-black border border-brown-light focus:outline-none focus:border-blue transition-all shadow-card',
                error && 'border-orange',
                digit && 'border-blue bg-blue-light/10'
              )}
            />
          ))}
        </div>

        {/* Resend */}
        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-brown text-sm">
              Resend code in <span className="text-black font-bold">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-blue text-sm font-bold flex items-center gap-2 mx-auto hover:text-blue-dark transition-colors disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Resend Code
            </button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-brown-lighter/80 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-3 border-brown-light border-t-blue rounded-full animate-spin" />
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
