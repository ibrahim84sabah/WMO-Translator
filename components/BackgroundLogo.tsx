
import React from 'react';

export const BackgroundLogo: React.FC = () => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
          <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#glow)" stroke="url(#logoGradient)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Hexagon Shape */}
        <path d="M200 40 L338 120 L338 280 L200 360 L62 280 L62 120 Z" />

        {/* Internal Circuit Lines */}
        <path d="M200 40 L200 80" strokeWidth="3" />
        <path d="M338 120 L300 142" strokeWidth="3" />
        <path d="M338 280 L300 258" strokeWidth="3" />
        <path d="M200 360 L200 320" strokeWidth="3" />
        <path d="M62 280 L100 258" strokeWidth="3" />
        <path d="M62 120 L100 142" strokeWidth="3" />

        {/* Circuit Dots */}
        <circle cx="200" cy="30" r="4" fill="#06b6d4" stroke="none" />
        <circle cx="348" cy="115" r="4" fill="#8b5cf6" stroke="none" />
        <circle cx="52" cy="285" r="4" fill="#06b6d4" stroke="none" />

        {/* Text 'IS' - Stylized */}
        <text 
          x="200" 
          y="265" 
          textAnchor="middle" 
          fontSize="160" 
          fontWeight="800" 
          fill="url(#logoGradient)" 
          stroke="none" 
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-5px' }}
        >
          IS
        </text>

        {/* Swoosh Ring Effect */}
        <path 
          d="M40 200 Q 200 420 360 200" 
          stroke="url(#logoGradient)" 
          strokeWidth="3" 
          opacity="0.4"
          strokeDasharray="10 10"
        />
      </g>
    </svg>
  );
};
