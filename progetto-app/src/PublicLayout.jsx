import React from 'react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {children}
    </div>
  );
}
