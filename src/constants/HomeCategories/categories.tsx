import {
    Camera,
    Computer,
    Headphones,
    Gamepad2,
    // Tablet,
    Sun,
    // Smartphone,
    Zap,
} from 'lucide-react';
import type { Category } from '../../types/HomeCategories';


export const categoriesData: Category[] = [
    {
        id: 1,
        name: "Photography",
        description: "Professional photography equipment",
        icon: Camera,
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-slate-800",
        link: "#",
        stats: {
            productCount: 1247,
        },
        bgImage: "/CAMERAS PNG.png",
        overlayImage: "/CAMERAS PNG.png"
    },
    {
        id: 2,
        name: "Videography ",
        description: "High-performance computing devices",
        icon: Computer,
        // bgColor: "bg-blue-200/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-blue-200",
        link: "#",
        stats: {
            productCount: 2847,
        },
        bgImage: "/VIDEOGRAPHY PNG.png",
        overlayImage: "/VIDEOGRAPHY PNG.png"
    },
    {
        id: 3,
        name: "Pro Audio",
        description: "Professional audio equipment",
        icon: Headphones,
        // bgColor: "bg-purple-200/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-purple-200",
        link: "#",
        stats: {
            productCount: 856,
            discount: 10
        },
        bgImage: "/PRO-AUDIO PNG1.png",
        overlayImage: "/PRO-AUDIO PNG1.png"
    },
    {
        id: 4,
        name: "Computer",
        description: "Professional gaming gear",
        icon: Gamepad2,
        // bgColor: "bg-indigo-200/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-indigo-200",
        link: "#",
        stats: {
            productCount: 1247
        },
        bgImage: "/COMPUTERS PNG.png",
        overlayImage: "/COMPUTERS PNG.png"
    },
    {
        id: 6,
        name: "Lighting",
        description: "Professional lighting equipment",
        icon: Sun,
        // bgColor: "bg-yellow-100/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-yellow-200",
        link: "#",
        stats: {
            productCount: 567
        },
        bgImage: "/LIGHTING PNG.png",
        overlayImage: "/LIGHTING PNG.png"
    },
    {
        id: 8,
        name: "Other Accessories",
        description: "Various tech accessories",
        icon: Zap,
        // bgColor: "bg-gray-100/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-gray-200",
        link: "#",
        stats: {
            productCount: 3456
        },
        bgImage: "/OTHER ACCESSORIES PNG.png",
        overlayImage: "/OTHER ACCESSORIES PNG.png"
    }
];