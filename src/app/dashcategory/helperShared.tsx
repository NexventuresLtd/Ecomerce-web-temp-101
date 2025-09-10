// Helper functions
export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        + '-' + Math.floor(1000 + Math.random() * 9000);
};

export const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};
export const getImageUrl = (category: any): string => {
    if (typeof category?.image === 'string' && category.image.trim() !== '') {
        return category.image;
    }
    return "";
};

