
import React from 'react';

export const BackgroundLogo: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img 
        src="https://pbs.twimg.com/profile_images/1456184918716334080/4N3aVv-H_400x400.jpg" 
        alt="IMOS Logo" 
        className="w-full h-full object-contain opacity-20 grayscale brightness-200 blur-[1px] scale-150"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

