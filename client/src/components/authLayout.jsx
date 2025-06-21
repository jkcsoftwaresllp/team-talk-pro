import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5dc] px-4">
      <div className="w-full max-w-md bg-white border border-[#4b2e2e] rounded-xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
