import React from 'react';

interface GiantAvatarProps {
  slug: string;
  category: string;
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
          <circle cx="82" cy="100" r="2" fill="#334155" />
          <circle cx="118" cy="100" r="2" fill="#334155" />
          <path d="M98 115 L102 115" stroke="#334155" strokeWidth="1" />
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
          <path d="M30 80 L170 80 L100 30 Z" fill="#000" />
          <rect x="95" y="30" width="10" height="50" fill="#d4af37" />
          <circle cx="85" cy="105" r="3" fill="#334155" />
          <circle cx="115" cy="105" r="3" fill="#334155" />
          <path d="M98 115 L102 115" stroke="#334155" strokeWidth="2" />
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
          <path d="M70 65 L130 65 L130 45 L115 35 L85 35 L70 45 Z" fill="#000" />
          <circle cx="85" cy="100" r="2.5" fill="#334155" />
          <circle cx="115" cy="100" r="2.5" fill="#334155" />
          <path d="M100 110 L100 118" stroke="#334155" strokeWidth="1.5" />
          <path d="M85 130 Q100 150 115 130" fill="none" stroke="#475569" strokeWidth="2" />
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
          <circle cx="85" cy="95" r="3" fill="#1e293b" />
          <circle cx="115" cy="95" r="3" fill="#1e293b" />
          <path d="M98 105 L102 105" stroke="#1e293b" strokeWidth="2" />
          <path d="M150 60 L160 40 L170 60 Z" fill="#f59e0b" />
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
          <path d="M55 70 Q100 30 145 70" fill="#451a03" />
          <circle cx="85" cy="100" r="3.5" fill="#451a03" />
          <circle cx="115" cy="100" r="3.5" fill="#451a03" />
          <path d="M97 110 L103 110" stroke="#451a03" strokeWidth="2.5" />
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
          <path d="M60 80 Q100 10 140 80" fill="#d4af37" />
          <circle cx="85" cy="110" r="3" fill="#334155" />
          <circle cx="115" cy="110" r="3" fill="#334155" />
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
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M98 110 L102 110" stroke="#334155" strokeWidth="1.5" />
          <circle cx="75" cy="50" r="20" fill="#000" fillOpacity="0.5" />
          <circle cx="125" cy="50" r="20" fill="#000" fillOpacity="0.5" />
          <rect x="105" y="120" width="4" height="30" fill="#d4af37" transform="rotate(45 105 120)" />
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
          <circle cx="85" cy="105" r="3" fill="#334155" />
          <circle cx="115" cy="105" r="3" fill="#334155" />
          <path d="M98 115 L102 115" stroke="#334155" strokeWidth="2" />
          <circle cx="100" cy="40" r="15" fill="#fbbf24" className="animate-pulse" />
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
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M60 80 Q100 60 140 80" fill="none" stroke="#10b981" strokeWidth="4" />
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
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M65 65 L135 65 L130 50 L70 50 Z" fill="#334155" />
          <circle cx="100" cy="120" r="20" fill="none" stroke="#d4af37" strokeWidth="3" />
        </svg>
      );
    }

    // 11. Frida Kahlo
    if (slug === 'frida-kahlo') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#b91c1c" />
          <rect x="65" y="65" width="70" height="85" rx="30" fill="#fde68a" />
          <circle cx="85" cy="105" r="3" fill="#000" />
          <circle cx="115" cy="105" r="3" fill="#000" />
          <path d="M60 70 Q100 55 140 70" fill="#000" stroke="#000" strokeWidth="3" />
          <circle cx="80" cy="50" r="10" fill="#ef4444" />
          <circle cx="100" cy="45" r="10" fill="#f59e0b" />
          <circle cx="120" cy="50" r="10" fill="#ec4899" />
        </svg>
      );
    }

    // 12. Viktor Frankl
    if (slug === 'viktor-frankl') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#475569" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <circle cx="85" cy="100" r="2.5" fill="#334155" />
          <circle cx="115" cy="100" r="2.5" fill="#334155" />
          <rect x="75" y="90" width="20" height="15" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
          <rect x="105" y="90" width="20" height="15" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="4" />
        </svg>
      );
    }

    // 13. Oprah Winfrey
    if (slug === 'oprah-winfrey') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#4c1d95" />
          <rect x="65" y="60" width="70" height="90" rx="35" fill="#78350f" />
          <circle cx="85" cy="100" r="4" fill="#2d1303" />
          <circle cx="115" cy="100" r="4" fill="#2d1303" />
          <path d="M60 80 Q100 50 140 80" fill="#2d1303" />
          <rect x="110" y="120" width="10" height="30" rx="5" fill="#94a3b8" />
          <circle cx="115" cy="120" r="8" fill="#334155" />
        </svg>
      );
    }

    // 14. J.K. Rowling
    if (slug === 'jk-rowling') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e40af" />
          <rect x="65" y="60" width="70" height="95" rx="35" fill="#fef3c7" />
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M65 80 Q65 50 100 50 Q135 50 135 80" fill="#fde68a" />
          <line x1="120" y1="110" x2="160" y2="80" stroke="#78350f" strokeWidth="4" />
          <path d="M155 75 L165 65 L160 85" fill="#fbbf24" />
        </svg>
      );
    }

    // 15. Nelson Mandela
    if (slug === 'nelson-mandela') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#f59e0b" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#451a03" />
          <circle cx="85" cy="105" r="3" fill="#fef3c7" />
          <circle cx="115" cy="105" r="3" fill="#fef3c7" />
          <path d="M68 85 Q100 65 132 85" fill="#64748b" />
          <circle cx="150" cy="60" r="15" fill="#fff" />
          <path d="M140 60 L160 60 L150 70 Z" fill="#fff" />
        </svg>
      );
    }

    // 16. Helen Keller
    if (slug === 'helen-keller') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#065f46" />
          <rect x="68" y="60" width="64" height="90" rx="32" fill="#fef3c7" />
          <circle cx="85" cy="100" r="3" fill="#334155" fillOpacity="0.5" />
          <circle cx="115" cy="100" r="3" fill="#334155" fillOpacity="0.5" />
          <path d="M68 85 Q100 60 132 85" fill="#451a03" />
          <rect x="90" y="130" width="20" height="25" rx="2" fill="#fff" />
          <line x1="90" y1="140" x2="110" y2="140" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      );
    }

    // 17. Beethoven
    if (slug === 'beethoven') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#000" />
          <rect x="65" y="70" width="70" height="85" rx="30" fill="#fef3c7" />
          <circle cx="85" cy="110" r="3" fill="#334155" />
          <circle cx="115" cy="110" r="3" fill="#334155" />
          <path d="M50 80 Q100 10 150 80 Q160 110 140 120 Q100 100 60 120 Q40 110 50 80" fill="#e2e8f0" />
          <circle cx="150" cy="130" r="5" fill="#d4af37" />
          <line x1="155" y1="130" x2="155" y2="115" stroke="#d4af37" strokeWidth="2" />
        </svg>
      );
    }

    // 18. Stephen Hawking
    if (slug === 'stephen-hawking') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M30 190 L170 190 L170 140 L30 140 Z" fill="#334155" />
          <rect x="70" y="60" width="60" height="80" rx="10" fill="#fce7f3" />
          <circle cx="88" cy="100" r="2.5" fill="#334155" />
          <circle cx="112" cy="100" r="2.5" fill="#334155" />
          <path d="M70 80 Q100 60 130 80" fill="#451a03" />
          <rect x="140" y="140" width="30" height="20" rx="5" fill="#000" />
          <circle cx="155" cy="150" r="5" fill="#10b981" />
        </svg>
      );
    }

    // 19. Malala
    if (slug === 'malala') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1d4ed8" />
          <rect x="70" y="70" width="60" height="80" rx="30" fill="#78350f" />
          <circle cx="88" cy="110" r="3" fill="#2d1303" />
          <circle cx="112" cy="110" r="3" fill="#2d1303" />
          <path d="M55 70 Q100 40 145 70 L130 140 L70 140 Z" fill="#ef4444" fillOpacity="0.8" />
          <rect x="110" y="120" width="4" height="25" fill="#d4af37" />
        </svg>
      );
    }

    // 20. Franklin D. Roosevelt
    if (slug === 'franklin-roosevelt') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#fef3c7" />
          <circle cx="85" cy="105" r="3" fill="#334155" />
          <circle cx="115" cy="105" r="3" fill="#334155" />
          <path d="M68 85 Q100 65 132 85" fill="#94a3b8" />
          <circle cx="100" cy="130" r="10" fill="#334155" />
          <line x1="100" y1="140" x2="100" y2="160" stroke="#334155" strokeWidth="4" />
        </svg>
      );
    }

    // 21. Marcus Aurelius
    if (slug === 'marcus-aurelius') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#94a3b8" />
          <rect x="65" y="60" width="70" height="90" rx="30" fill="#fef3c7" />
          <path d="M65 75 Q100 55 135 75" fill="#475569" />
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M98 110 L102 110" stroke="#334155" strokeWidth="1.5" />
          <path d="M80 130 Q100 150 120 130" fill="none" stroke="#64748b" strokeWidth="3" />
        </svg>
      );
    }

    // 22. Seneca
    if (slug === 'seneca') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#94a3b8" />
          <rect x="70" y="65" width="60" height="85" rx="30" fill="#fef3c7" />
          <circle cx="88" cy="105" r="2.5" fill="#334155" />
          <circle cx="112" cy="105" r="2.5" fill="#334155" />
          <path d="M70 80 Q100 70 130 80" fill="#94a3b8" fillOpacity="0.5" />
          <rect x="90" y="130" width="20" height="25" rx="2" fill="#fff" />
        </svg>
      );
    }

    // 23. Confucius
    if (slug === 'confucius') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#fde68a" />
          <circle cx="88" cy="100" r="2.5" fill="#451a03" />
          <circle cx="112" cy="100" r="2.5" fill="#451a03" />
          <path d="M70 65 L130 65 L120 50 L80 50 Z" fill="#334155" />
          <path d="M100 115 L100 160" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }

    // 24. Socrates
    if (slug === 'socrates') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#94a3b8" />
          <rect x="65" y="70" width="70" height="80" rx="35" fill="#fef3c7" />
          <circle cx="85" cy="105" r="3" fill="#334155" />
          <circle cx="115" cy="105" r="3" fill="#334155" />
          <path d="M60 120 Q100 160 140 120 Q140 100 60 100 Z" fill="#e2e8f0" />
          <path d="M65 85 Q100 65 135 85" fill="#e2e8f0" />
        </svg>
      );
    }

    // 25. Lao Tzu
    if (slug === 'lao-tzu') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#065f46" />
          <rect x="70" y="70" width="60" height="80" rx="30" fill="#fde68a" />
          <circle cx="88" cy="105" r="2" fill="#451a03" />
          <circle cx="112" cy="105" r="2" fill="#451a03" />
          <path d="M100 115 L100 155" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M70 85 Q100 65 130 85" fill="#fff" />
        </svg>
      );
    }

    // 26. Aristotle
    if (slug === 'aristotle') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e40af" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#fef3c7" />
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M68 85 Q100 65 132 85" fill="#451a03" />
          <rect x="90" y="130" width="20" height="30" rx="2" fill="#fff" />
        </svg>
      );
    }

    // 27. Plato
    if (slug === 'plato') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#7c3aed" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#fef3c7" />
          <circle cx="85" cy="100" r="3" fill="#334155" />
          <circle cx="115" cy="100" r="3" fill="#334155" />
          <path d="M68 85 Q100 60 132 85" fill="#64748b" />
          <path d="M100 40 L100 60" stroke="#fbbf24" strokeWidth="2" />
        </svg>
      );
    }

    // 28. Mahatma Gandhi
    if (slug === 'mahatma-gandhi') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#f8fafc" />
          <rect x="70" y="70" width="60" height="80" rx="30" fill="#78350f" />
          <circle cx="88" cy="105" r="2" fill="#2d1303" />
          <circle cx="112" cy="105" r="2" fill="#2d1303" />
          <circle cx="88" cy="105" r="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="112" cy="105" r="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M70 85 Q100 75 130 85" fill="none" />
        </svg>
      );
    }

    // 29. Martin Luther King
    if (slug === 'martin-luther-king') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="70" y="65" width="60" height="85" rx="30" fill="#451a03" />
          <circle cx="88" cy="100" r="3" fill="#2d1303" />
          <circle cx="112" cy="100" r="3" fill="#2d1303" />
          <path d="M70 85 Q100 70 130 85" fill="#000" />
          <path d="M90 120 L110 120" stroke="#d4af37" strokeWidth="2" />
        </svg>
      );
    }

    // 30. Mother Teresa
    if (slug === 'mother-teresa') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#f8fafc" />
          <rect x="75" y="75" width="50" height="70" rx="25" fill="#fef3c7" />
          <circle cx="90" cy="105" r="2" fill="#334155" />
          <circle cx="110" cy="105" r="2" fill="#334155" />
          <path d="M60 70 Q100 40 140 70 L130 150 L70 150 Z" fill="#fff" stroke="#1e40af" strokeWidth="4" />
        </svg>
      );
    }

    // 31. Leonardo da Vinci
    if (slug === 'da-vinci') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#334155" />
          <rect x="68" y="65" width="64" height="85" rx="32" fill="#fef3c7" />
          <circle cx="85" cy="105" r="2.5" fill="#334155" /> {/* Eyes */}
          <circle cx="115" cy="105" r="2.5" fill="#334155" />
          <path d="M100 112 L100 120" stroke="#334155" strokeWidth="1.5" /> {/* Nose */}
          <path d="M60 70 L140 70 L135 55 L65 55 Z" fill="#000" /> {/* Beret */}
          <path d="M75 130 Q100 155 125 130" fill="none" stroke="#94a3b8" strokeWidth="2" /> {/* Beard */}
        </svg>
      );
    }

    // 32. Salvador Dali
    if (slug === 'salvador-dali') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="70" y="60" width="60" height="90" rx="30" fill="#fef3c7" />
          <circle cx="88" cy="100" r="3.5" fill="#000" /> {/* Wild Eyes */}
          <circle cx="112" cy="100" r="3.5" fill="#000" />
          <path d="M70 120 Q85 110 100 120 Q115 110 130 120" fill="none" stroke="#000" strokeWidth="2" /> {/* Mustache */}
          <path d="M70 120 L60 100" stroke="#000" strokeWidth="2" /> {/* Mustache tips up */}
          <path d="M130 120 L140 100" stroke="#000" strokeWidth="2" />
        </svg>
      );
    }

    // 33. Coco Chanel
    if (slug === 'coco-chanel') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#000" />
          <rect x="72" y="65" width="56" height="80" rx="28" fill="#fce7f3" />
          <circle cx="88" cy="100" r="2.5" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="100" r="2.5" fill="#334155" />
          <path d="M65 85 Q100 65 135 85" fill="#000" /> {/* Classic Bob Hair */}
          <circle cx="100" cy="130" r="8" fill="none" stroke="#fff" strokeWidth="2" /> {/* Pearls */}
        </svg>
      );
    }

    // 34. Pablo Picasso
    if (slug === 'picasso') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" stroke="#fff" strokeWidth="1" strokeDasharray="4" /> {/* Striped Shirt */}
          <rect x="70" y="65" width="60" height="85" rx="30" fill="#fef3c7" />
          <circle cx="85" cy="100" r="4" fill="#000" /> {/* Intense Eyes */}
          <circle cx="115" cy="100" r="4" fill="#000" />
          <path d="M70 80 Q100 70 130 80" fill="none" /> {/* Bald head */}
          <rect x="140" y="80" width="10" height="40" fill="#8b5cf6" transform="rotate(20)" /> {/* Brush */}
        </svg>
      );
    }

    // 35. Mozart
    if (slug === 'mozart') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#b91c1c" />
          <rect x="72" y="65" width="56" height="80" rx="28" fill="#fef3c7" />
          <circle cx="88" cy="105" r="2.5" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="105" r="2.5" fill="#334155" />
          <path d="M60 80 Q100 40 140 80 Q150 100 140 110 Q100 90 60 110 Q50 100 60 80" fill="#fff" /> {/* Powdered Wig */}
          <path d="M100 125 Q110 130 100 135" fill="none" stroke="#334155" strokeWidth="1" /> {/* Smile */}
        </svg>
      );
    }

    // 36. Shakespeare
    if (slug === 'shakespeare') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="70" y="65" width="60" height="85" rx="30" fill="#fef3c7" />
          <circle cx="88" cy="105" r="2.5" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="105" r="2.5" fill="#334155" />
          <path d="M70 85 Q100 65 130 85" fill="#451a03" /> {/* Receding Hairline */}
          <path d="M90 125 Q100 135 110 125" fill="none" stroke="#451a03" strokeWidth="2" /> {/* Small Beard */}
          <rect x="70" y="140" width="60" height="10" rx="2" fill="#fff" fillOpacity="0.5" /> {/* Collar */}
        </svg>
      );
    }

    // 37. Einstein
    if (slug === 'einstein') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#475569" />
          <rect x="70" y="70" width="60" height="80" rx="30" fill="#fef3c7" />
          <circle cx="88" cy="105" r="3" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="105" r="3" fill="#334155" />
          <path d="M45 80 Q100 10 155 80 Q165 120 140 130 Q100 110 60 130 Q35 120 45 80" fill="#fff" /> {/* Wild White Hair */}
          <path d="M85 125 Q100 115 115 125" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /> {/* Mustache */}
        </svg>
      );
    }

    // 38. Marie Curie
    if (slug === 'marie-curie') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#000" />
          <rect x="72" y="65" width="56" height="80" rx="28" fill="#fef3c7" />
          <circle cx="88" cy="105" r="2" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="105" r="2" fill="#334155" />
          <path d="M72 85 Q100 60 128 85" fill="#451a03" /> {/* Bun Hair */}
          <circle cx="100" cy="40" r="10" fill="#10b981" fillOpacity="0.6" className="animate-pulse" /> {/* Radium Glow */}
        </svg>
      );
    }

    // 39. Nikola Tesla
    if (slug === 'tesla') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e293b" />
          <rect x="70" y="65" width="60" height="90" rx="30" fill="#fef3c7" />
          <circle cx="88" cy="105" r="2.5" fill="#334155" /> {/* Eyes */}
          <circle cx="112" cy="105" r="2.5" fill="#334155" />
          <path d="M70 80 Q100 70 130 80" fill="#000" /> {/* Sharp Hair */}
          <path d="M100 115 L100 125" stroke="#334155" strokeWidth="1.5" /> {/* Nose */}
          <line x1="140" y1="50" x2="160" y2="70" stroke="#8b5cf6" strokeWidth="2" /> {/* Electricity */}
          <line x1="160" y1="50" x2="140" y2="70" stroke="#8b5cf6" strokeWidth="2" />
        </svg>
      );
    }

    // 40. Vincent van Gogh
    if (slug === 'van-gogh') {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="#1e293b" />
          <path d="M40 190 Q100 150 160 190" fill="#1e3a8a" />
          <rect x="70" y="65" width="60" height="85" rx="30" fill="#fde68a" />
          <circle cx="88" cy="105" r="3" fill="#10b981" /> {/* Piercing Eyes */}
          <circle cx="112" cy="105" r="3" fill="#10b981" />
          <path d="M70 85 Q100 65 130 85" fill="#f59e0b" /> {/* Orange Hair */}
          <path d="M70 120 Q100 150 130 120" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" /> {/* Orange Beard */}
          <circle cx="140" cy="100" r="10" fill="#fff" fillOpacity="0.4" /> {/* Ear Bandage */}
        </svg>
      );
    }

    // Generic Category-based Silhouette
    const colors: Record<string, string> = {
      '성취': '#f59e0b', // Amber
      '역경': '#ef4444', // Red
      '지혜': '#10b981', // Emerald
      '창의': '#8b5cf6', // Violet
    };
    
    const themeColor = colors[category] || '#d4af37';

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-40">
        <circle cx="100" cy="100" r="95" fill={themeColor} fillOpacity="0.1" stroke={themeColor} strokeWidth="2" />
        <path d="M40 190 Q100 140 160 190" fill={themeColor} />
        <circle cx="100" cy="90" r="50" fill={themeColor} />
      </svg>
    );
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {renderAvatar()}
    </div>
  );
};

export default GiantAvatar;
