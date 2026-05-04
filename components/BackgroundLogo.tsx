
import React from 'react';

export const BackgroundLogo: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img 
        src="/logo.png" 
        alt="IMOS Logo" 
        className="w-full h-full object-contain opacity-[0.06] scale-150"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.src.includes('logo.png')) {
            target.src = 'https://www.agromet.gov.iq/images/logo.png';
          } else if (target.src.includes('agromet')) {
            target.src = 'https://upload.wikimedia.org/wikipedia/ar/b/bb/Logo_of_the_Iraq_Meteorological_Organization_and_Seismology.png';
          }
        }}
      />
    </div>
  );
};

