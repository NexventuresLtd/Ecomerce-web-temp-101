import React, { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import CategoryStats from './CategoryStats';
import CategoryBackground from './CategoryBackground';
import CategoryOverlay from './CategoryOverlay';
import type { Category } from '../../../../types/HomeCategories';

interface CategoryCardProps {
    category: Category;
    index: number;
    showStats: boolean;
    onClick: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    index,
    showStats,
    onClick
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [classesStyle, setClasessStyle] = useState('')
    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.1
            }
        }
    };

    const hoverVariants: Variants = {
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const iconVariants: Variants = {
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const Icon = category.icon;

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            whileHover="hover"
            className="relative group cursor-pointer h-64"
            onClick={() => onClick(category)}
        >
            <motion.div
                onHoverStart={() => setClasessStyle('z-50 h-full w-full top-0 left-0 object-cover')}
                onHoverEnd={() => setClasessStyle("")}
                variants={hoverVariants}
                className={`
          relative overflow-hidden rounded-2xl p-6 transition-all duration-300 h-full
          ${category.hoverBg} ${category.textColor}
          flex flex-col
        `}
            >
                {classesStyle !== "" && <CategoryBackground
                    bgImage={category.bgImage}
                    bgColor={category.bgColor}
                    name={category.name}
                />}

                <CategoryOverlay
                    classes={classesStyle}
                    overlayImage={category.overlayImage}
                    name={category.name}
                />

                {classesStyle !== "" && <> <CategoryBadge badge={category.badge} /> </>}

                <div className={`${classesStyle !== "" ? '' : 'text-transparent'} relative z-10 flex flex-col items-center text-center space-y-4 flex-grow`}>
                    <motion.div
                        variants={iconVariants}
                        className="relative"
                    >
                        <div className={`w-16 h-16 rounded-full bg-white/20 flex items-center justify-center ${classesStyle !== "" ? 'backdrop-blur-sm' : 'text-transparent'} `}>
                            <Icon className="w-8 h-8" />
                        </div>
                    </motion.div>

                    <div className="space-y-2 flex-grow flex flex-col justify-center">
                        <h3 className="text-xl font-bold group-hover:scale-105 transition-transform duration-200">
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="text-sm opacity-80 leading-relaxed">
                                {category.description}
                            </p>
                        )}
                        {classesStyle !== "" &&
                            <CategoryStats stats={category.stats} showStats={showStats} />
                        }
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute bottom-4 right-4 text-current opacity-0 group-hover:opacity-60 transition-all duration-200"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CategoryCard;