import React from 'react';

export function AtomLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="atom-centerSphere" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="60%" stopColor="#FFC82A" />
          <stop offset="100%" stopColor="#00a896" />
        </radialGradient>
        <linearGradient id="atom-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC82A" />
          <stop offset="100%" stopColor="#00a896" />
        </linearGradient>
        <linearGradient id="atom-ring2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00a896" />
          <stop offset="100%" stopColor="#FFC82A" />
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="50" rx="18" ry="42" transform="rotate(45 50 50)" stroke="url(#atom-ring1)" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx="18" ry="42" transform="rotate(-45 50 50)" stroke="url(#atom-ring2)" strokeWidth="8" strokeLinecap="round" />
      <path d="M 20.3 79.7 A 18 42 45 0 1 79.7 20.3" stroke="url(#atom-ring1)" strokeWidth="8" strokeLinecap="round" />
      
      <circle cx="50" cy="50" r="16" fill="url(#atom-centerSphere)" />
    </svg>
  );
}

export function PulseLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00a896" />
          <stop offset="100%" stopColor="#FFC82A" />
        </linearGradient>
        <filter id="pulseShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.1" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#pulseGrad)" filter="url(#pulseShadow)" />
      <path d="M 22 52 L 40 52 L 50 25 L 65 75 L 75 52 L 78 52" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
