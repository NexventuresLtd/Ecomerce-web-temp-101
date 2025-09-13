import type {  NavItem } from "../../types/Navbar/navTypes";

export const topNavItems = [
    { name: 'B2B, Gov, Students & More', href: '#' },
    { name: 'umukamezi250@gmail.com', href: 'mailto:umukamezi250@gmail.com' },
    { name: 'About Us', href: '#' }
];

export const mainNavItems: NavItem[] = [
    { title: 'Home', name: 'Home', href: '/', hasDropdown: false },
    { title: 'All Products', name: 'All Products', href: '/products', hasDropdown: false },
    { title: 'Photograph', name: 'Camera', href: '#', hasDropdown: true },
    { title: 'Videography', name: 'Lenses', href: '#', hasDropdown: true },
    { title: 'Computer', name: 'Computer', href: '#', hasDropdown: true },
    { title: 'Pro Audio', name: 'Pro Audio', href: '#', hasDropdown: true },
    { title: 'Lighting', name: 'Lighting', href: '#', hasDropdown: true },
    { title: 'Phone', name: 'Phone', href: '#', hasDropdown: true },
    { title: 'Other Accessories', name: 'Other Accessories', href: '#', hasDropdown: true },
    { title: 'About Us', name: 'About Us', href: '/about', hasDropdown: false },
    { title: 'Vlog', name: 'Vlog', href: '/vlog', hasDropdown: false },
    { title: 'Contact US', name: 'Contact US', href: '/contact', hasDropdown: false }
];
