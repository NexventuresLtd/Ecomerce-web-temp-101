import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Users,
    Globe,
    Shield,
    Truck,
    CheckCircle,
    Heart,
    Target,
    Eye,
    Star,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Navbar from '../components/SharedComp/navabaritems/NavBar';
import Footer from '../components/SharedComp/footer';

// Data interfaces
interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    bio?: string;
}

interface Stat {
    id: number;
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
}

interface USPItem {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

interface ValueItem {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

// Mock data
const aboutData = {
    hero: {
        title: "About NexShop",
        subtitle: "Connecting buyers and sellers in a seamless marketplace experience"
    },
    story: {
        title: "Our Story",
        content: "Founded in 2023, NexShop emerged from a vision to create the most trusted and efficient marketplace platform. We believe in empowering businesses of all sizes to reach global audiences while providing customers with unparalleled shopping experiences.",
        mission: "To revolutionize e-commerce by building bridges between quality sellers and discerning buyers worldwide.",
        vision: "To become the world's most trusted marketplace where everyone can buy and sell with confidence."
    },
    values: [
        {
            id: 1,
            icon: <Shield className="w-8 h-8" />,
            title: "Trust & Security",
            description: "We prioritize the safety and security of every transaction, ensuring peace of mind for all our users."
        },
        {
            id: 2,
            icon: <Heart className="w-8 h-8" />,
            title: "Customer First",
            description: "Every decision we make is centered around delivering exceptional value and experience to our customers."
        },
        {
            id: 3,
            icon: <Target className="w-8 h-8" />,
            title: "Innovation",
            description: "We continuously evolve our platform using cutting-edge technology to stay ahead of market needs."
        }
    ] as ValueItem[],
    uspItems: [
        {
            id: 1,
            icon: <Shield className="w-12 h-12" />,
            title: "Secure Payments",
            description: "Bank-level encryption and fraud protection for every transaction"
        },
        {
            id: 2,
            icon: <Truck className="w-12 h-12" />,
            title: "Fast Delivery",
            description: "Express shipping options with real-time tracking across the globe"
        },
        {
            id: 3,
            icon: <CheckCircle className="w-12 h-12" />,
            title: "Verified Sellers",
            description: "All sellers undergo strict verification to ensure quality and authenticity"
        },
        {
            id: 4,
            icon: <Users className="w-12 h-12" />,
            title: "24/7 Support",
            description: "Round-the-clock customer support to assist you whenever you need help"
        }
    ] as USPItem[],
    team: [
        {
            id: 1,
            name: "Umukamezi Wakamejeje",
            role: "CEO & Founder",
            image: "kad.jpeg",
            bio: "Former e-commerce executive with 15+ years of experience"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "CTO",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            bio: "Tech visionary specializing in scalable marketplace solutions"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            bio: "Operations expert focused on streamlining seller experiences"
        },
        {
            id: 4,
            name: "David Kim",
            role: "Head of Design",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            bio: "UX/UI designer passionate about creating intuitive experiences"
        }
    ] as TeamMember[],
    stats: [
        {
            id: 1,
            icon: <ShoppingBag className="w-8 h-8" />,
            value: 250000,
            label: "Products",
            suffix: "+"
        },
        {
            id: 2,
            icon: <Users className="w-8 h-8" />,
            value: 15000,
            label: "Active Sellers",
            suffix: "+"
        },
        {
            id: 3,
            icon: <Globe className="w-8 h-8" />,
            value: 45,
            label: "Countries",
            suffix: ""
        }
    ] as Stat[],
    testimonials: [
        {
            id: 1,
            name: "Alex Thompson",
            role: "Small Business Owner",
            content: "NexShop transformed my local business into a global operation. The platform is incredibly user-friendly and the support team is outstanding.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Maria Garcia",
            role: "Fashion Retailer",
            content: "The verification process gave me confidence, and the sales tools are fantastic. I've tripled my revenue since joining NexShop.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "James Wilson",
            role: "Regular Customer",
            content: "Shopping on NexShop is always a great experience. Fast delivery, quality products, and excellent customer service every time.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face"
        }
    ] as Testimonial[]
};

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Components
const AboutHero: React.FC = () => {
    return (
        <section className="bg-primary text-white py-20 px-4">
            <div className="max-w-full md:max-w-11/12 mx-auto text-center">
                <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-6"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {aboutData.hero.title}
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {aboutData.hero.subtitle}
                </motion.p>
            </div>
        </section>
    );
};

const StorySection: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">{aboutData.story.title}</h2>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        {aboutData.story.content}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <motion.div
                        className="bg-blue-50 p-8 rounded-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Eye className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">{aboutData.story.mission}</p>
                    </motion.div>

