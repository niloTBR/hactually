import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Camera, Check, User, Calendar, Users, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { cn } from '../../lib/utils';

/**
 * Profile Setup Screen - Hactually 2.0 Branding
 * Warm cream background, blue accents, white card inputs
 */

const STEPS = [
  { id: 'basics', label: 'Basics', icon: User },
  { id: 'photo', label: 'Photo', icon: Camera },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const NATIONALITIES = [
  'Emirati', 'Indian', 'Pakistani', 'Filipino', 'British',
  'American', 'Egyptian', 'Lebanese', 'Saudi', 'Jordanian',
  'Syrian', 'Iranian', 'Russian', 'German', 'French',
  'Italian', 'South African', 'Nigerian', 'Kenyan', 'Chinese',
  'Japanese', 'Korean', 'Australian', 'Canadian', 'Brazilian',
  'Other'
];

export default function ProfileSetupScreen() {
  const navigate = useNavigate();
  const { user, updateProfile, setOnboardingStep, isLoading } = useAuthStore();

  const [step, setStep] = React.useState(0);
  const [errors, setErrors] = React.useState({});

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    birthYear: '',
    gender: '',
    nationality: '',
    photo: null,
    photoPreview: null,
  });

  const getAge = (year) => {
    if (!year) return null;
    return new Date().getFullYear() - parseInt(year);
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Please enter your name';
      if (!formData.birthYear) newErrors.birthYear = 'Please enter your birth year';
      else if (getAge(formData.birthYear) < 18) newErrors.birthYear = 'You must be 18 or older';
      else if (getAge(formData.birthYear) > 100) newErrors.birthYear = 'Please enter a valid birth year';
      if (!formData.gender) newErrors.gender = 'Please select your gender';
      if (!formData.nationality) newErrors.nationality = 'Please select your nationality';
    }

    if (step === 1) {
      if (!formData.photo) newErrors.photo = 'Please add a profile photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ photo: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ photo: 'Image must be less than 5MB' });
      return;
    }

    const result = await authService.uploadPhoto(user?.id, file);
    if (result.success) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: result.photoUrl,
      });
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    const profileData = {
      name: formData.name.trim(),
      birthYear: parseInt(formData.birthYear),
      age: getAge(formData.birthYear),
      gender: formData.gender,
      nationality: formData.nationality,
      photoUrl: formData.photoPreview,
      onboardingComplete: false,
    };

    updateProfile(profileData);
    setOnboardingStep(3);
    navigate('/auth/location', { replace: true });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 63 }, (_, i) => currentYear - 18 - i);

  return (
    <div className="min-h-screen bg-brown-lighter flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-12 pb-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="h-10 w-10 rounded-full bg-white shadow-card flex items-center justify-center text-brown hover:bg-brown-mid transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-8 bg-blue' : i < step ? 'w-4 bg-blue/50' : 'w-4 bg-brown-light'
              )}
            />
          ))}
        </div>

        <div className="w-10" />
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {step === 0 && (
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black mb-2">
              Tell us about you
            </h1>
            <p className="text-brown mb-8">
              This helps us find your perfect matches
            </p>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-brown mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="How should we call you?"
                  maxLength={20}
                  className={cn(
                    'w-full h-14 px-5 rounded-full bg-white text-black placeholder:text-brown/40 border border-brown-light focus:outline-none focus:border-blue transition-all shadow-card',
                    errors.name && 'border-orange'
                  )}
                />
                {errors.name && <p className="text-orange text-xs mt-1 pl-5 font-medium">{errors.name}</p>}
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-bold text-brown mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Birth Year
                </label>
                <select
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  className={cn(
                    'w-full h-14 px-5 rounded-full bg-white text-black appearance-none cursor-pointer border border-brown-light focus:outline-none focus:border-blue transition-all shadow-card',
                    !formData.birthYear && 'text-brown/40',
                    errors.birthYear && 'border-orange'
                  )}
                >
                  <option value="" disabled>Select your birth year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {formData.birthYear && (
                  <p className="text-brown text-xs mt-1 pl-5">
                    You'll appear as {getAge(formData.birthYear)} years old
                  </p>
                )}
                {errors.birthYear && <p className="text-orange text-xs mt-1 pl-5 font-medium">{errors.birthYear}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-brown mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Gender
                </label>
                <div className="flex gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g.value })}
                      className={cn(
                        'flex-1 h-12 rounded-full font-bold transition-all shadow-card',
                        formData.gender === g.value
                          ? 'bg-blue text-white shadow-glow-blue'
                          : 'bg-white text-brown border border-brown-light hover:border-blue/30'
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="text-orange text-xs mt-1 pl-5 font-medium">{errors.gender}</p>}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-bold text-brown mb-2">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Nationality
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className={cn(
                    'w-full h-14 px-5 rounded-full bg-white text-black appearance-none cursor-pointer border border-brown-light focus:outline-none focus:border-blue transition-all shadow-card',
                    !formData.nationality && 'text-brown/40',
                    errors.nationality && 'border-orange'
                  )}
                >
                  <option value="" disabled>Select your nationality</option>
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                {errors.nationality && <p className="text-orange text-xs mt-1 pl-5 font-medium">{errors.nationality}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl font-bold text-black mb-2">
              Add your photo
            </h1>
            <p className="text-brown mb-8">
              Show others who you are
            </p>

            <div className="flex-1 flex flex-col items-center justify-center">
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div
                  className={cn(
                    'w-48 h-48 rounded-full border-4 border-dashed border-brown-light flex items-center justify-center overflow-hidden transition-all group-hover:border-blue/50',
                    formData.photoPreview && 'border-solid border-blue',
                    errors.photo && 'border-orange/50'
                  )}
                >
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <Camera className="h-12 w-12 text-brown/30 mx-auto mb-3 group-hover:text-blue transition-colors" />
                      <p className="text-brown text-sm">Tap to add photo</p>
                    </div>
                  )}
                </div>
              </label>

              {formData.photoPreview && (
                <label className="mt-4 text-blue text-sm font-bold cursor-pointer hover:text-blue-dark">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  Change photo
                </label>
              )}

              {errors.photo && (
                <p className="text-orange text-sm mt-4 font-medium">{errors.photo}</p>
              )}

              <p className="text-brown text-xs mt-8 text-center max-w-xs">
                Choose a clear photo of your face. This is what others will see first.
              </p>

              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, photo: 'skip', photoPreview: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test' });
                    setErrors({});
                  }}
                  className="mt-4 text-brown text-xs underline hover:text-brown-dark"
                >
                  Skip in dev mode
                </button>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-blue text-white font-bold text-lg shadow-glow-blue hover:bg-blue-dark active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : step === STEPS.length - 1 ? (
            <>
              <Check className="h-5 w-5" />
              Continue
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
