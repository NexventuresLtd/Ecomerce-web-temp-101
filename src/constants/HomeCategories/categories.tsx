import {
    Camera,
    Computer,
    Headphones,
    Gamepad2,
    Tablet,
    Sun,
    Smartphone,
    Zap,
} from 'lucide-react';
import type { Category } from '../../types/HomeCategories';


export const categoriesData: Category[] = [
    {
        id: 1,
        name: "Cameras",
        description: "Professional photography equipment",
        icon: Camera,
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-slate-800",
        link: "#",
        badge: {
            text: "New",
            type: "new",
            color: "bg-green-500"
        },
        stats: {
            productCount: 1247,
            discount: 15
        },
        bgImage: "https://cdn.mos.cms.futurecdn.net/e6fe0b52a9313bb44ff751df4ec7ac39.jpg",
        overlayImage: "https://www.iphotography.com/wp-content/uploads/2023/06/Best-Cameras-for-Professional-Photography-6.jpg"
    },
    {
        id: 2,
        name: "Computers",
        description: "High-performance computing devices",
        icon: Computer,
        // bgColor: "bg-blue-200/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-blue-200",
        link: "#",
        badge: {
            text: "Trending",
            type: "trending",
            color: "bg-blue-500"
        },
        stats: {
            productCount: 2847,
            discount: 20
        },
        bgImage: "https://image.made-in-china.com/318f0j00IaRGcfzFVhki/6%E6%9C%8814%E6%97%A5%281%29.mp4.webp",
        overlayImage: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg?auto=webp&quality=75&crop=1.91:1&width=1200"
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
        badge: {
            text: "Hot",
            type: "hot",
            color: "bg-red-500"
        },
        stats: {
            productCount: 856,
            discount: 10
        },
        bgImage: "https://www.yamaha.com/2/proaudio/images/main.jpg",
        overlayImage: "https://assets.proaudiotechnology.com/images/all_speakers2_alt_sm.png?crc=527762960"
    },
    {
        id: 4,
        name: "Pro Games",
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
        bgImage: "https://cdn.shopify.com/s/files/1/0401/9539/1653/files/SuperConsoleX2Pro-3systemin1.webp?v=1716435791",
        overlayImage: "https://www.kinhank-retrogame.com/cdn/shop/files/SuperConsoleX2Pro-main.webp?v=1716428705"
    },
    {
        id: 5,
        name: "Tablet",
        description: "Latest tablets and accessories",
        icon: Tablet,
        // bgColor: "bg-amber-100/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-amber-200",
        link: "#",
        badge: {
            text: "New",
            type: "new",
            color: "bg-green-500"
        },
        stats: {
            productCount: 987,
            discount: 25
        },
        bgImage: "https://cdn.mos.cms.futurecdn.net/BuGDmGGkiM3sqMP6i6FEXf.jpg",
        overlayImage: "https://cdn.thewirecutter.com/wp-content/media/2024/05/protablets-2048px-232431.jpg?auto=webp&quality=75&width=1024"
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
        bgImage: "https://mimolive.com/wp-content/uploads/2020/12/studio-lights.jpeg",
        overlayImage: "https://www.cirrolite.com/files/Gibraltar_The-Hub-2.jpg"
    },
    {
        id: 7,
        name: "Phone",
        description: "Latest smartphones and accessories",
        icon: Smartphone,
        // bgColor: "bg-green-200/70",
        bgColor: "bg-slate-900/90",
        textColor: "text-white",
        hoverBg: "hover:bg-green-200",
        link: "#",
        badge: {
            text: "Hot",
            type: "hot",
            color: "bg-red-500"
        },
        stats: {
            productCount: 2109,
            discount: 30
        },
        bgImage: "https://www.theboardresults.in/wp-content/uploads/2022/08/iPhone-14-pro-max-Price.jpg",
        overlayImage: "https://images-na.ssl-images-amazon.com/images/I/618E1CfbObL._SL250_.jpg"
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
        badge: {
            text: "Trending",
            type: "trending",
            color: "bg-blue-500"
        },
        stats: {
            productCount: 3456
        },
        bgImage: "https://www.aaxatech.com/products/landing/images/workswith.jpg",
        overlayImage: "https://ae01.alicdn.com/kf/Sb89cd8fe90bc4d9cad768a72cf73cc49Y.jpg_640x640q90.jpg"
    }
];