                    <motion.div
                        className="bg-green-50 p-8 rounded-2xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Target className="w-12 h-12 text-green-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">{aboutData.story.vision}</p>
                    </motion.div>
                </div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {aboutData.values.map((value) => (
                        <motion.div
                            key={value.id}
                            className="text-center p-6 bg-gray-50 rounded-2xl"
                            variants={fadeInUp}
                        >
                            <div className="text-primary mb-4 flex justify-center">
                                {value.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                            <p className="text-gray-600">{value.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const USPSection: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose NexShop</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We provide everything you need for a seamless marketplace experience
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {aboutData.uspItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className="bg-white p-8 rounded-2xl text-center hover:bg-blue-50 transition-colors duration-300"
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                        >
                            <div className="text-primary mb-6 flex justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const TeamSection: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The passionate individuals behind NexShop's success
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {aboutData.team.map((member) => (
                        <motion.div
                            key={member.id}
                            className="text-center group"
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                        >
                            <div className="relative mb-6">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-48 h-48 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                            <p className="text-primary font-medium mb-3">{member.role}</p>
                            <p className="text-gray-600 text-sm">{member.bio}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const StatsSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const CounterAnimation: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            const stepDuration = duration / steps;

            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }, [isVisible, value]);

        return <span>{count.toLocaleString()}{suffix}</span>;
    };

    return (
        <section className="py-20 px-4 bg-primary text-white">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
                    <p className="text-xl opacity-90">Numbers that speak for themselves</p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-12"
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    onViewportEnter={() => setIsVisible(true)}
                    viewport={{ once: true }}
                >
                    {aboutData.stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            className="text-center"
                            variants={fadeInUp}
                        >
                            <div className="mb-4 flex justify-center opacity-80">
                                {stat.icon}
                            </div>
                            <div className="text-4xl md:text-5xl font-bold mb-2">
                                <CounterAnimation value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-lg opacity-90">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % aboutData.testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + aboutData.testimonials.length) % aboutData.testimonials.length);
    };

    useEffect(() => {
        const interval = setInterval(nextTestimonial, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                    <p className="text-lg text-gray-600">Hear from our satisfied customers and sellers</p>
                </motion.div>

                <div className="relative">
                    <motion.div
                        key={currentIndex}
                        className="bg-white p-8 rounded-2xl text-center"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-center mb-6">
                            {[...Array(aboutData.testimonials[currentIndex].rating)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                            ))}
                        </div>

                        <blockquote className="text-lg text-gray-700 mb-8 italic">
                            "{aboutData.testimonials[currentIndex].content}"
                        </blockquote>

                        <div className="flex items-center justify-center">
                            <img
                                src={aboutData.testimonials[currentIndex].avatar}
                                alt={aboutData.testimonials[currentIndex].name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900">{aboutData.testimonials[currentIndex].name}</h4>
                                <p className="text-gray-600 text-sm">{aboutData.testimonials[currentIndex].role}</p>
                            </div>
                        </div>
                    </motion.div>

                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="flex justify-center mt-6 space-x-2">
                        {aboutData.testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const CTASection: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div {...fadeInUp}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Join NexShop Today</h2>
                    <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                        Whether you're looking to shop for amazing products or grow your business,
                        NexShop is the perfect platform for you.
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <motion.button
                            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-w-48"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Shop Now
                        </motion.button>
                        <motion.button
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-w-48"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Become a Seller
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

// Main About Page Component
const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <AboutHero />
            <StorySection />
            <USPSection />
            <TeamSection />
            <StatsSection />
            <Testimonials />
            <CTASection />
            <Footer />
        </div>
    );
};

export default AboutPage;