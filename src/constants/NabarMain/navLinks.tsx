import type { CategoryItem, NavItem } from "../../types/Navbar/navTypes";

export const topNavItems = [
    { name: 'B2B, Gov, Students & More', href: '#' },
    { name: 'News, Tips & Reviews', href: '#' },
    { name: 'About Us', href: '#' }
];

export const mainNavItems: NavItem[] = [
    { name: 'Home', href: '#', hasDropdown: false },
    { name: 'Cameras', href: '#', hasDropdown: true },
    { name: 'Computers', href: '#', hasDropdown: true },
    { name: 'Pro Audio', href: '#', hasDropdown: true },
    { name: 'Pro Games', href: '#', hasDropdown: true },
    { name: 'Tablet', href: '#', hasDropdown: true },
    { name: 'Lighting', href: '#', hasDropdown: true },
    { name: 'Phone', href: '#', hasDropdown: true },
    { name: 'Other Accessories', href: '#', hasDropdown: true },
    { name: 'About Us', href: '#', hasDropdown: false },
    { name: 'FAQ', href: '#', hasDropdown: false },
    { name: 'Contact US', href: '#', hasDropdown: false }
];

export const proVideoCategories: CategoryItem[] = [
    { name: 'Camcorders', image: '📹', href: '#' },
    { name: 'Digital Cinema Cameras', image: '🎥', href: '#' },
    { name: 'Studio & EFP Cameras', image: '📷', href: '#' },
    { name: 'PTZ Cameras & Solutions', image: '🔄', href: '#' }
];

export const proVideoSubCategories = [
    'Industrial & Multi-Purpose Cameras',
    'Production Switchers & Controllers',
    'Lighting',
    'Camera Drones & Aerial Imaging',
    'Studio & EFP Equipment',
    'Tapes & Digital Media',
    'Lenses & Lens Accessories',
    'Monitors',
    'Cables',
    'Audio for Video',
    'Recorders & Duplication',
    'Underwater Equipment',
    'Video Tripods, Supports & Rigs',
    'Pro Video Streaming',
    'Racks & Furniture',
    'Batteries & Power',
    'Podcasting',
    'Tutorials',
    'Professional Video Cases',
    'Signal Processing & Distribution',
    'Installation',
    'Camcorder & Camera Peripherals',
    'Post Production'
];