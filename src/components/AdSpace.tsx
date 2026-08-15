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
      <span className="rd-caption mb-2">{label}</span>
      <div className="w-full min-h-[100px] rd-bg-faint border rd-hairline flex items-center justify-center rd-text-muted italic text-sm">
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
