import type { Variants } from "framer-motion";

// Animation variants
export const clothVariant: Variants = {
    initial: { y: 0 },
    animate: { y: -1000 },
};

export const handVariant: Variants = {
    initial: { y: 0, rotate: 180 },
    animate: { y: -10, rotate: -0 },
};

export const formVariant: Variants = {
    hidden: { opacity: 0, y: 0,zoom:0.9 },
    visible: {
        opacity: 1,
        zoom:1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeOut",
            delay: 0.3
        }
    }
};

export const illustrationVariant: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay: 0.8
        }
    }
};