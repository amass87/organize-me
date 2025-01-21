import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function ErrorAlert({ message }) {
  return (
    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
      {message}
    </div>
  );
}
