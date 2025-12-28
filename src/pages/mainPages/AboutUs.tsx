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
    ChevronRight,
    Mail,
    RefreshCw,
    Ruler
} from 'lucide-react';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Footer from '../../components/SharedComp/footer';

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
        title: "About Umukamezi",
        subtitle: "Connecting buyers and sellers in a seamless marketplace experience"
    },
    story: {
        title: "Our Story",
        content: "Founded in 2020, Umukamezi emerged from a vision to create the most trusted and efficient marketplace platform. We believe in empowering businesses of all sizes to reach global audiences while providing customers with unparalleled shopping experiences.",
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
        // {
        //     id: 2,
        //     name: "Chancelline niyo",
        //     role: "CTO",
        //     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        //     bio: "Tech visionary specializing in scalable marketplace solutions"
        // },
        // {
        //     id: 3,
        //     name: "Emily Rodriguez",
        //     role: "Head of Operations",
        //     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        //     bio: "Operations expert focused on streamlining seller experiences"
        // },
        // {
        //     id: 4,
        //     name: "David Kim",
        //     role: "Head of Design",
        //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        //     bio: "UX/UI designer passionate about creating intuitive experiences"
        // }
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
            name: "Alex nkurunziza",
            role: "Photographer",
            content: "I purchased the Canon EOS R10 with the 18–45mm lens from Umukamezi. Image quality is sharp, autofocus is fast, and it performs exceptionally well for both photography and video. Delivery was prompt and the packaging was secure.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Loue Sauveur christian",
            role: "Hobby Photographer",
            content: "The Sony ZV-E10 camera I bought is perfect for vlogging and YouTube content. Excellent low-light performance, clean HDMI output, and solid build quality. The product was genuine and exactly as described.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "Alain Muhirwa Micheal",
            role: "Hobby Photographer",
            content: "I ordered a Nikon D7500 along with a 50mm f/1.8 lens. The camera handles fast motion very well and the lens produces beautiful background blur. I’m extremely satisfied with the purchase.",
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Umukamezi</h2>
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
    const [activeTab, setActiveTab] = useState<string>('story');

    const tabs = [
        { id: 'story', label: 'Our Story' },
        { id: 'info', label: 'Basic Info' },
        { id: 'support', label: 'Customer Support' },
        { id: 'shipping', label: 'Shipping & Returns' },
    ];


    const tabContent: any = {
        story: (
            <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                    Umukamezi was founded by Khadafi with a vision to revolutionize the way people
                    connect and do business. Our journey began with a simple idea: to create a platform
                    that empowers both buyers and sellers in a seamless marketplace experience.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    From humble beginnings, we've grown into a trusted platform serving thousands of
                    users across multiple countries. Our commitment to quality, security, and customer
                    satisfaction has been the driving force behind our success.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Watch our Instagram Reel to learn more about our story and the passion that fuels
                    our mission to connect people through commerce.
                </p>
            </div>
        ),
        info: (
            <div className="space-y-4">
                <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Low Price Guarantee</h4>
                        <p className="text-gray-700">We guarantee the lowest prices on all our products.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Shield className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Secure Shopping</h4>
                        <p className="text-gray-700">Your transactions are always safe and protected.</p>
                    </div>
                </div>
            </div>
        ),
        support: (
            <div className="space-y-4">
                <div className="flex items-start">
                    <Users className="w-6 h-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">24/7 Customer Support</h4>
                        <p className="text-gray-700">We are here for you 24/7 online and via phone.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Mail className="w-6 h-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Multiple Contact Options</h4>
                        <p className="text-gray-700">E-Mail - Text - Call - We're always available.</p>
                    </div>
                </div>
            </div>
        ),
        shipping: (
            <div className="space-y-4">
                <div className="flex items-start">
                    <Truck className="w-6 h-6 text-teal-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Worldwide Shipping</h4>
                        <p className="text-gray-700">We'd love to expand our business Internationally soon.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <RefreshCw className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                        <p className="text-gray-700">Not satisfied? We offer hassle-free returns.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <Ruler className="w-6 h-6 text-pink-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-900">Sizing & Color</h4>
                        <p className="text-gray-700">Comprehensive sizing guides and color accuracy.</p>
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-full md:max-w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    {...fadeInUp}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Story of Umukamezi</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our journey and services
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left side - Tabs */}

                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <img
                            src="kad.jpeg"
                            alt="Khadafi"
                            className="w-full h-[500px] aspect-video object-cover rounded-2xl shadow-lg group-hover:opacity-90 transition-opacity duration-300"
                        />
                        {/* Video icon overlay */}
                        <a
                            href="https://www.instagram.com/reel/Burya_uzakire/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <div className="bg-primary bg-opacity-80 rounded-full p-4">
                                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </a>
                    </motion.div>
                    {/* Right side - Image with video icon */}
                    <motion.div
                        className="bg-gray-50 p-6 rounded-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[200px]"
                        >
                            {tabContent[activeTab]}
                        </motion.div>
                    </motion.div>
                </div>
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
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Umukamezi Today</h2>
                    <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
                        Whether you're looking to shop for amazing products or grow your business,
                        Umukamezi is the perfect platform for you.
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
                            onClick={()=> window.location.href="/products"}
                        >
                            Shop Now
                        </motion.button>
                        <motion.button
                            className="bg-transparent hidden border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors min-w-48"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={()=>window.location.href ="/login"}
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