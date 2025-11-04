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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-7.png",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-7.png"
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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-8.jpg",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-8.jpg"
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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-11.png",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-11.png"
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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-12.png",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-12.png"
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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-9.jpg",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-9.jpg"
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
        bgImage: "https://older.umukamezi.com/assets/uploads/service-13.png",
        overlayImage: "https://older.umukamezi.com/assets/uploads/service-13.png"
    }
];