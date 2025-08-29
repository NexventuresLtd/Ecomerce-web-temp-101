import React, { useState, useRef, useEffect } from 'react';
import TopNav from './TopNav';
import SecondNav from './SecondNav';
import ThirdMenuNav from './ThirdMenuNav';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const secondNavRef = useRef<HTMLDivElement>(null);

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
  // useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (secondNavRef.current && !secondNavRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  // }, []);

  // Sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (secondNavRef.current) {
        const offsetTop = secondNavRef.current.offsetTop;
        setIsSticky(window.scrollY > offsetTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full bg-white">
      <TopNav />

      <div
        ref={secondNavRef}
        className={`w-full z-50 ${isSticky ? 'fixed top-0 left-0 shadow-sm' : 'relative'}`}
      >
        <SecondNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setActiveDropdown={setActiveDropdown}
        />
      </div>

      <ThirdMenuNav
        activeDropdown={activeDropdown}
        handleClickOutside={handleClickOutside}
        setIsMenuOpen={setIsMenuOpen}
        isMobile={isMobile}
        setActiveDropdown={setActiveDropdown}
        isMenuOpen={isMenuOpen}
      />
    </nav>
  );
};

export default Navbar;
