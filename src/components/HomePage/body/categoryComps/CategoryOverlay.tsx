import React from 'react';
import { motion } from 'framer-motion';

interface CategoryOverlayProps {
    overlayImage?: string;
    name: string;
    classes?: string;
}

const CategoryOverlay: React.FC<CategoryOverlayProps> = ({
    overlayImage,
    classes,
    name
}) => {
    if (!overlayImage) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-2 right-2 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 h-full w-full"
        >
            <img
                src={overlayImage}
                alt={`${name} overlay`}
                className={`${classes !== "" ? classes : 'w-full h-full aspect-square object-contain'} `}
            />
        </motion.div>
    );
};

export default CategoryOverlay;