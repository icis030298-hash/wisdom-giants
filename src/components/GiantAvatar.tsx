import React from 'react';

interface GiantAvatarProps {
  slug: string;
  category?: '성취' | '역경' | '지혜' | '창의';
  className?: string;
  size?: number;
}

const GiantAvatar: React.FC<GiantAvatarProps> = ({ slug, category, className = "", size = 200 }) => {
  const renderAvatar = () => {
    // 1. Steve Jobs
    if (slug === 'steve-jobs') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 140 160 190" fill="#000" />
          <rect x="85" y="145" width="30" height="20" rx="5" fill="#000" />
          <rect x="65" y="50" width="70" height="100" rx="35" fill="#fce7f3" fillOpacity="0.9" />
          <path d="M65 80 Q65 45 100 45 Q135 45 135 80" fill="#475569" />
          <circle cx="82" cy="100" r="12" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="118" cy="100" r="12" fill="none" stroke="#334155" strokeWidth="2" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#334155" strokeWidth="2" />
        </svg>
      );
    }

    // 2. Napoleon
    if (slug === 'napoleon') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e3a8a" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <path d="M30 80 L170 80 L100 30 Z" fill="#000" /> {/* Bicorne Hat */}
          <rect x="95" y="30" width="10" height="50" fill="#d4af37" />
        </svg>
      );
    }

    // 3. King Sejong
    if (slug === 'king-sejong') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#991b1b" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <path d="M70 65 L130 65 L130 45 L115 35 L85 35 L70 45 Z" fill="#000" /> {/* Ikseongwan */}
          <path d="M85 130 Q100 150 115 130" fill="none" stroke="#475569" strokeWidth="2" /> {/* Beard */}
        </svg>
      );
    }

    // 4. Elon Musk
    if (slug === 'elon-musk') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#334155" />
          <rect x="65" y="55" width="70" height="95" rx="32" fill="#fce7f3" />
          <path d="M65 80 Q65 50 100 50 Q135 50 135 80" fill="#1e293b" />
          <path d="M150 60 L160 40 L170 60 Z" fill="#f59e0b" /> {/* Rocket Symbol */}
        </svg>
      );
    }

    // 5. Genghis Khan
    if (slug === 'genghis-khan') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#78350f" />
          <rect x="65" y="65" width="70" height="85" rx="25" fill="#fde68a" />
          <path d="M55 70 Q100 30 145 70" fill="#451a03" /> {/* Fur Hat */}
          <path d="M80 135 L100 150 L120 135" fill="none" stroke="#451a03" strokeWidth="3" />
        </svg>
      );
    }

    // 6. Alexander the Great
    if (slug === 'alexander-the-great') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#94a3b8" />
          <rect x="65" y="70" width="70" height="80" rx="20" fill="#fde68a" />
          <path d="M60 80 Q100 10 140 80" fill="#d4af37" /> {/* Helmet */}
          <path d="M100 10 L100 50" stroke="#b91c1c" strokeWidth="8" />
        </svg>
      );
    }

    // 7. Walt Disney
    if (slug === 'walt-disney') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="68" y="60" width="64" height="90" rx="32" fill="#fce7f3" />
          <circle cx="75" cy="50" r="20" fill="#000" fillOpacity="0.5" /> {/* Mickey Ear L */}
          <circle cx="125" cy="50" r="20" fill="#000" fillOpacity="0.5" /> {/* Mickey Ear R */}
          <rect x="105" y="120" width="4" height="30" fill="#d4af37" transform="rotate(45 105 120)" /> {/* Pencil */}
        </svg>
      );
    }

    // 8. Thomas Edison
    if (slug === 'thomas-edison') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#334155" />
          <rect x="65" y="65" width="70" height="85" rx="30" fill="#fef3c7" />
          <circle cx="100" cy="40" r="15" fill="#fbbf24" className="animate-pulse" /> {/* Light Bulb */}
          <path d="M95 55 L105 55 L100 65 Z" fill="#94a3b8" />
        </svg>
      );
    }

    // 9. Julius Caesar
    if (slug === 'julius-caesar') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#f8fafc" />
          <rect x="65" y="65" width="70" height="85" rx="30" fill="#fde68a" />
          <path d="M60 80 Q100 60 140 80" fill="none" stroke="#10b981" strokeWidth="4" /> {/* Laurel Wreath */}
          <circle cx="65" cy="80" r="3" fill="#10b981" />
          <circle cx="135" cy="80" r="3" fill="#10b981" />
        </svg>
      );
    }

    // 10. Henry Ford
    if (slug === 'henry-ford') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="68" y="60" width="64" height="90" rx="32" fill="#fce7f3" />
          <path d="M65 65 L135 65 L130 50 L70 50 Z" fill="#334155" /> {/* Cap */}
          <circle cx="100" cy="120" r="20" fill="none" stroke="#d4af37" strokeWidth="3" /> {/* Steering Wheel */}
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
