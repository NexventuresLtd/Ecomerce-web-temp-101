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
        instock: 0,
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
    },
    // 9. DSLR Camera Kit
    {
        id: "9",
        title: "Canon EOS Rebel T7 DSLR Kit",
        description:
            "Beginner-friendly DSLR camera with 18-55mm lens, built-in Wi-Fi, and 24.1MP sensor for sharp photography.",
        price: 549.99,
        originalPrice: 649.99,
        rating: 4.7,
        isNew: false,
        isFeatured: true,
        link: "/products/9",
        reviewsCount: 1520,
        instock: 0,
        deliveryFee: 10,
        images: [
            { isprimary: false, image: "https://m.media-amazon.com/images/I/714hINuPoBL._AC_SY200_QL15_.jpg" },
            { isprimary: true, image: "https://m.media-amazon.com/images/I/71fwaCdTjYL._UF894,1000_QL80_.jpg" }
        ],
        hoverImage: "https://m.media-amazon.com/images/I/91+V1Hjw6xL._AC_SL1500_.jpg",
        tags: ["DSLR", "camera", "Wi-Fi"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["24.1MP", "Wi-Fi", "18-55mm Lens"],
        tutorialVideo: "https://www.youtube.com/embed/FW6g0sH6cK4",
        category: "Photography",
        brand: "Canon"
    },

    // 10. Sony Alpha Mirrorless
    {
        id: "10",
        title: "Sony Alpha a6400 Mirrorless Camera",
        description:
            "Compact mirrorless camera with 24.2MP sensor, 4K HDR video, and real-time eye autofocus.",
        price: 998.99,
        originalPrice: 1199.99,
        rating: 4.8,
        isNew: true,
        isFeatured: true,
        link: "/products/10",
        reviewsCount: 2140,
        instock: 22,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/81XeVWWyUUL.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/91eG0E4othL._AC_SL1500_.jpg" }
        ],
        hoverImage: "https://m.media-amazon.com/images/I/81RZTQt3n-L._AC_SL1500_.jpg",
        tags: ["mirrorless", "sony", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["24.2MP", "4K HDR Video", "Eye AF"],
        tutorialVideo: "https://www.youtube.com/embed/bRIZeWQYl8E",
        category: "Photography",
        brand: "Sony"
    },

    // 11. GoPro Action Camera
    {
        id: "11",
        title: "GoPro HERO12 Black",
        description:
            "Waterproof action camera with 5.3K video, HyperSmooth stabilization, and voice control.",
        price: 399.99,
        originalPrice: 449.99,
        rating: 4.6,
        isNew: true,
        isFeatured: false,
        link: "/products/11",
        reviewsCount: 3210,
        instock: 75,
        deliveryFee: 0,
        images: [
            { isprimary: true, image: "https://jmau.imgix.net/media/catalog/product/c/h/chdhx-121-rw-gopro-hero12-black-action-video-camera_zc29njqc8kpcrhaa.jpg" },
            { isprimary: false, image: "https://jmau.imgix.net/media/catalog/product/c/h/chdhx-121-rw-gopro-hero12-black-action-video-camera_zc29njqc8kpcrhaa.jpg" }
        ],
        hoverImage: "https://jmau.imgix.net/media/catalog/product/c/h/chdhx-121-rw-gopro-hero12-black-action-video-camera_zc29njqc8kpcrhaa.jpg",
        tags: ["action", "gopro", "stabilization"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["5.3K Video", "Waterproof", "Voice Control"],
        tutorialVideo: "https://www.youtube.com/embed/1VdKJgLOrhs",
        category: "Action Cameras",
        brand: "GoPro"
    },

    // 12. Drone with Camera
    {
        id: "13",
        title: "DJI Mini 4 Pro Drone",
        description:
            "Lightweight drone with 4K HDR camera, obstacle sensing, and 34 minutes flight time.",
        price: 759.99,
        originalPrice: 899.99,
        rating: 4.9,
        isNew: true,
        isFeatured: true,
        link: "/products/12",
        reviewsCount: 2895,
        instock: 18,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://media.hifi.lu/sys-master/products/9318221873182/3840x3840.43000996_01.webp" },
            { isprimary: false, image: "https://media.hifi.lu/sys-master/products/9318221873182/3840x3840.43000996_01.webp" }
        ],
        hoverImage: "https://media.hifi.lu/sys-master/products/9318221873182/3840x3840.43000996_01.webp",
        tags: ["drone", "DJI", "4K"],
        colors: [{ name: "Gray", value: "#D1D5DB" }],
        features: ["4K HDR", "34min Flight", "Obstacle Sensing"],
        tutorialVideo: "https://www.youtube.com/embed/x6XoLLqzz-0",
        category: "Drones",
        brand: "DJI"
    },

    // 13. Nikon DSLR
    {
        id: "13",
        title: "Nikon D7500 DSLR",
        description:
            "Advanced DSLR with 20.9MP DX sensor, 4K UHD video, and 8fps continuous shooting.",
        price: 999.99,
        originalPrice: 1199.99,
        rating: 4.7,
        isNew: false,
        isFeatured: true,
        link: "/products/13",
        reviewsCount: 1105,
        instock: 0,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontRight-1581_D750-ghoAVm4s.png" },
            { isprimary: false, image: "https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontRight-1581_D750-ghoAVm4s.png" }
        ],
        hoverImage: "https://images.cdn.us-central1.gcp.commercetools.com/f7c8f2bb-aff1-4581-a826-1ad2527be222/FrontRight-1581_D750-ghoAVm4s.png",
        tags: ["DSLR", "nikon", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["20.9MP", "4K UHD", "8fps Shooting"],
        tutorialVideo: "https://www.youtube.com/embed/kOlcRri6tGc",
        category: "Photography",
        brand: "Nikon"
    },

    // 14. Professional Lens
    {
        id: "14",
        title: "Canon RF 50mm f/1.2L Lens",
        description:
            "Premium prime lens for portraits with ultra-sharp focus, wide f/1.2 aperture, and weather sealing.",
        price: 2299.99,
        originalPrice: 2499.99,
        rating: 4.9,
        isNew: false,
        isFeatured: false,
        link: "/products/14",
        reviewsCount: 540,
        instock: 12,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://media.the-digital-picture.com/Images/Other/Canon-RF-50mm-f-1.2L-USM-Lens/Canon-RF-50mm-f-1.2L-Lens-Top-with-Hood.webp" },
            { isprimary: false, image: "https://media.the-digital-picture.com/Images/Other/Canon-RF-50mm-f-1.2L-USM-Lens/Canon-RF-50mm-f-1.2L-Lens-Top-with-Hood.webp" }
        ],
        hoverImage: "https://m.media-amazon.com/images/I/81rQukmH9WL._AC_SL1500_.jpg",
        tags: ["lens", "portrait", "RF"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["f/1.2 Aperture", "Prime Lens", "Weather-Sealed"],
        tutorialVideo: "https://www.youtube.com/embed/wnuKcdA2csI",
        category: "Lenses",
        brand: "Canon"
    },

    // 15. Professional Webcam
    {
        id: "15",
        title: "Logitech Brio 4K Webcam",
        description:
            "Ultra HD webcam with 4K HDR streaming, adjustable field of view, and Windows Hello support.",
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.5,
        isNew: false,
        isFeatured: false,
        link: "/products/15",
        reviewsCount: 2200,
        instock: 85,
        deliveryFee: 0,
        images: [
            { isprimary: true, image: "https://i.pcmag.com/imagery/reviews/05mgJecKHFMDRXibS9MR9Dc-1..v1569469967.jpg" },
            { isprimary: false, image: "https://i.pcmag.com/imagery/reviews/05mgJecKHFMDRXibS9MR9Dc-1..v1569469967.jpg" }
        ],
        hoverImage: "https://i.pcmag.com/imagery/reviews/05mgJecKHFMDRXibS9MR9Dc-1..v1569469967.jpg",
        tags: ["webcam", "4K", "streaming"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["4K HDR", "Windows Hello", "Adjustable FOV"],
        tutorialVideo: "https://www.youtube.com/embed/nYvTYtEZlJg",
        category: "Webcams",
        brand: "Logitech"
    },

    // 16. Compact Vlogging Camera
    {
        id: "16",
        title: "Sony ZV-1 Vlogging Camera",
        description:
            "Compact vlogging camera with 20.1MP sensor, 4K HDR video, and flip-out screen optimized for creators.",
        price: 749.99,
        originalPrice: 899.99,
        rating: 4.6,
        isNew: true,
        isFeatured: true,
        link: "/products/16",
        reviewsCount: 1890,
        instock: 30,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/51Cs3xNAQML.jpghttps://www.jbhifi.com.au/cdn/shop/products/470765-Product-0-I-637261786267825117_59f70bb9-9024-46d6-b0c5-419903403ee6.jpg?v=1696984641" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/51Cs3xNAQML.jpghttps://www.jbhifi.com.au/cdn/shop/products/470765-Product-0-I-637261786267825117_59f70bb9-9024-46d6-b0c5-419903403ee6.jpg?v=1696984641" }
        ],
        hoverImage: "https://m.media-amazon.com/images/I/51Cs3xNAQML.jpghttps://www.jbhifi.com.au/cdn/shop/products/470765-Product-0-I-637261786267825117_59f70bb9-9024-46d6-b0c5-419903403ee6.jpg?v=1696984641",
        tags: ["vlogging", "sony", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["20.1MP", "4K HDR", "Flip Screen"],
        tutorialVideo: "https://www.youtube.com/embed/B1vX3cM5iJY",
        category: "Vlogging",
        brand: "Sony"
    },
    {
        id: "9",
        title: "Canon EOS R5 Mirrorless Camera",
        description: "45MP full-frame mirrorless camera with 8K video recording, dual pixel autofocus, and image stabilization.",
        price: 3899.99,
        originalPrice: 4299.99,
        rating: 4.9,
        isNew: true,
        isFeatured: true,
        link: "/products/9",
        reviewsCount: 1250,
        instock: 15,
        deliveryFee: 25,
        images: [
            { isprimary: true, image: "https://i.ebayimg.com/images/g/9~4AAOSwM7Bh4jzX/s-l1200.webp" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71Vwkf0UfNL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://petapixel.com/assets/uploads/2020/07/Canon-EOS-R5-Review-Featured.jpg",
        tags: ["mirrorless", "8K", "full-frame"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["45MP Sensor", "8K Video", "5-Axis Stabilization"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Canon"
    },
    
    // 2. Sony 70-200mm f/2.8 GM OSS Lens
    {
        id: "10",
        title: "Sony 70-200mm f/2.8 GM OSS Telephoto Lens",
        description: "Professional telephoto zoom lens with constant f/2.8 aperture, optical stabilization, and weather sealing.",
        price: 2598.99,
        originalPrice: 2799.99,
        rating: 4.8,
        isNew: false,
        isFeatured: true,
        link: "/products/10",
        reviewsCount: 890,
        instock: 0,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://i.pcmag.com/imagery/reviews/04OeekwUGxWBLfxLNSd7SLy-10.fit_lim.size_1050x.jpg" },
            { isprimary: false, image: "https://i.pcmag.com/imagery/reviews/04OeekwUGxWBLfxLNSd7SLy-10.fit_lim.size_1050x.jpg" },
        ],
        hoverImage: "https://i.pcmag.com/imagery/reviews/04OeekwUGxWBLfxLNSd7SLy-10.fit_lim.size_1050x.jpg",
        tags: ["telephoto", "f2.8", "professional"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["f/2.8 Aperture", "Optical Stabilization", "Weather Sealed"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Sony"
    },

    // 3. Nikon D850 DSLR Camera
    {
        id: "11",
        title: "Nikon D850 DSLR Camera Body",
        description: "45.7MP full-frame DSLR with 4K UHD video, 153-point autofocus system, and tilting touchscreen LCD.",
        price: 2996.95,
        originalPrice: 3299.95,
        rating: 4.7,
        isNew: false,
        isFeatured: false,
        link: "/products/11",
        reviewsCount: 742,
        instock: 8,
        deliveryFee: 25,
        images: [
            { isprimary: true, image: "https://www.nikon.co.uk/globalassets/digizuite/118697-en-d850_top.png/OptimizelyDesktopPNG" },
            { isprimary: false, image: "https://www.nikon.co.uk/globalassets/digizuite/118697-en-d850_top.png/OptimizelyDesktopPNG" },
        ],
        hoverImage: "https://www.nikon.co.uk/globalassets/digizuite/118697-en-d850_top.png/OptimizelyDesktopPNG",
        tags: ["DSLR", "full-frame", "4K"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["45.7MP Sensor", "4K Video", "Tilting LCD"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Nikon"
    },

    // 4. Fujifilm X-T4 Mirrorless Camera
    {
        id: "12",
        title: "Fujifilm X-T4 Mirrorless Camera",
        description: "26.1MP APS-C mirrorless camera with in-body stabilization, 4K/60p video, and film simulation modes.",
        price: 1699.00,
        originalPrice: 1899.00,
        rating: 4.6,
        isNew: true,
        isFeatured: true,
        link: "/products/12",
        reviewsCount: 567,
        instock: 22,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/81gMPeyvcKL._UF894,1000_QL80_.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/81gMPeyvcKL._UF894,1000_QL80_.jpg" },
        ],
        hoverImage: "https://static.bhphoto.com/images/images1000x1000/1582728826_1548804.jpg",
        tags: ["mirrorless", "APS-C", "film-simulation"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Silver", value: "#C0C0C0" }
        ],
        features: ["In-Body Stabilization", "4K/60p Video", "Film Simulation"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Fujifilm"
    },

    // 5. Canon RF 24-70mm f/2.8L IS USM Lens
    {
        id: "103",
        title: "Canon RF 24-70mm f/2.8L IS USM Lens",
        description: "Professional standard zoom lens with image stabilization, weather sealing, and L-series optical quality.",
        price: 2299.00,
        originalPrice: 2499.00,
        rating: 4.8,
        isNew: false,
        isFeatured: false,
        link: "/products/103",
        reviewsCount: 423,
        instock: 12,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://www.ephotozine.com/articles/canon-rf-24-70mm-f-2-8l-is-usm-lens-review-36048/images/highres-canon_rF_24-70mm_f28L_without_hood_on_canon_r3_1653920051.jpg" },
            { isprimary: false, image: "https://www.ephotozine.com/articles/canon-rf-24-70mm-f-2-8l-is-usm-lens-review-36048/images/highres-canon_rF_24-70mm_f28L_without_hood_on_canon_r3_1653920051.jpg" },
        ],
        hoverImage: "https://www.ephotozine.com/articles/canon-rf-24-70mm-f-2-8l-is-usm-lens-review-36048/images/highres-canon_rF_24-70mm_f28L_without_hood_on_canon_r3_1653920051.jpg",
        tags: ["standard-zoom", "f2.8", "L-series"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["Image Stabilization", "Weather Sealed", "L-Series Optics"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Canon"
    },

    // 6. DJI Ronin-S Gimbal Stabilizer
    {
        id: "14",
        title: "DJI Ronin-S 3-Axis Gimbal Stabilizer",
        description: "Professional handheld gimbal for DSLR and mirrorless cameras with 8lb payload and intelligent shooting modes.",
        price: 699.00,
        originalPrice: 849.00,
        rating: 4.5,
        isNew: false,
        isFeatured: true,
        link: "/products/14",
        reviewsCount: 1089,
        instock: 0,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://image.made-in-china.com/202f0j00yRBclJpgldkL/Brand-New-Original-Dji-RS-3-PRO-Combo-3-Axis-Gimbal-Stabilizer-for-DSLR-and-Cinema-Cameras-Professional-Video-Gimbal-Stabilizer.webp" },
            { isprimary: false, image: "https://static.bhphoto.com/images/images1000x1000/1529070133_1414329.jpg" },
        ],
        hoverImage: "https://www.dji.com/media/image/aea6b8d4-7c3d-4e49-9b1e-7d5f5c7b9c1e.jpeg",
        tags: ["gimbal", "stabilizer", "handheld"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["3-Axis Stabilization", "8lb Payload", "Intelligent Modes"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "DJI"
    },

    // 7. Sony Alpha a7 III Full Frame Camera
    {
        id: "15",
        title: "Sony Alpha a7 III Mirrorless Camera",
        description: "24.2MP full-frame camera with 693-point autofocus, 4K HDR video, and dual card slots.",
        price: 1998.00,
        originalPrice: 2198.00,
        rating: 4.7,
        isNew: false,
        isFeatured: false,
        link: "/products/15",
        reviewsCount: 1567,
        instock: 35,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://panamoz.com/media/catalog/product/cache/b0546a782ddd11420e3ffb7c5ce8736a/1/5/1519695934000_1394219_2nd.jpg" },
            { isprimary: false, image: "https://panamoz.com/media/catalog/product/cache/b0546a782ddd11420e3ffb7c5ce8736a/1/5/1519695934000_1394219_2nd.jpg" },
        ],
        hoverImage: "https://panamoz.com/media/catalog/product/cache/b0546a782ddd11420e3ffb7c5ce8736a/1/5/1519695934000_1394219_2nd.jpg",
        tags: ["full-frame", "mirrorless", "4K-HDR"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["693-Point AF", "4K HDR Video", "Dual Card Slots"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Sony"
    },

    // 8. Sigma 35mm f/1.4 DG HSM Art Lens
    {
        id: "16",
        title: "Sigma 35mm f/1.4 DG HSM Art Lens",
        description: "Professional wide-angle prime lens with f/1.4 aperture, superior optics, and weather-resistant construction.",
        price: 899.00,
        originalPrice: 999.00,
        rating: 4.6,
        isNew: true,
        isFeatured: false,
        link: "/products/16",
        reviewsCount: 334,
        instock: 18,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1388497913_1034558.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71hR5aNrJ7L._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.sigma-global.com/en/lenses/a012_35_14/gallery/images/img01.jpg",
        tags: ["prime", "wide-angle", "f1.4"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["f/1.4 Aperture", "Art Series Optics", "Weather Resistant"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Sigma"
    },

    // 9. Godox AD600Pro Studio Flash
    {
        id: "17",
        title: "Godox AD600Pro Portable Studio Flash",
        description: "600Ws TTL portable flash with built-in receiver, HSS, and stable color temperature for professional photography.",
        price: 849.00,
        originalPrice: 949.00,
        rating: 4.4,
        isNew: false,
        isFeatured: true,
        link: "/products/17",
        reviewsCount: 267,
        instock: 7,
        deliveryFee: 18,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1506603527_1363128.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/61YZBhfVIbL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.godox.com/EN/Products_Camera_Flash_AD600Pro.html",
        tags: ["studio-flash", "TTL", "portable"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["600Ws Power", "TTL Function", "HSS Support"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Godox"
    },

    // 10. Peak Design Everyday Backpack
    {
        id: "18",
        title: "Peak Design Everyday Backpack V2",
        description: "Versatile 20L camera backpack with weatherproof exterior, customizable dividers, and laptop compartment.",
        price: 279.95,
        originalPrice: 299.95,
        rating: 4.5,
        isNew: true,
        isFeatured: false,
        link: "/products/18",
        reviewsCount: 856,
        instock: 42,
        deliveryFee: 10,
        images: [
            { isprimary: true, image: "https://cdn.shopify.com/s/files/1/0280/8806/0352/products/PD_EB_20_V2_BK_04.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71YgBmLVe4L._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.peakdesign.com/products/everyday-backpack",
        tags: ["backpack", "weatherproof", "camera-bag"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Charcoal", value: "#36454F" }
        ],
        features: ["20L Capacity", "Weatherproof", "Customizable Dividers"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Peak Design"
    },

    // 11. Manfrotto 055 Carbon Fiber Tripod
    {
        id: "19",
        title: "Manfrotto 055 Carbon Fiber Tripod",
        description: "Professional carbon fiber tripod with 90° center column, Quick Power Lock system, and 9kg payload capacity.",
        price: 399.88,
        originalPrice: 449.88,
        rating: 4.7,
        isNew: false,
        isFeatured: false,
        link: "/products/19",
        reviewsCount: 445,
        instock: 0,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://www.photoproshop.com/images/product_images/original_images/manfrotto_055cxpro4_photoproshop.jpg" },
            { isprimary: false, image: "https://www.photoproshop.com/images/product_images/original_images/manfrotto_055cxpro4_photoproshop.jpg" },
        ],
        hoverImage: "https://www.manfrotto.com/media/catalog/product/m/t/mt055cxpro4_01.jpg",
        tags: ["tripod", "carbon-fiber", "professional"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["Carbon Fiber", "90° Center Column", "9kg Payload"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Manfrotto"
    },

    // 12. Canon EOS 90D DSLR Camera
    {
        id: "20",
        title: "Canon EOS 90D DSLR Camera",
        description: "32.5MP APS-C DSLR with 45-point autofocus, 4K video, vari-angle touchscreen, and Wi-Fi connectivity.",
        price: 1199.00,
        originalPrice: 1349.00,
        rating: 4.4,
        isNew: false,
        isFeatured: true,
        link: "/products/20",
        reviewsCount: 678,
        instock: 29,
        deliveryFee: 15,
        images: [
            { isprimary: true, image: "https://d1hjkbq40fs2x4.cloudfront.net/2019-10-29/files/canon-eos-90d-ef-100-400mm-f-4-5-5-6-l-is-ii-usm_1939-2.jpg" },
            { isprimary: false, image: "https://d1hjkbq40fs2x4.cloudfront.net/2019-10-29/files/canon-eos-90d-ef-100-400mm-f-4-5-5-6-l-is-ii-usm_1939-2.jpg" },
        ],
        hoverImage: "https://www.canon.com/media/image/2019/08/28/c64c2b8c4d7b4f9bb8f4e8b9c8f2a0d4_eos90d-hero-new.png",
        tags: ["DSLR", "APS-C", "vari-angle"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["32.5MP Sensor", "4K Video", "Vari-Angle Screen"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Canon"
    },

    // 13. Tamron 28-75mm f/2.8 Di III RXD Lens
    {
        id: "21",
        title: "Tamron 28-75mm f/2.8 Di III RXD Lens",
        description: "Compact full-frame standard zoom lens with constant f/2.8 aperture, moisture-resistant construction.",
        price: 579.00,
        originalPrice: 649.00,
        rating: 4.5,
        isNew: true,
        isFeatured: false,
        link: "/products/21",
        reviewsCount: 392,
        instock: 16,
        deliveryFee: 12,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1525346906_1408959.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/61YLz7VXJQL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.tamron.com/uploads/product/2875DiIII_A036_hero.jpg",
        tags: ["standard-zoom", "f2.8", "compact"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["Constant f/2.8", "RXD Autofocus", "Moisture Resistant"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Tamron"
    },

    // 14. Profoto B10 Plus Studio Light
    {
        id: "22",
        title: "Profoto B10 Plus Off-Camera Flash",
        description: "500Ws cordless studio light with TTL, HSS, smartphone app control, and continuous LED modeling light.",
        price: 1695.00,
        originalPrice: 1795.00,
        rating: 4.8,
        isNew: false,
        isFeatured: true,
        link: "/products/22",
        reviewsCount: 123,
        instock: 4,
        deliveryFee: 25,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1549982773_1457033.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/51ZDWdEr5cL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://profoto.com/globalassets/product-images/off-camera-flash/b10-plus/profoto-b10-plus-product-image.jpg",
        tags: ["studio-light", "cordless", "TTL"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["500Ws Power", "TTL & HSS", "Smartphone Control"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Profoto"
    },

    // 15. Olympus OM-D E-M1 Mark III
    {
        id: "23",
        title: "Olympus OM-D E-M1 Mark III Camera",
        description: "20.4MP Micro Four Thirds camera with 5-axis stabilization, weather sealing, and pro capture mode.",
        price: 1799.00,
        originalPrice: 1999.00,
        rating: 4.3,
        isNew: false,
        isFeatured: false,
        link: "/products/23",
        reviewsCount: 287,
        instock: 0,
        deliveryFee: 18,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1583344439_1548936.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71qVHY3BjXL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.olympus.com.au/Products/Cameras/OM-D-Cameras/E-M1-Mark-III",
        tags: ["micro-four-thirds", "weather-sealed", "5-axis"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Silver", value: "#C0C0C0" }
        ],
        features: ["5-Axis Stabilization", "Weather Sealed", "Pro Capture"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Olympus"
    },

    // 16. Rode VideoMic Pro Plus Microphone
    {
        id: "24",
        title: "Rode VideoMic Pro Plus On-Camera Mic",
        description: "Professional shotgun microphone with built-in battery, safety channel, and advanced shock mounting.",
        price: 329.00,
        originalPrice: 369.00,
        rating: 4.6,
        isNew: true,
        isFeatured: false,
        link: "/products/24",
        reviewsCount: 512,
        instock: 33,
        deliveryFee: 8,
        images: [
            { isprimary: true, image: "https://www.premiumbeat.com/blog/wp-content/uploads/2017/07/Rode_VideoMic_Pro_Plus.jpg" },
            { isprimary: false, image: "https://www.premiumbeat.com/blog/wp-content/uploads/2017/07/Rode_VideoMic_Pro_Plus.jpg" },
        ],
        hoverImage: "https://www.rode.com/microphones/videomicproplur",
        tags: ["microphone", "shotgun", "on-camera"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["Built-in Battery", "Safety Channel", "Shock Mounting"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Rode"
    },

    // 17. Leica Q2 Compact Camera
    {
        id: "25",
        title: "Leica Q2 Full Frame Compact Camera",
        description: "47.3MP full-frame compact with fixed 28mm f/1.7 lens, 4K video, and premium German engineering.",
        price: 4995.00,
        originalPrice: 5295.00,
        rating: 4.9,
        isNew: false,
        isFeatured: true,
        link: "/products/25",
        reviewsCount: 89,
        instock: 3,
        deliveryFee: 30,
        images: [
            { isprimary: true, image: "https://ymcinema.com/wp-content/uploads/2020/11/Leica-Introduces-the-Q2-Monochrom-Full-Frame-47.3MP-Black-White-Compact-Camera-.001.jpeg" },
            { isprimary: false, image: "https://ymcinema.com/wp-content/uploads/2020/11/Leica-Introduces-the-Q2-Monochrom-Full-Frame-47.3MP-Black-White-Compact-Camera-.001.jpeg" },
        ],
        hoverImage: "https://ymcinema.com/wp-content/uploads/2020/11/Leica-Introduces-the-Q2-Monochrom-Full-Frame-47.3MP-Black-White-Compact-Camera-.001.jpeg",
        tags: ["compact", "full-frame", "fixed-lens"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["47.3MP Sensor", "28mm f/1.7 Lens", "4K Video"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Leica"
    },

    // 18. SanDisk Extreme Pro CFexpress Card
    {
        id: "26",
        title: "SanDisk Extreme Pro CFexpress Card 128GB",
        description: "High-performance CFexpress Type B memory card with 1700 MB/s read speeds for professional cameras.",
        price: 199.99,
        originalPrice: 229.99,
        rating: 4.7,
        isNew: true,
        isFeatured: false,
        link: "/products/26",
        reviewsCount: 456,
        instock: 67,
        deliveryFee: 5,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1573152647_1507880.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/71XsQrOCxgL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.sandisk.com/content/dam/sandisk-main/en_us/portal-assets/product-images/extreme-pro-cfexpress-card-type-b.png",
        tags: ["memory-card", "CFexpress", "high-speed"],
        colors: [{ name: "Gold", value: "#FFD700" }],
        features: ["1700 MB/s Read", "128GB Capacity", "CFexpress Type B"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "SanDisk"
    },

    // 19. Zhiyun Crane 3S Gimbal
    {
        id: "27",
        title: "Zhiyun Crane 3S Professional Gimbal",
        description: "Heavy-duty 3-axis gimbal stabilizer supporting up to 6.5kg payload with wireless image transmission.",
        price: 849.00,
        originalPrice: 949.00,
        rating: 4.4,
        isNew: false,
        isFeatured: false,
        link: "/products/27",
        reviewsCount: 234,
        instock: 11,
        deliveryFee: 20,
        images: [
            { isprimary: true, image: "https://static.bhphoto.com/images/images1000x1000/1571755147_1506028.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/61YgFhJDXeL._AC_SL1500_.jpg" },
        ],
        hoverImage: "https://www.zhiyun-tech.com/storage/upload/product/crane-3s/hero-image.jpg",
        tags: ["gimbal", "heavy-duty", "professional"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["6.5kg Payload", "Wireless Transmission", "SmartFollow 3.0"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Zhiyun"
    },

    // 20. Neewer LED Video Light Panel
    {
        id: "28",
        title: "Neewer 660 LED Video Light Panel",
        description: "Bi-color LED panel with 660 bulbs, wireless remote, LCD display, and CRI 96+ for video production.",
        price: 159.99,
        originalPrice: 199.99,
        rating: 4.3,
        isNew: true,
        isFeatured: true,
        link: "/products/28",
        reviewsCount: 789,
        instock: 0,
        deliveryFee: 12,
        images: [
            { isprimary: true, image: "https://m.media-amazon.com/images/I/713YcvhAcTL._UF1000,1000_QL80_.jpg" },
            { isprimary: false, image: "https://m.media-amazon.com/images/I/713YcvhAcTL._UF1000,1000_QL80_.jpg" },
        ],
        hoverImage: "https://neewer.com/media/catalog/product/1/0/10096350-1.jpg",
        tags: ["LED-panel", "bi-color", "video-light"],
        colors: [{ name: "Black", value: "#000000" }],
        features: ["660 LED Bulbs", "CRI 96+", "Wireless Remote"],
        tutorialVideo: "https://www.youtube.com/embed/TcpQ4OAKVpQ?si=0SxNy_fQzWyeHlVy&amp;start=48",
        category: "Photography",
        brand: "Neewer"
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
