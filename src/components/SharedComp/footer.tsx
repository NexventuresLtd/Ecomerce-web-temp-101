import React from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  // Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Smartphone,
  Shield,
  Truck,
  Music2Icon
} from 'lucide-react';

// Types
interface LinkItem {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ComponentType<any>;
  href: string;
  label: string;
}

interface FooterColumnProps {
  title: string;
  links: LinkItem[];
}

// Data
const quickLinks: LinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

const supportLinks: LinkItem[] = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Returns', href: '/returns' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' }
];

const socialLinks: SocialLink[] = [
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61555679100920', label: 'Facebook' },
  { icon: Music2Icon, href: 'https://www.tiktok.com/@umukamezishop', label: 'Tiktok' },
  { icon: Instagram, href: 'https://www.instagram.com/umukamezi250/', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@UMUKAMEZISHOP', label: 'YouTube' }
];
interface NewsletterFormProps {}
// Newsletter Subscription Form Component

const NewsletterForm: React.FC<NewsletterFormProps> = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter signup:', email);
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 rounded-2xl px-2 py-2 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
        aria-label="Email address for newsletter"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="rounded-2xl px-4 py-2 bg-white text-slate-900 font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        aria-label="Subscribe to newsletter"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
};

// Footer Column Component
const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Footer Component
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-slate-900 text-white "
    >
      {/* Main Footer Content */}
      <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand & About */}
          <motion.div variants={itemVariants} className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-2">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = "/"}>
                            <div className="px-4 py-3">
                                <div className="text-transparent uppercase bg-clip-text bg-black font-extrabold text-3xl leading-tight h-16 w-16 overflow-hidden">
                                 <img src="/Umukamezilogo.jpg" className='w-full h-full object- scale-120' alt=""  />   
                                </div>
                            </div>
                        </div>

            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Your ultimate destination for premium products. We bring you the latest trends
              and quality items at unbeatable prices, delivered right to your doorstep.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <Truck className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <FooterColumn title="Quick Links" links={quickLinks} />
          </motion.div>

          {/* Customer Support */}
          <motion.div variants={itemVariants} className='hidden'>
            <FooterColumn title="Customer Support" links={supportLinks} />
          </motion.div>

          {/* Stay Connected */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
              <p className="text-white/80 text-sm mb-4">
                Subscribe to our newsletter for exclusive deals and updates.
              </p>
              <NewsletterForm />
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        variants={itemVariants}
        className="border-t border-white/10"
      >
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Copyright & Dev Credit */}
            <div className="text-white/60 text-sm text-center sm:text-left flex flex-col sm:flex-row gap-1 sm:gap-2 items-center sm:items-baseline">
              <span>© {currentYear} Umukamezi. All rights reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span>
                Developed by{' '}
                <a
                  href="https://www.nexventures.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-red-500 transition-colors font-bold"
                >
                  {/* <img src="https://www.nexventures.net/assets/Icon-ueBx2e_P.png" alt="NexVentures Logo" srcSet="" className='h-5' /> */}
                  NexVentures
                </a>
              </span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-xs">We accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-purple-600 rounded flex items-center justify-center">
                  <Smartphone className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;