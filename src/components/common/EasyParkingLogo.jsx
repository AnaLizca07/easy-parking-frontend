import React from 'react';
import logoImg from '../../assets/images/easy-parking-logo.png';

const EasyParkingLogo = ({ width = 120, height = 80, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src={logoImg}
        alt="Easy Parking Logo"
        className="w-full h-full object-contain"
        style={{ width, height }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div
        className="w-full h-full flex items-center justify-center bg-white rounded-lg font-bold text-primary-600 border border-primary-200"
        style={{ width, height, display: 'none' }}
      >
        Easy Parking
      </div>
    </div>
  );
};

export default EasyParkingLogo;