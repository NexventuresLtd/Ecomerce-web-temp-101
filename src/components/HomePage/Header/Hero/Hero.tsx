// components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlider } from '../../../../types/sliders';
import { heroSliderService } from '../../../../app/sliders/sliders';


const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero sliders from backend
  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      setLoading(true);
      setError(null);
      const slidersData = await heroSliderService.getActiveHeroSliders();
      setSliders(slidersData);
    } catch (error) {
      console.error('Error loading hero sliders:', error);
      setError('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliders.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleShopNow = () => {
    window.location.href = "/products";
  };

  // If no sliders or loading/error, show fallback
  if (loading) {
    return (
      <section className="bg-gray-900 min-h-[500px] relative overflow-hidden flex justify-center items-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading hero content...</p>
        </div>
      </section>
    );
  }

  if (error || sliders.length === 0) {
    return (
      <section className="bg-gradient-to-r from-slate-900 to-gray-800 min-h-[560px] relative overflow-hidden flex justify-center items-center">
        <div className="text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-lg mb-6">Discover amazing products at great prices</p>
          <button
            onClick={handleShopNow}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </section>
    );
  }

  const currentSlider = sliders[currentSlide];

  return (
    <section className="bg-primary/90 min-h-[560px] relative overflow-hidden justify-center items-center flex">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {currentSlider?.image && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${currentSlider.image}`}
            alt={currentSlider.title}
            className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-40"
            onError={(e) => {
              console.error('Error loading hero image:', currentSlider.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-secondary/40 opacity-100"></div>
        <div className="absolute inset-0 bg-black/50 opacity-100"></div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 py-12 relative z-10 cursor-pointer max-w-7xl">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-1 justify-center gap-8 sm:gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6 m-auto max-w-7xl"
              >

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl  capitalize sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                >
                  {currentSlider.title}
                </motion.h2>

                {/* Subtitle */}
                {currentSlider.subtitle && (
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl sm:text-xl capitalize text-white "
                  >
                    {currentSlider.subtitle}
                  </motion.h3>
                )}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleShopNow}
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3 bg-primary text-white cursor-pointer rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Shop Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-8 sm:pt-12"
            >
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {/* Previous Button */}
                <button
                  onClick={handlePrevSlide}
                  className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Dots */}
                <div className="flex gap-2 sm:gap-3">
                  {sliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextSlide}
                  className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Auto-play indicator */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-xs text-white/70">
                  {isAutoPlaying ? 'Auto-playing' : 'Paused'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Auto-play pause on hover */}
      <div
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute inset-0"
      />
    </section>
  );
};

export default Hero;