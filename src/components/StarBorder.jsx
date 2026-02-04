import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * StarBorder - Animated glowing border effect
 * Based on ReactBits StarBorder component
 */
const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'rgb(236, 72, 153)', // pink-500
  speed = '6s',
  children,
  ...rest
}) => {
  return (
    <Component
      className={cn(
        "relative inline-block rounded-full overflow-hidden",
        className
      )}
      {...rest}
    >
      {/* Animated gradient - bottom */}
      <div
        className="absolute w-[300%] h-1/2 -bottom-3 -right-[250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animation: `star-movement-bottom ${speed} linear infinite alternate`,
        }}
      />
      {/* Animated gradient - top */}
      <div
        className="absolute w-[300%] h-1/2 -top-3 -left-[250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animation: `star-movement-top ${speed} linear infinite alternate`,
        }}
      />
      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
