import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * GradientVeil - Soft blurred gradient overlay effect
 * Based on ReactBits Aurora/Veil effect
 * Uses CSS classes from animations.css
 */

const PRESETS = {
  orange: {
    colors: ['#D9081E', '#E0593D', '#FF7F5C'],
  },
  blue: {
    colors: ['#083D9C', '#314988', '#5865F2'],
  },
  pink: {
    colors: ['#EC4899', '#F472B6', '#FBCFE8'],
  },
};

const POSITIONS = {
  top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/3',
  bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export function GradientVeil({
  className,
  preset = 'orange',
  colors,
  opacity = 0.4,
  blur = 'blur-[120px]',
  size = 'w-[150%] h-[60%]',
  position = 'top',
  animate = false,
}) {
  const colorSet = colors || PRESETS[preset]?.colors || PRESETS.orange.colors;

  // Build gradient with opacity
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  const halfOpacityHex = Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0');

  const gradientStyle = {
    background: `radial-gradient(ellipse at center, ${colorSet[0]}${opacityHex} 0%, ${colorSet[1]}${halfOpacityHex} 40%, transparent 70%)`,
  };

  return (
    <div
      className={cn(
        'absolute pointer-events-none',
        size,
        blur,
        POSITIONS[position],
        animate && 'animate-pulse',
        className
      )}
      style={gradientStyle}
    />
  );
}

export default GradientVeil;
