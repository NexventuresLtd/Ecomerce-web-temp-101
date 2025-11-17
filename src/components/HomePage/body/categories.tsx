import React, { useState, useEffect } from 'react';


import type { CategorySectionProps } from '../../../types/HomeCategories';
import { categoriesData } from '../../../constants/HomeCategories/categories';
import SectionHeader from './categoryComps/SectionHeader';
import GridLayout from './categoryComps/GridLayout';
import CarouselLayout from './categoryComps/CarouselLayout';
import { Grid, Sliders } from 'lucide-react';
// import { useNavigation } from '../../../hooks/product/useNavigation';
import { useNavigate } from 'react-router-dom';
import { encodeId } from '../../../app/products/id_encrypter';

const CategorySection: React.FC<CategorySectionProps> = ({
    title = "Shop by Category",
    subtitle = "Discover our wide range of products across different categories",
    showStats = true,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [viewMode, setViewmode] = useState('grid')
    // const { navigateToProductCategory } = useNavigation()
    const navigate = useNavigate();
    // Responsive items per view
    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else if (window.innerWidth < 768) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(3);
            } else {
                setItemsPerView(4);
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < categoriesData.length - itemsPerView;

    const handlePrevious = () => {
        if (canScrollPrev) {
            setCurrentIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleNext = () => {
        if (canScrollNext) {
            setCurrentIndex(prev => Math.min(categoriesData.length - itemsPerView, prev + 1));
        }
    };
    // Handle main category click - use query parameters
    const handleMainCategoryClick = (categoryTitle: string) => {
        const categoryMap: { [key: string]: number } = {
            'Camera': 1,
            'Lenses': 2,
            'Computer': 3,
            'Pro Audio': 4,
            'Lighting': 5,
            'Phone': 6,
            'Other Accessories': 7,
        };

        const categoryId = categoryMap[categoryTitle];
        if (categoryId) {
            const encodedId = encodeId(categoryId);
            // Use query parameter instead of path parameter
            navigate(`/products?category=${encodedId}`);
        } else {
            navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
        }
    };

    const handleCategoryClick = (category: any) => {
        // alert("clicked category: " + category);
        const categories = [
            { title: 'Photograph', name: 'Camera' },
            { title: 'Videography', name: 'Camera' },
            { title: 'Computer', name: 'Computer' },
            { title: 'Pro Audio', name: 'Pro Audio' },
            { title: 'Lighting', name: 'Lighting' },
            { title: 'Phone', name: 'Phone' },
            { title: 'Other Accessories', name: 'Other Accessories' },
        ];

        const found = categories.find(
            c => category.toLowerCase().includes(c.title.toLowerCase()) ||
                c.title.toLowerCase().includes(category.toLowerCase())
        );

        if (found) {
            handleMainCategoryClick(found.name);
        } else {
            // Optionally handle case where no match is found
            alert(category);
        }
    };

    return (
        <section className={`py-16 px-4 bg-slate-100 ${className}`}>
            <div className="max-w-full md:max-w-7xl mx-auto">
                <SectionHeader title={title} subtitle={subtitle} />
                <div className="flex gap-2 p-2 py-3 w-full justify-end">
                    <button title='View In Grid Mode' className='p-2 cursor-pointer' onClick={() => setViewmode("grid")}><Grid className={`${viewMode == "grid" ? "text-secondary" : "text-primary"}`} /></button>
                    <button title='View In Sliding way' className='p-2 cursor-pointer' onClick={() => setViewmode("cursor")}><Sliders className={`${viewMode != "grid" ? "text-secondary" : "text-primary"}`} /></button>
                </div>
                {viewMode === 'grid' ? (
                    <GridLayout
                        categories={categoriesData}
                        showStats={showStats}
                        onCategoryClick={handleCategoryClick}
                    />
                ) : (
                    <CarouselLayout
                        categories={categoriesData}
                        showStats={showStats}
                        onCategoryClick={handleCategoryClick}
                        itemsPerView={itemsPerView}
                        currentIndex={currentIndex}
                        onPrev={handlePrevious}
                        onNext={handleNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                )}
            </div>
        </section>
    );
};

export default CategorySection;