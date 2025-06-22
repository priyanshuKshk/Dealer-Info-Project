import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../animation/loadingSpinner.json'; // adjust path if needed

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
      <div className="w-28"
        style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Lottie animationData={animationData} loop={true} />
      </div>
      
    </div>
  );
}
