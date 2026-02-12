import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Shield, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

/**
 * Location Permission Screen
 * Beige/cream theme matching profile setup
 */

export default function LocationScreen() {
  const navigate = useNavigate();
  const { updateProfile, setOnboardingStep } = useAuthStore();

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
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-brown-lighter">
      {/* Header */}
      <div className="relative z-10 flex items-center px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full flex items-center justify-center active:opacity-80 transition-opacity bg-brown-light/30"
        >
          <ChevronLeft className="h-5 w-5 text-brown" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-8">
        {/* Title */}
        <h1 className="text-black text-xl font-bold mb-2 animate-fade-in-up">
          Enable location
        </h1>
        <p className="text-brown text-sm mb-8 animate-fade-in-up stagger-1">
          So we can show you who's actually around
        </p>

        {/* Location illustration */}
        <div className="flex justify-center mb-8 animate-fade-in-up stagger-2">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-blue/10 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-blue/15" />
            </div>
            {/* Center icon */}
            <div className="relative h-20 w-20 rounded-full bg-blue flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4 animate-fade-in-up stagger-3">
          {[
            { icon: Navigation, text: 'See people at venues near you' },
            { icon: MapPin, text: 'Check into places and meet others' },
            { icon: Shield, text: 'Your exact location is never shared' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-brown-light/30">
                <item.icon className="h-5 w-5 text-brown" strokeWidth={1.5} />
              </div>
              <p className="text-black text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-orange/10 border border-orange/20">
            <p className="text-orange text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="relative z-10 px-6 pb-8 pt-4 space-y-3 animate-fade-in-up stagger-4">
        {permissionState === 'denied' ? (
          <>
            <button
              onClick={() => {
                window.open('app-settings:', '_blank');
              }}
              className="w-full h-12 rounded-full font-bold text-sm bg-blue text-white flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            >
              Open Settings
            </button>
            <button
              onClick={handleRequestLocation}
              className="w-full h-12 rounded-full font-bold text-sm bg-white border border-brown-light/30 text-black flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            >
              Try Again
            </button>
          </>
        ) : (
          <div className="w-full relative h-12 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 rounded-full p-[1.5px] animate-gradient-shift"
              style={{
                background: 'linear-gradient(90deg, #D9081E, #E05A3D, #F5F1E8, #D9081E)',
                backgroundSize: '200% 100%',
              }}
            >
              <div className="w-full h-full rounded-full bg-brown-lighter" />
            </div>
            <button
              onClick={handleRequestLocation}
              disabled={isRequesting}
              className="absolute inset-0 z-10 flex items-center justify-center gap-2 select-none active:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isRequesting ? (
                <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-black" />
                  <span className="text-sm text-black font-bold">Allow Location</span>
                </>
              )}
            </button>
          </div>
        )}

        <button
          onClick={handleSkip}
          className="w-full h-12 rounded-full text-brown text-sm hover:text-black transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
