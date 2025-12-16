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
  const thirdMenuRef = useRef<HTMLDivElement>(null);

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
      const target = event.target as Node;
      
      // Check if click is outside third menu
      const isOutsideThirdMenu = thirdMenuRef.current && !thirdMenuRef.current.contains(target);
      
      if (isOutsideThirdMenu) {
        setActiveDropdown(null);
        if (isMobile) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  // Handle click outside for desktop dropdown
  const handleClickOutside = (event: any) => {
    if (!isMobile) {
      const target = event.target as Node;
      const isOutsideThirdMenu = thirdMenuRef.current && !thirdMenuRef.current.contains(target);
      
      if (isOutsideThirdMenu) {
        setActiveDropdown(null);
      }
    }
  };

  // Close dropdown on scroll on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && isMenuOpen) {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isMenuOpen]);

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
        className={`w-full z-40 ${isSticky ? 'fixed top-0 left-0 shadow-sm' : 'relative'}`}
      >
        <SecondNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setActiveDropdown={setActiveDropdown}
        />
      </div>

      <div ref={thirdMenuRef}>
        <ThirdMenuNav
          activeDropdown={activeDropdown}
          handleClickOutside={handleClickOutside}
          setIsMenuOpen={setIsMenuOpen}
          isMobile={isMobile}
          setActiveDropdown={setActiveDropdown}
          isMenuOpen={isMenuOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;