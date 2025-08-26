import type { Owner, Product } from "../../types/Product/ProductType";
export const productsData: Product[] = [
    // 1. DSLR Camera Tripod
    {
        id: "1",
        title: "Professional DSLR Camera Tripod",
        description:
            "Heavy-duty aluminum tripod with 360° pan head, quick-release plate, and 15 lb payload capacity.",
        price: 129.99,
        originalPrice: 179.99,
        discount: 28,
        rating: 4.6,
        isNew: false,
        isFeatured: true,
        link: "/products/1",
        reviewsCount: 532,
        instock: 40,
        deliveryFee: 5,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
        tags: ["tripod", "camera", "stability"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["360° Pan Head", "Quick-Release", "15 lb Payload"],
        tutorialVideo: "https://youtube.com/watch?v=example_camtripod",
        category: "Photography",
        brand: "ProStabil"
    },
    // 2. 4K Short-Throw Projector
    {
        id: "2",
        title: "4K Short-Throw Projector",
        description:
            "Capture big-screen entertainment even in tight spaces with crystal-clear 4K projection and 3200 ANSI lumen brightness.",
        price: 999.99,
        originalPrice: 1299.99,
        discount: 23,
        rating: 4.7,
        isNew: true,
        isFeatured: false,
        link: "/products/2",
        reviewsCount: 845,
        instock: 15,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1508614999368-9260051291ea?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=400&fit=crop",
        tags: ["projector", "4K", "short-throw"],
        colors: [{ name: "White", value: "#FFFFFF" }],
        features: ["4K HDR", "3200 lm Brightness", "Short-Throw Lens"],
        tutorialVideo: "https://youtube.com/watch?v=example_proj4k",
        category: "Projectors",
        brand: "VisionWide"
    },
    // 3. Ultra Portable Mini Projector
    {
        id: "3",
        title: "Portable Mini Projector",
        description:
            "Compact, budget-friendly projector with Wi-Fi, Bluetooth, and app streaming—perfect for on-the-go viewing.",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.2,
        isNew: true,
        isFeatured: true,
        link: "/products/3",
        reviewsCount: 1270,
        instock: 60,
        deliveryFee: 0,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1616627987936-5b31a6c1c2f6?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1616627987936-5b31a6c1c2f6?w=400&h=400&fit=crop",
        tags: ["mini", "portable", "streaming"],
        colors: [{ name: "Gray", value: "#6B7280" }],
        features: ["Wi-Fi", "Bluetooth", "Portable"],
        tutorialVideo: "https://youtube.com/watch?v=example_miniproj",
        category: "Projectors",
        brand: "PocketCinema"
    },
    // 4. Gaming Laptop with RTX
    {
        id: "4",
        title: "Gaming Laptop RTX 4070",
        description:
            "Powerhouse 15.6″ laptop with RTX 4070, 16GB RAM, 1TB SSD, and 240 Hz refresh rate for uncompromised gameplay.",
        price: 1899.99,
        originalPrice: 2199.99,
        discount: 13,
        rating: 4.9,
        isNew: true,
        isFeatured: true,
        link: "/products/4",
        reviewsCount: 977,
        instock: 30,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1610465299996-970b4b02d8be?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1610465299996-970b4b02d8be?w=400&h=400&fit=crop",
        tags: ["gaming", "laptop", "RTX4070"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Red", value: "#DC2626" },
        ],
        features: ["RTX 4070", "240 Hz Display", "1TB SSD"],
        tutorialVideo: "https://youtube.com/watch?v=example_gamelaptop",
        category: "Computers",
        brand: "GameCore"
    },
    // 5. Flagship Smartphone
    {
        id: "5",
        title: "Flagship Smartphone Pro",
        description:
            "Cutting-edge smartphone with 120 Hz AMOLED display, triple-lens 108 MP camera, 5G, and 5000 mAh battery.",
        price: 999.99,
        originalPrice: 1099.99,
        discount: 9,
        rating: 4.8,
        isNew: true,
        isFeatured: true,
        link: "/products/5",
        reviewsCount: 3245,
        instock: 100,
        deliveryFee: 0,
        images: [
            { isprimary: false, image: "https://images.unsplash.com/photo-1603791452906-bc7c5d7f6d21?w=400&h=400&fit=crop" },
            { isprimary: true, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        tags: ["smartphone", "5G", "camera"],
        colors: [
            { name: "Graphite", value: "#1F2937" },
            { name: "Silver", value: "#E5E7EB" },
        ],
        features: ["108 MP Camera", "120 Hz AMOLED", "5G Support"],
        tutorialVideo: "https://youtube.com/watch?v=example_phone",
        category: "Phones",
        brand: "Zenith"
    },
    // 6. Content Creator Convertible Laptop
    {
        id: "6",
        title: "2-in-1 Convertible Laptop",
        description:
            "Ultra-light touchscreen laptop with Intel i7, 16GB RAM, 512GB SSD, and stylus support for creators on the go.",
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        rating: 4.5,
        isNew: false,
        isFeatured: false,
        link: "/products/6",
        reviewsCount: 430,
        instock: 45,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1586717791821-3f44a1c2d5a0?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1600304641375-43bb68f8d8b0?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1600304641375-43bb68f8d8b0?w=400&h=400&fit=crop",
        tags: ["2-in-1", "laptop", "touchscreen"],
        colors: [
            { name: "Silver", value: "#D1D5DB" },
            { name: "Space Gray", value: "#4B5563" },
        ],
        features: ["Touchscreen", "Stylus", "Intel i7", "512 GB SSD"],
        tutorialVideo: "https://youtube.com/watch?v=example_2in1laptop",
        category: "Computers",
        brand: "CreateFlex"
    },
    {
        id: "7",
        title: "Mirrorless Camera Kit",
        description:
            "Professional mirrorless camera with 24.2MP sensor, 4K video recording, and bundled with a 28-70mm lens.",
        price: 1599.99,
        originalPrice: 1799.99,
        discount: 11,
        rating: 4.8,
        isNew: true,
        isFeatured: false,
        link: "/products/7",
        reviewsCount: 810,
        instock: 25,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1519183071298-464bb29d4c1a?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1519183071298-464bb29d4c1a?w=400&h=400&fit=crop",
        tags: ["mirrorless", "camera", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["24.2MP Sensor", "4K Video", "Wi-Fi Sharing"],
        tutorialVideo: "https://youtube.com/watch?v=example_mirrorless",
        category: "Photography",
        brand: "LuminaX"
    },
    {
        id: "8",
        title: "Ultra Slim Business Laptop",
        description:
            "Lightweight 14″ business laptop with Intel i5, 8GB RAM, 512GB SSD, and all-day 12h battery life.",
        price: 1099.99,
        originalPrice: 1299.99,
        discount: 15,
        rating: 4.4,
        isNew: false,
        isFeatured: false,
        link: "/products/8",
        reviewsCount: 610,
        instock: 70,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=400&fit=crop" },
            { isprimary: false, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop" },
        ],
        hoverImage:
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop",
        tags: ["laptop", "business", "portable"],
        colors: [
            { name: "Silver", value: "#D1D5DB" },
            { name: "Space Gray", value: "#4B5563" },
        ],
        features: ["Intel i5", "512GB SSD", "12h Battery"],
        tutorialVideo: "https://youtube.com/watch?v=example_businesslaptop",
        category: "Computers",
        brand: "BizBook"
    }
];

export const ownerData: Owner[] = [
    {
        name: "Umukamezi",
        isverified: true,
        email: "umukamezi@example.com",  // Replace with an actual email
        image: "https://example.com/image.jpg",  // Replace with an actual image URL
        JoinedAt: "2021-05-15T08:00:00Z",  // Use a real date or ISO string
    }
];
