import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Phone,
    Mail,
    MapPin,
    Send,
    MessageCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github,
    ChevronDown,
    // ChevronUp,
    X
} from 'lucide-react';
import Footer from '../../components/SharedComp/footer';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';

export interface SocialLink {
    platform: string;
    url: string;
    icon: React.ReactNode;
}

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FAQ {
    question: string;
    answer: string;
}

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [showThankYou, setShowThankYou] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const socialLinks: SocialLink[] = [
        {
            platform: 'WhatsApp',
            url: 'https://wa.me/250781691713?text=Hello%2C%20I%27d%20like%20to%20get%20in%20touch%21',
            icon: <MessageCircle className="w-5 h-5" />
        },
        {
            platform: 'Facebook',
            url: 'https://facebook.com/yourpage',
            icon: <Facebook className="w-5 h-5" />
        },
        {
            platform: 'Twitter',
            url: 'https://twitter.com/yourhandle',
            icon: <Twitter className="w-5 h-5" />
        },
        {
            platform: 'Instagram',
            url: 'https://instagram.com/yourprofile',
            icon: <Instagram className="w-5 h-5" />
        },
        {
            platform: 'LinkedIn',
            url: 'https://linkedin.com/company/yourcompany',
            icon: <Linkedin className="w-5 h-5" />
        },
        {
            platform: 'GitHub',
            url: 'https://github.com/yourusername',
            icon: <Github className="w-5 h-5" />
        }
    ];

    const faqs: FAQ[] = [
        {
            question: "What's your typical response time?",
            answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, feel free to call us directly."
        },
        {
            question: "Do you offer free consultations?",
            answer: "Yes! We offer a complimentary 30-minute consultation to discuss your needs and how we can help achieve your goals."
        },
        {
            question: "What services do you provide?",
            answer: "We specialize in web development, mobile applications, UI/UX design, and digital marketing solutions tailored to your business needs."
        },
        {
            question: "Can you work with remote teams?",
            answer: "Absolutely! We have extensive experience working with distributed teams and use modern collaboration tools to ensure seamless communication."
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setShowThankYou(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-b border-gray-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </motion.p>
                </div>
            </motion.section>

            {/* Main Contact Section */}
            <section className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="xl:col-span-7"
                    >
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-12 h-fit">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
</div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-3">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-3">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder-gray-400"
                                        placeholder="Tell us more about your project or inquiry..."
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="w-full bg-primary text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="xl:col-span-5 space-y-8"
                    >
                        {/* Contact Info */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
                            <div className="space-y-6">
                                <motion.a
                                    href="tel:+1234567890"
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Phone</p>
                                        <p className="text-gray-600">+250 781 691 713</p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="mailto:info@umukamezi.com"
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Email</p>
                                        <p className="text-gray-600">info@umukamezi.com</p>
                                    </div>
                                </motion.a>

                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Address</p>
                                        <p className="text-gray-600">KN 70 St, Kigali<br />Rwanda<br />TCB Building</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.platform}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center
                                            ${social.platform === 'WhatsApp'
                                                ? 'border-green-100 text-green-600 hover:bg-green-50 hover:border-green-200'
                                                : social.platform === 'Facebook'
                                                    ? 'border-blue-100 text-primary hover:bg-blue-50 hover:border-blue-200'
                                                    : social.platform === 'Twitter'
                                                        ? 'border-sky-100 text-sky-600 hover:bg-sky-50 hover:border-sky-200'
                                                        : social.platform === 'Instagram'
                                                            ? 'border-pink-100 text-pink-600 hover:bg-pink-50 hover:border-pink-200'
                                                            : social.platform === 'LinkedIn'
                                                                ? 'border-blue-100 text-blue-700 hover:bg-blue-50 hover:border-blue-200'
                                                                : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                                            }
                                        `}
                                        title={`Connect on ${social.platform}`}
                                    >
                                        {social.icon}
                                        <span className="text-xs font-medium mt-2">{social.platform}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Google Maps Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
                <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Us</h3>
                        <p className="text-gray-600">Visit our office or get directions</p>
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.519504261303!2d30.0569646757598!3d-1.9450646367026134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca72d527d8581%3A0x462f8d5c5a3f4b1a!2sUMUKAMEZI%20LTD!5e0!3m2!1sen!2srw!4v1756711886697!5m2!1sen!2srw" className="w-full h-full" loading="lazy" ></iframe>
                    </div>
                </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white border-t border-gray-100 py-20"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-lg">Quick answers to common questions</p>
                    </div>

                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-100 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    </motion.div>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openFAQ === index ? 'auto' : 0,
                                        opacity: openFAQ === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-5 border-t border-gray-50">
                                        <p className="text-gray-600 pt-4 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-primary py-20"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-6"
                    >
                        Ready to get started?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        className="text-xl text-blue-100 mb-8 leading-relaxed"
                    >
                        Join our community and let's build something amazing together.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Join Our Community
                    </motion.button>
                </div>
            </motion.section>

            {/* Thank You Popup */}
            {showThankYou && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowThankYou(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Your message has been sent successfully. We'll get back to you within 24 hours.
                        </p>
                        <button
                            onClick={() => setShowThankYou(false)}
                            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto font-semibold"
                        >
                            <X className="w-4 h-4" />
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
            <Footer />
        </div>
    );
};

export default ContactPage;