import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authSliderService } from '../../../app/authSlider/authSlider';
import type { AuthSlider } from '../../../types/authSlider';

interface AuthSplitLayoutProps {
    children: React.ReactNode;
}

const FALLBACK_SLIDES: AuthSlider[] = [
    {
        id: 0,
        title: 'Welcome to Umukamezi',
        subtitle: 'Your global marketplace for trusted vendors and buyers.',
        image: '/Umukamezilogo.jpg',
        sort_order: 0,
        is_active: true,
        created_at: '',
        updated_at: null,
    },
];

const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({ children }) => {
    const [slides, setSlides] = useState<AuthSlider[]>([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        authSliderService
            .getActiveAuthSliders()
            .then((data) => setSlides(data.length ? data : FALLBACK_SLIDES))
            .catch(() => setSlides(FALLBACK_SLIDES));
    }, []);

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), 5500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const current = slides[active];

    return (
        <div className="min-h-screen w-full flex overflow-x-hidden bg-gradient-to-br from-[#141b29] via-[#1d293d] to-[#0d1219]">
            {/* Left: image slider */}
            <div className="hidden lg:block lg:w-1/2 min-w-0 relative overflow-hidden">
                <AnimatePresence mode="sync">
                    {current && (
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={current.image.startsWith('http') || current.image.startsWith('/Umukamezi')
                                    ? current.image
                                    : `${import.meta.env.VITE_API_BASE_URL}${current.image}`}
                                alt={current.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* gradient scrim for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1219]/90 via-[#0d1219]/20 to-[#0d1219]/40" />

                <div className="relative z-10 h-full flex flex-col justify-between p-10">
                    <a href="/" className="flex items-center gap-3 text-white">
                        <img src="/Umukamezilogo.jpg" alt="Umukamezi" className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-xl font-semibold tracking-tight">Umukamezi</span>
                    </a>

                    <AnimatePresence mode="wait">
                        {current && (
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6 }}
                                className="text-white max-w-md min-w-0"
                            >
                                <h2 className="text-3xl font-bold leading-tight mb-3 break-words">{current.title}</h2>
                                {current.subtitle && (
                                    <p className="text-white/80 text-base leading-relaxed break-words">{current.subtitle}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {slides.length > 1 && (
                        <div className="flex gap-2">
                            {slides.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActive(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: form panel */}
            <div className="w-full lg:w-1/2 min-w-0 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
                {/* subtle ambient glow, decorative only */}
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 w-full max-w-xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthSplitLayout;
