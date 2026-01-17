/**
 * ============================================================================
 * HACTUALLY DESIGN SYSTEM - UI COMPONENTS
 * ============================================================================
 *
 * Central export file for all UI components.
 * Import components like:
 *
 *   import { Button, ProfileCard, BottomNav } from '@/design-system/components/ui';
 *
 */

// Buttons
export {
  Button,
  buttonVariants,
  IconButton,
  iconButtonVariants,
  SpotButton,
  SuperspotButton,
  CheckInButton,
  RejectButton,
  FAB,
} from './Button';

// Cards
export {
  Card,
  cardVariants,
  ProfileCard,
  VenueCard,
  MatchCard,
  ProfilePreviewCard,
  MessagePreviewCard,
  CreditCard,
} from './Card';

// Inputs
export {
  Input,
  inputVariants,
  InputField,
  SearchInput,
  ChatInput,
  OTPInput,
  PhoneInput,
  Textarea,
  textareaVariants,
  Select,
  Toggle,
} from './Input';

// Avatar & Badges
export {
  Avatar,
  avatarVariants,
  AvatarGroup,
  Badge,
  badgeVariants,
  StatusBadge,
  NotificationBadge,
  VerifiedBadge,
  InterestTag,
  DistanceBadge,
  CreditsBadge,
} from './Avatar';

// Navigation
export {
  BottomNav,
  Header,
  headerVariants,
  HeaderAction,
  ProfileHeader,
  TabBar,
  SegmentedControl,
  Breadcrumb,
  PageIndicator,
} from './Navigation';

// Modals & Sheets
export {
  Overlay,
  Modal,
  modalVariants,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  BottomSheet,
  AlertDialog,
  ActionSheet,
  Toast,
  toastVariants,
} from './Modal';

// Map & Location
export {
  MapContainer,
  UserMarker,
  userMarkerVariants,
  VenueMarker,
  venueMarkerVariants,
  CurrentLocationMarker,
  MapPopup,
  LocationPermission,
  DistanceIndicator,
  NearbyUsersList,
  MapControls,
} from './Map';
