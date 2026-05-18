import React from 'react';

interface AdSpaceProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  slot, 
  format = 'auto', 
  className = '', 
  label = 'ADVERTISEMENT' 
}) => {
  return (
    <div className={`w-full my-8 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] text-slate-500 mb-2 tracking-widest">{label}</span>
      <div className="w-full min-h-[100px] bg-navy-light/30 border border-gold-antique/10 flex items-center justify-center text-slate-600 italic text-sm">
        {/* Google AdSense will be injected here */}
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-2081809442345110"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

export default AdSpace;
