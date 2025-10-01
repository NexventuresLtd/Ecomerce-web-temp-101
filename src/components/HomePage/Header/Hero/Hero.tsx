// components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

import HeroImage from './HeroImage';
// import StatsDisplay from './StatsDisplay';
import CTAButtons from './CTAButtons';
import CarouselControls from './CarouselControls';
import { heroData } from '../../../../constants/HeroHome/HeroData';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.slides.length) % heroData.slides.length);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handlePrimaryClick = () => {
    console.log('Primary CTA clicked:', heroData.slides[currentSlide].ctaPrimary);
  };

  const handleSecondaryClick = () => {
    window.location.href = "/products";
  };

  const currentSlideData = heroData.slides[currentSlide];

  return (
    <section className="bg-primary/90 min-h-[500px] relative overflow-hidden justify-center items-center flex">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.imageUrl}   // use leading / if in public folder     // for mobile browsers
          className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-secondary/40 opacity-100"></div> {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-100"></div> {/* Overlay */}
      </div>

      <div className="w-full mx-auto px-6 py-12 relative z-10">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center hidden mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2 uppercase animate-bounce">Umukamezi wakamejeje</h1>
          {/* <p className="text-secondary text-lg">{"Shop With The Best Shop"}</p> */}
        </motion.div>

        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-1 justify-center gap-12 items-center max-w-11/12 mx-auto">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-2 lg:order-1 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 m-auto"
              >
                {/* Badge */}
                {currentSlideData.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className=" hidden justify-center items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/30"
                  >
                    <Zap className="w-4 h-4" />
                    {currentSlideData.badge}
                  </motion.div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
                >
                  {currentSlideData.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl hidden md:text-2xl text-secondary font-semibold"
                >
                  {currentSlideData.subtitle}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-lg mb-2 text-slate-300 leading-relaxed max-w-xl m-auto"
                >
                  {currentSlideData.description}
                </motion.p>
                {/* Stats */}
                {/* <StatsDisplay stats={currentSlideData.stats} /> */}

                {/* CTA Buttons */}
                <CTAButtons
                  primary={currentSlideData.ctaPrimary}
                  secondary={currentSlideData.ctaSecondary}
                  onPrimaryClick={handlePrimaryClick}
                  onSecondaryClick={handleSecondaryClick}
                />

              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 70 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <CarouselControls
                currentSlide={currentSlide}
                totalSlides={heroData.slides.length}
                onPrev={handlePrevSlide}
                onNext={handleNextSlide}
                onDotClick={handleDotClick}
              />
            </motion.div>

          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className="relative hidden h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-2"
          >
            <HeroImage
              currentSlide={currentSlide}
              imageUrl={currentSlideData.imageUrl}
            />
          </motion.div>
        </div>
      </div>

      {/* Auto-play pause on hover */}
      <div
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute inset-0"
      ></div>
    </section>
  );
};

export default Hero;