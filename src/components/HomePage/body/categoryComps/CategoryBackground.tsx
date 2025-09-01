import React from 'react';


interface CategoryBackgroundProps {
  bgImage?: string; 
  bgColor: string;
  name: string;
}

const CategoryBackground: React.FC<CategoryBackgroundProps> = ({ 
  bgImage, 
  bgColor, 
  name 
}) => {
  if (bgImage) {
    return (
      <div className="absolute inset-0 z-10 overflow-hidden">
        <img 
          src={bgImage} 
          alt={`${name} background`}
          className="w-full h-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-40"
        />
        <div className={`absolute inset-0 ${bgColor} opacity-80`}></div>
      </div>
    );
  }
  
  return <div className={`absolute inset-0 ${bgColor} z-0`}></div>;
};

export default CategoryBackground;