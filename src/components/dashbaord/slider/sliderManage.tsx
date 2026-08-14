import React from 'react';
import { Sliders } from 'lucide-react';

const HeroSliderManager: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hero Slider Manager</h1>
          <p className="text-sm text-gray-500">Manage promotional slides featured on the homepage hero banner.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sliders className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Homepage Hero Banners</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Active banners are served dynamically to visitors on the homepage.
        </p>
      </div>
    </div>
  );
};

export default HeroSliderManager;
