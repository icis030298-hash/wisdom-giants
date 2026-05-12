import React from 'react';

interface GiantAvatarProps {
  slug: string;
  category?: '성취' | '역경' | '지혜' | '창의';
  className?: string;
  size?: number;
}

const GiantAvatar: React.FC<GiantAvatarProps> = ({ slug, category, className = "", size = 200 }) => {
  const renderAvatar = () => {
    // Specific Illustrator for famous ones
    if (slug === 'steve-jobs') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background Circle */}
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.3" />
          
          {/* Body - Black Turtleneck */}
          <path d="M40 190 Q100 140 160 190" fill="#000" />
          <rect x="85" y="145" width="30" height="20" rx="5" fill="#000" />
          
          {/* Head */}
          <rect x="65" y="50" width="70" height="100" rx="35" fill="#fce7f3" fillOpacity="0.9" />
          
          {/* Hair - Short & Gray */}
          <path d="M65 80 Q65 45 100 45 Q135 45 135 80" fill="#475569" />
          
          {/* Glasses - Round */}
          <circle cx="82" cy="100" r="12" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="118" cy="100" r="12" fill="none" stroke="#334155" strokeWidth="2" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#334155" strokeWidth="2" />
          
          {/* Eyes */}
          <circle cx="82" cy="100" r="2" fill="#1e293b" />
          <circle cx="118" cy="100" r="2" fill="#1e293b" />
          
          {/* Mouth */}
          <path d="M95 135 Q100 138 105 135" fill="none" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      );
    }

    // Generic Category-based Silhouette
    const themeColor = {
      '성취': '#f59e0b', // Amber
      '역경': '#10b981', // Emerald
      '지혜': '#3b82f6', // Blue
      '창의': '#a855f7', // Purple
    }[category || '지혜'];

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="95" fill="#1e293b" />
        <circle cx="100" cy="100" r="90" fill="#0f172a" stroke={themeColor} strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Silhouette Body */}
        <path d="M50 190 Q100 130 150 190" fill={themeColor} fillOpacity="0.2" />
        
        {/* Silhouette Head */}
        <circle cx="100" cy="85" r="40" fill={themeColor} fillOpacity="0.3" />
        
        {/* Identity Mark */}
        <path d="M90 85 L110 85 L100 70 Z" fill={themeColor} />
      </svg>
    );
  };

  return (
    <div className={`relative inline-block overflow-hidden rounded-full border-2 border-gold-antique/20 bg-navy-dark shadow-2xl ${className}`} style={{ width: size, height: size }}>
      {renderAvatar()}
    </div>
  );
};

export default GiantAvatar;
