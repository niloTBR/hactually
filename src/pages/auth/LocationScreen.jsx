import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Shield, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

/**
 * Location Permission Screen - Hactually 2.0 Branding
 * Warm cream background, blue pulsing rings, orange accent
 */
export default function LocationScreen() {
  const navigate = useNavigate();
  const { updateProfile, setOnboardingStep, user } = useAuthStore();

  const [permissionState, setPermissionState] = React.useState('prompt');
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state);
        result.onchange = () => setPermissionState(result.state);
      });
    }
  }, []);

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    setError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      updateProfile({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        locationPermission: true,
        onboardingComplete: true,
      });

      setOnboardingStep(4);
      setPermissionState('granted');

      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 500);
    } catch (err) {
      console.error('Location error:', err);
      setPermissionState('denied');

      if (err.code === 1) {
        setError('Location access was denied. Please enable it in your browser settings.');
      } else if (err.code === 2) {
        setError('Unable to determine your location. Please try again.');
      } else if (err.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError('Failed to get location. Please try again.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    updateProfile({
      locationPermission: false,
      onboardingComplete: true,
    });
    setOnboardingStep(4);
    navigate('/home', { replace: true });
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
      <div className="flex-1 px-6 flex flex-col">
        {/* Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-8">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-blue/10 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-blue/15" />
            </div>

            {/* Center icon */}
            <div className="relative h-24 w-24 rounded-full bg-blue flex items-center justify-center shadow-glow-blue">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-black text-center mb-3">
            Enable Location
          </h1>

          <p className="text-brown text-center max-w-xs mb-8">
            Hactually needs your location to show you who's actually around you
          </p>

          {/* Benefits */}
          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: Navigation, text: 'See people at venues near you' },
              { icon: MapPin, text: 'Check into places and meet others' },
              { icon: Shield, text: 'Your exact location is never shared' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white shadow-card flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-blue" />
                </div>
                <p className="text-black text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-orange-light border border-orange/20">
            <p className="text-orange-dark text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="pb-8 space-y-3">
          {permissionState === 'denied' ? (
            <>
              <button
                onClick={() => {
                  window.open('app-settings:', '_blank');
                }}
                className="w-full h-14 rounded-full bg-blue text-white font-bold text-lg shadow-glow-blue hover:bg-blue-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Open Settings
              </button>
              <button
                onClick={handleRequestLocation}
                className="w-full h-14 rounded-full bg-white text-black font-bold border border-brown-light shadow-card hover:bg-brown-mid active:scale-[0.98] transition-all"
              >
                Try Again
              </button>
            </>
          ) : (
            <button
              onClick={handleRequestLocation}
              disabled={isRequesting}
              className="w-full h-14 rounded-full bg-blue text-white font-bold text-lg shadow-glow-blue hover:bg-blue-dark active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRequesting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MapPin className="h-5 w-5" />
                  Allow Location Access
                </>
              )}
            </button>
          )}

          {import.meta.env.DEV && (
            <button
              onClick={handleSkip}
              className="w-full h-12 rounded-full text-brown text-sm hover:text-brown-dark transition-colors"
            >
              Skip for now (Dev only)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
