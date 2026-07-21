import React from 'react';

export default function BrandLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Center Sphere 3D Gradient */}
        <radialGradient id="centerSphere" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#FFB300" />
          <stop offset="85%" stopColor="#00B4D8" />
          <stop offset="100%" stopColor="#0077B6" />
        </radialGradient>

        {/* Primary Ring Gradient (Yellow to Teal) */}
        <linearGradient id="ring1" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#FFC82A" />
          <stop offset="50%" stopColor="#FF9F1C" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>

        {/* Secondary Ring Gradient (Teal to Yellow) */}
        <linearGradient id="ring2" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#00a896" />
          <stop offset="50%" stopColor="#028090" />
          <stop offset="100%" stopColor="#FFC82A" />
        </linearGradient>

        {/* Soft 3D Glow / Shadow */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>
        <filter id="sphereShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background Ring */}
      <ellipse 
        cx="50" cy="50" rx="18" ry="42" 
        transform="rotate(45 50 50)" 
        stroke="url(#ring1)" 
        strokeWidth="9" 
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* Foreground Ring */}
      <ellipse 
        cx="50" cy="50" rx="18" ry="42" 
        transform="rotate(-45 50 50)" 
        stroke="url(#ring2)" 
        strokeWidth="9" 
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* To create a true interlocking effect, we draw a quarter arc of the background ring over the foreground ring */}
      <path 
        d="M 20.3 79.7 A 18 42 45 0 1 79.7 20.3" 
        stroke="url(#ring1)" 
        strokeWidth="9" 
        strokeLinecap="round"
      />

      {/* Center 3D Sphere */}
      <circle 
        cx="50" cy="50" r="16" 
        fill="url(#centerSphere)" 
        filter="url(#sphereShadow)"
      />
    </svg>
  );
}
