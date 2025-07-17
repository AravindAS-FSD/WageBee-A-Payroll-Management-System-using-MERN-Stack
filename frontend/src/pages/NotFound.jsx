import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl mb-2">Oops! Page not found.</p>
      <p className="mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
