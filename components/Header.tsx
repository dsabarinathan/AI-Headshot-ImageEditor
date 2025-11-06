
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          AI Headshot & Image Editor
        </h1>
      </div>
    </header>
  );
};

export default Header;
