import React, { useState, useRef, useEffect } from 'react';
import TopNav from './TopNav';
import SecondNav from './SecondNav';
import ThirdMenuNav from './ThirdMenuNav';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);


  // Check screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <nav className="w-full bg-white " ref={navRef}>

      {/**Navbar */}
      <TopNav />
      {/* Main Header */}
      <SecondNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />

      {/* Main Navigation */}
      <ThirdMenuNav activeDropdown={activeDropdown} setIsMenuOpen={setIsMenuOpen} isMobile={isMobile} setActiveDropdown={setActiveDropdown} isMenuOpen={isMenuOpen} />
    </nav>
  );
};

export default Navbar;