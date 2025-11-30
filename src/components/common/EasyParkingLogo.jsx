import React from 'react';

const EasyParkingLogo = ({ width = 120, height = 80, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src="/src/assets/images/easy-parking-logo.png"
        alt="Easy Parking Logo"
        className="w-full h-full object-contain"
        style={{ width, height }}
      />
    </div>
  );
};

export default EasyParkingLogo;