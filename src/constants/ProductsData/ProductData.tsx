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
        // discount:,
        rating: 4.6,
        isNew: false,
        isFeatured: true,
        link: "/products/1",
        reviewsCount: 532,
        instock: 40,
        deliveryFee: 5,
        images: [
            { isprimary: true, image: "https://images-cdn.ubuy.co.id/68381354ecd281cdcd0d216d-canon-eos-rebel-t7-dslr-camera-with.jpg" },
            { isprimary: false, image: "https://i5.walmartimages.com/asr/a5ca1818-6b35-4b9f-b666-c22515d86e8f.326e2e733c12af9cdb93e19f0de363d4.jpeg" },
        ],
        hoverImage:
            "https://i5.walmartimages.com/asr/a5ca1818-6b35-4b9f-b666-c22515d86e8f.326e2e733c12af9cdb93e19f0de363d4.jpeg",
        tags: ["tripod", "camera", "stability"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["360° Pan Head", "Quick-Release", "15 lb Payload"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.7,
        isNew: true,
        isFeatured: false,
        link: "/products/2",
        reviewsCount: 845,
        instock: 15,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://www.optomaeurope.com/ContentStorage/Media/ad83897c-763a-4f36-ad2e-8ed751ba601e.jpg" },
            { isprimary: false, image: "https://www.eliteprojector.com/wp-content/uploads/EP_MGFU_Distance_60_100_120.jpg" },
        ],
        hoverImage:
            "https://i.ytimg.com/vi/OuEqXqAyq2g/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDTK0nICL-NCiM9F9YfesEdXYUSzA",
        tags: ["projector", "4K", "short-throw"],
        colors: [{ name: "White", value: "#FFFFFF" }],
        features: ["4K HDR", "3200 lm Brightness", "Short-Throw Lens"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.2,
        isNew: true,
        isFeatured: true,
        link: "/products/3",
        reviewsCount: 1270,
        instock: 60,
        deliveryFee: 0,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/71tw5u0VXAL._UF350,350_QL80_.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71UwGm5juyL._UF1000,1000_QL80_.jpg" },
        ],
        hoverImage:
            "https://m.media-amazon.com/images/I/71fsuvWlZYL._UF1000,1000_QL80_.jpg",
        tags: ["mini", "portable", "streaming"],
        colors: [{ name: "Gray", value: "#6B7280" }],
        features: ["Wi-Fi", "Bluetooth", "Portable"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.9,
        isNew: true,
        isFeatured: true,
        link: "/products/4",
        reviewsCount: 977,
        instock: 30,
        deliveryFee: 15,
        images: [
            { isprimary: false, image: "https://cdn.mos.cms.futurecdn.net/WWyc6ANwtvYpYPtNqL9fxD.jpg" },
            { isprimary: true, image: "https://m.media-amazon.com/images/I/71KESlYGP-L._UF894,1000_QL80_.jpg" },
        ],
        hoverImage:
            "https://img.overclockers.co.uk/images/LT-0EU-GI/8486164db193a66198a702fb1aab42af.jpg",
        tags: ["gaming", "laptop", "RTX4070"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Red", value: "#DC2626" },
        ],
        features: ["RTX 4070", "240 Hz Display", "1TB SSD"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.8,
        isNew: true,
        isFeatured: true,
        link: "/products/5",
        reviewsCount: 3245,
        instock: 100,
        deliveryFee: 0,
        images: [
            { isprimary: false, image: "https://images-cdn.ubuy.co.nl/675cac98104094089601b6d2-meet-the-pinephone-pro-our-flagship.jpg" },
            { isprimary: true, image: "https://static1.xdaimages.com/wordpress/wp-content/uploads/2021/10/pinephone-pro-feature-image.jpg" },
        ],
        hoverImage:
            "https://cdn.arstechnica.net/wp-content/uploads/2022/01/2-2.jpg",
        tags: ["smartphone", "5G", "camera"],
        colors: [
            { name: "Graphite", value: "#1F2937" },
            { name: "Silver", value: "#E5E7EB" },
        ],
        features: ["108 MP Camera", "120 Hz AMOLED", "5G Support"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.5,
        isNew: false,
        isFeatured: false,
        link: "/products/6",
        reviewsCount: 430,
        instock: 45,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://i.rtings.com/assets/pages/MQFiUURx/best-2-in-1-laptops-20240516-medium.jpg?format=auto" },
            { isprimary: false, image: "https://images.bauerhosting.com/affiliates/sites/8/2024/06/Untitled-1.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=1440&q=80" },
        ],
        hoverImage:
            "https://m.media-amazon.com/images/I/71Etuz5e4-L.jpg",
        tags: ["2-in-1", "laptop", "touchscreen"],
        colors: [
            { name: "Silver", value: "#D1D5DB" },
            { name: "Space Gray", value: "#4B5563" },
        ],
        features: ["Touchscreen", "Stylus", "Intel i7", "512 GB SSD"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.8,
        isNew: true,
        isFeatured: false,
        link: "/products/7",
        reviewsCount: 810,
        instock: 25,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://i5.walmartimages.com/seo/Canon-EOS-R50-Mirrorless-Camera-18-45mm-Lens-Bundle-Accessory-Kit-including-128GB-Memory-Backpack-Extra-Battery-Filters-5-2-Video-Photo-Editing-Packa_94c82885-3cf2-48f0-869b-a6ecff57ee76.9b212be4b56809a7c24fe0bdcfda483c.jpeg" },
            { isprimary: false, image: "https://i5.walmartimages.com/seo/Canon-EOS-R5-Mirrorless-Camera-Canon-5-2mm-f-2-8-L-Lens-Canon-50mm-1-8-Lens-Backup-Battery-64GB-Kit-Original-Accessories-Included-International-Versi_61cd794e-b516-43f8-8e5b-f9d773448bb5.7b5d1a97fe69674b622bd5625fb87969.jpeg" },
        ],
        hoverImage:
            "https://media.sweetwater.com/m/products/image/07f7757099JQcsLJliFcGiQGbP27fA02Qbb9GV5T.wm-lw.jpg?quality=82&width=750&ha=07f7757099fbcc65",
        tags: ["mirrorless", "camera", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["24.2MP Sensor", "4K Video", "Wi-Fi Sharing"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
        // discount:,
        rating: 4.4,
        isNew: false,
        isFeatured: false,
        link: "/products/8",
        reviewsCount: 610,
        instock: 70,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/717vQhiqyxL._UF894,1000_QL80_.jpg" },
            { isprimary: false, image: "https://cdn.thewirecutter.com/wp-content/media/2024/07/businesslaptops-2048px-233332.jpg" },
        ],
        hoverImage:
            "https://i.pcmag.com/imagery/reviews/04CufB3emFskUertKlTPmdI-1.fit_lim.size_919x518.v1735594586.jpg",
        tags: ["laptop", "business", "portable"],
        colors: [
            { name: "Silver", value: "#D1D5DB" },
            { name: "Space Gray", value: "#4B5563" },
        ],
        features: ["Intel i5", "512GB SSD", "12h Battery"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
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
