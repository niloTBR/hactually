import * as React from 'react';

/**
 * Phone Frame - Wraps content in a mobile device mockup
 * For desktop testing with realistic mobile dimensions
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-8">
      {/* Phone device frame */}
      <div className="relative">
        {/* Device shell */}
        <div className="w-[375px] h-[812px] bg-neutral-800 rounded-[3rem] p-3 shadow-2xl border border-neutral-700">
          {/* Screen */}
          <div className="w-full h-full bg-purple-950 rounded-[2.25rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-neutral-800 rounded-b-2xl z-50" />

            {/* App content */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50" />
          </div>
        </div>

        {/* Device label */}
        <p className="text-neutral-500 text-xs text-center mt-4">
          iPhone 14 Pro · 375 × 812
        </p>
      </div>
    </div>
  );
}
