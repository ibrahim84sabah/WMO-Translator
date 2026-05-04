
import React from 'react';

export const BackgroundLogo: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img 
        src="https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1062579519072520" 
        alt="IMOS Logo" 
        className="w-full h-full object-contain opacity-[0.07] scale-150"
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (!(e.target as HTMLImageElement).src.includes('agromet')) {
            (e.target as HTMLImageElement).src = 'https://www.agromet.gov.iq/images/logo.png';
          }
        }}
      />
    </div>
  );
};

