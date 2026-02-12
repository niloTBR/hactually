import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, Settings, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

/**
 * Profile Screen - User settings and logout
 */

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/welcome');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-brown-lighter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full flex items-center justify-center active:opacity-80 transition-opacity bg-brown-light/30"
        >
          <ChevronLeft className="h-5 w-5 text-brown" />
        </button>
        <span className="text-black font-bold">Profile</span>
        <div className="w-10" />
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center py-8">
        <div className="h-24 w-24 rounded-full bg-brown-light/40 overflow-hidden mb-4">
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <User className="h-10 w-10 text-brown" />
            </div>
          )}
        </div>
        <h1 className="text-black text-xl font-bold">{user?.name || 'User'}</h1>
        {user?.email && (
          <p className="text-brown text-sm mt-1">{user.email}</p>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4">
        <div className="bg-white rounded-2xl border border-brown-light/30 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 hover:bg-brown-lighter/50 transition-colors",
                index < menuItems.length - 1 && "border-b border-brown-light/20"
              )}
            >
              <item.icon className="h-5 w-5 text-brown" />
              <span className="text-black text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-6 py-4 rounded-2xl bg-orange/10 hover:bg-orange/20 transition-colors"
        >
          <LogOut className="h-5 w-5 text-orange" />
          <span className="text-orange font-bold text-sm">Log Out</span>
        </button>
      </div>

      {/* Version */}
      <div className="py-6 text-center">
        <p className="text-brown/40 text-xs">Version 1.0.0</p>
      </div>
    </div>
  );
}
