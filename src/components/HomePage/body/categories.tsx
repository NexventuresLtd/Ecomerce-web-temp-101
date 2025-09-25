import React, { useState, useEffect } from 'react';


import type { CategorySectionProps } from '../../../types/HomeCategories';
import { categoriesData } from '../../../constants/HomeCategories/categories';
import SectionHeader from './categoryComps/SectionHeader';
import GridLayout from './categoryComps/GridLayout';
import CarouselLayout from './categoryComps/CarouselLayout';
import { Grid, Sliders } from 'lucide-react';
import { useNavigation } from '../../../hooks/product/useNavigation';

const CategorySection: React.FC<CategorySectionProps> = ({
    title = "Shop by Category",
    subtitle = "Discover our wide range of products across different categories",
    showStats = true,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [viewMode, setViewmode] = useState('grid')
    const { navigateToProductCategory } = useNavigation()
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


    const handleCategoryClick = (category: any) => {
        const categories = [
            { title: 'Photograph', name: 'Camera' },
            { title: 'Videography', name: 'Lenses' },
            { title: 'Computer', name: 'Computer' },
            { title: 'Pro Audio', name: 'Pro Audio' },
            { title: 'Lighting', name: 'Lighting' },
            { title: 'Phone', name: 'Phone' },
            { title: 'Other Accessories', name: 'Other Accessories' },
        ];
        // Find category by name
        const found = categories.find(c => c.title.toLowerCase() === category.toLowerCase());

        if (found) {
            navigateToProductCategory(found.name);
        } else {
            navigateToProductCategory(category);
        }
    };

    return (
        <section className={`py-16 px-4 bg-slate-50 ${className}`}>
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