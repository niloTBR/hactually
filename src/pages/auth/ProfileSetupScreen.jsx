import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Camera, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';
import { cn } from '../../lib/utils';

/**
 * Profile Setup Screen
 * Beige/cream theme with modern photo upload and interests picker
 */

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso',
  'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia',
  'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const INTERESTS = [
  { label: 'Music', emoji: '🎵' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Food', emoji: '🍕' },
  { label: 'Fitness', emoji: '💪' },
  { label: 'Art', emoji: '🎨' },
  { label: 'Movies', emoji: '🎬' },
  { label: 'Reading', emoji: '📚' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'Photography', emoji: '📸' },
  { label: 'Dancing', emoji: '💃' },
  { label: 'Cooking', emoji: '👨‍🍳' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'Sports', emoji: '⚽' },
  { label: 'Fashion', emoji: '👗' },
  { label: 'Tech', emoji: '💻' },
  { label: 'Yoga', emoji: '🧘' },
  { label: 'Coffee', emoji: '☕' },
  { label: 'Wine', emoji: '🍷' },
  { label: 'Nightlife', emoji: '🌙' },
  { label: 'Beach', emoji: '🏖️' },
];

export default function ProfileSetupScreen() {
  const navigate = useNavigate();
  const { user, updateProfile, setOnboardingStep, isLoading } = useAuthStore();

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    dateOfBirth: '',
    country: '',
    photo: null,
    photoPreview: null,
    bio: '',
    interests: [],
  });
  const [errors, setErrors] = React.useState({});
  const [showCountryPicker, setShowCountryPicker] = React.useState(false);
  const [interestSearch, setInterestSearch] = React.useState('');
  const countryBtnRef = React.useRef(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  const filteredInterests = INTERESTS.filter(
    (interest) =>
      interest.label.toLowerCase().includes(interestSearch.toLowerCase()) &&
      !formData.interests.includes(interest.label)
  );

  const getAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Please enter your date of birth';
    } else {
      const age = getAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be 18 or older';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date';
      }
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, photo: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: 'Image must be less than 5MB' });
      return;
    }

    const result = await authService.uploadPhoto(user?.id, file);
    if (result.success) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: result.photoUrl,
      });
      setErrors({ ...errors, photo: undefined });
    }
  };

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else if (formData.interests.length < 5) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
      setInterestSearch('');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const profileData = {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth,
      age: getAge(formData.dateOfBirth),
      country: formData.country,
      photoUrl: formData.photoPreview,
      bio: formData.bio.trim(),
      interests: formData.interests,
      onboardingComplete: false,
    };

    updateProfile(profileData);

    // Request native location permission directly
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateProfile({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            locationPermission: true,
            onboardingComplete: true,
          });
          setOnboardingStep(4);
          navigate('/home', { replace: true });
        },
        () => {
          // Permission denied or error - still complete onboarding
          updateProfile({
            locationPermission: false,
            onboardingComplete: true,
          });
          setOnboardingStep(4);
          navigate('/home', { replace: true });
        }
      );
    } else {
      // Geolocation not supported
      updateProfile({ onboardingComplete: true });
      setOnboardingStep(4);
      navigate('/home', { replace: true });
    }
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
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-6 overflow-y-auto overflow-x-visible pb-4">
        {/* Title */}
        <h1 className="text-black text-xl font-bold mb-6 animate-fade-in-up">
          Create your profile
        </h1>

        {/* Photo Upload - Modern style */}
        <div className="flex items-start gap-4 mb-6 animate-fade-in-up stagger-1">
          <label className="cursor-pointer group flex-shrink-0">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <div
              className={cn(
                "w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden transition-all",
                "bg-brown-light/40 group-hover:bg-brown-light/60 group-active:scale-95",
                formData.photoPreview && "bg-transparent"
              )}
            >
              {formData.photoPreview ? (
                <img
                  src={formData.photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-brown" strokeWidth={1.5} />
              )}
            </div>
          </label>
          <div className="flex-1 pt-2">
            <p className="text-black text-sm font-bold mb-1">Add a photo</p>
            <p className="text-brown text-xs">Show your best self</p>
            {formData.photoPreview && (
              <label className="text-blue text-xs font-medium cursor-pointer hover:underline mt-2 inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                Change photo
              </label>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 animate-fade-in-up stagger-2">
          {/* Name */}
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              maxLength={20}
              className={cn(
                "w-full h-12 px-4 rounded-xl text-black text-sm placeholder:text-brown/50 focus:outline-none bg-white border border-brown-light/30",
                errors.name && "border-orange"
              )}
            />
            {errors.name && (
              <p className="text-orange text-xs mt-1 pl-2">{errors.name}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className={cn(
                "w-full h-12 px-4 rounded-xl text-black text-sm focus:outline-none bg-white border border-brown-light/30",
                !formData.dateOfBirth && "text-brown/50",
                errors.dateOfBirth && "border-orange"
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-orange text-xs mt-1 pl-2">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Country */}
          <div className="relative">
            <button
              ref={countryBtnRef}
              type="button"
              onClick={() => {
                if (!showCountryPicker && countryBtnRef.current) {
                  const rect = countryBtnRef.current.getBoundingClientRect();
                  setDropdownPosition({
                    top: rect.bottom + 8,
                    left: rect.left,
                    width: rect.width,
                  });
                }
                setShowCountryPicker(!showCountryPicker);
              }}
              className={cn(
                "w-full h-12 px-4 rounded-xl text-left flex items-center justify-between text-sm focus:outline-none bg-white border border-brown-light/30",
                formData.country ? "text-black" : "text-brown/50",
                errors.country && "border-orange"
              )}
            >
              <span>{formData.country || 'Select country'}</span>
              <ChevronDown className={cn(
                "h-4 w-4 text-brown transition-transform",
                showCountryPicker && "rotate-180"
              )} />
            </button>
            {errors.country && (
              <p className="text-orange text-xs mt-1 pl-2">{errors.country}</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 animate-fade-in-up stagger-3">
          <p className="text-black text-sm font-bold mb-2">Tell us about yourself</p>
          <div className="relative">
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 250) })}
              placeholder="A little something about you..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-black text-sm placeholder:text-brown/50 focus:outline-none bg-white border border-brown-light/30 resize-none"
            />
            <span className="absolute bottom-2 right-3 text-brown/40 text-[10px]">
              {formData.bio.length}/250
            </span>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mt-6 animate-fade-in-up stagger-4">
          <p className="text-black text-sm font-bold mb-2">Pick your interests</p>
          <p className="text-brown text-xs mb-3">Choose up to 5</p>

          {/* Selected interests */}
          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.interests.map((interest) => {
                const interestData = INTERESTS.find((i) => i.label === interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="h-8 px-3 rounded-full bg-blue text-white text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <span>{interestData?.emoji}</span>
                    <span>{interest}</span>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Search/add interests */}
          <input
            type="text"
            value={interestSearch}
            onChange={(e) => setInterestSearch(e.target.value)}
            placeholder="Search interests..."
            className="w-full h-10 px-4 rounded-xl text-black text-sm placeholder:text-brown/50 focus:outline-none bg-white border border-brown-light/30 mb-3"
          />

          {/* Interest suggestions */}
          <div className="flex flex-wrap gap-2">
            {(interestSearch ? filteredInterests : INTERESTS.filter(i => !formData.interests.includes(i.label)).slice(0, 8)).map((interest) => (
              <button
                key={interest.label}
                onClick={() => toggleInterest(interest.label)}
                disabled={formData.interests.length >= 5}
                className={cn(
                  "h-8 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all",
                  "bg-white border border-brown-light/30 text-brown hover:bg-brown-light/20 active:scale-95",
                  formData.interests.length >= 5 && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>{interest.emoji}</span>
                <span>{interest.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dev skip photo in dev mode */}
        {import.meta.env.DEV && !formData.photoPreview && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                photo: 'skip',
                photoPreview: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
              });
            }}
            className="mt-4 text-brown/50 text-xs text-center hover:text-brown transition-colors"
          >
            Skip photo in dev mode
          </button>
        )}
      </div>

      {/* Bottom button with shimmer gradient */}
      <div className="relative z-10 px-6 pb-8 pt-2 animate-fade-in-up stagger-5">
        <div className="w-full relative h-12 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full p-[1.5px] animate-gradient-shift"
            style={{
              background: 'linear-gradient(90deg, #D9081E, #E05A3D, #5865F2, #D9081E)',
              backgroundSize: '200% 100%',
            }}
          >
            <div className="w-full h-full rounded-full bg-brown-lighter" />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="absolute inset-0 z-10 flex items-center justify-center select-none active:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span className="text-sm text-black font-bold">Continue</span>
            )}
          </button>
        </div>
      </div>

      {/* Country Dropdown - Fixed position to avoid clipping */}
      {showCountryPicker && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setShowCountryPicker(false)}
          />
          {/* Dropdown */}
          <div
            className="fixed max-h-48 overflow-y-auto rounded-xl z-[100] bg-white border border-brown-light/30 shadow-lg"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {COUNTRIES.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, country });
                  setShowCountryPicker(false);
                  setErrors({ ...errors, country: undefined });
                }}
                className={cn(
                  "w-full px-4 py-3 text-left text-brown hover:bg-brown-light/20 transition-colors text-sm",
                  formData.country === country && "text-black bg-brown-light/20 font-medium"
                )}
              >
                {country}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
