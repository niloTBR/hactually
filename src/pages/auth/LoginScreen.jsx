import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

/**
 * Login/Sign Up Screen - Hactually 2.0 Branding
 * Warm cream background, blue accents, clean form
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [isSignUp, setIsSignUp] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login('email', { email, password });

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

  const handleOAuthLogin = async (provider) => {
    setError('');
    const mockCredentials = {
      email: `user_${Date.now()}@${provider}.com`,
      name: `${provider} User`,
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

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-brown-lighter">

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center pt-10 pb-6 px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-3">
          <div className="h-14 w-14 rounded-full bg-blue flex items-center justify-center mb-2 shadow-glow-blue">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-blue tracking-wide">
            hactually
          </h1>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm mt-auto">
          <h2 className="text-xl font-bold text-black text-center mb-5">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-orange-light border border-orange/30">
              <p className="text-orange-dark text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white text-black placeholder:text-brown/50 border border-brown-light focus:outline-none focus:border-blue transition-colors shadow-card"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brown" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white text-black placeholder:text-brown/50 border border-brown-light focus:outline-none focus:border-blue transition-colors shadow-card"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brown hover:text-brown-dark transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={cn(
                  'h-5 w-5 rounded border-2 flex items-center justify-center transition-all',
                  rememberMe
                    ? 'bg-blue border-blue'
                    : 'border-brown-light bg-transparent'
                )}
              >
                {rememberMe && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-brown text-sm">Remember me</span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-blue text-white font-bold text-base shadow-glow-blue hover:bg-blue-dark active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                isSignUp ? 'Sign up' : 'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-brown-light" />
            <span className="text-brown text-xs">or continue with</span>
            <div className="flex-1 h-px bg-brown-light" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center gap-4">
            {/* Facebook */}
            <button
              onClick={() => handleOAuthLogin('facebook')}
              disabled={isLoading}
              className="h-11 w-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            >
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
              </svg>
            </button>

            {/* Google */}
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="h-11 w-11 rounded-full bg-white border border-brown-light flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
              className="h-11 w-11 rounded-full bg-black flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            >
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
          </div>

          {/* Toggle Sign In/Up */}
          <p className="text-center mt-6 text-brown text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue font-bold hover:text-blue-dark transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
