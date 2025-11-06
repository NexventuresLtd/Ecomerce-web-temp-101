import React from 'react';
import {
    X,
    Upload,
    Star,
    ImageIcon,
} from 'lucide-react';
import type { ProductImage } from '../../../../types/Product/NewProductDataDash';

interface ImageManagerProps {
    images: File[];
    existingImages?: ProductImage[];
    onImagesChange: (images: File[]) => void;
    onExistingImagesChange?: (images: ProductImage[]) => void;
    onDeleteExistingImage?: (imageIndex: number) => void;
    loading?: boolean;
}

const ImageManager: React.FC<ImageManagerProps> = ({ 
    images, 
    existingImages = [], 
    onImagesChange, 
    onExistingImagesChange,
    onDeleteExistingImage,
    loading = false 
}) => {
    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        const newImages = Array.from(files);
        onImagesChange([...images, ...newImages]);
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    const removeExistingImage = (index: number) => {
        if (!onExistingImagesChange || !onDeleteExistingImage) return;
        
        // Call the deletion handler
        onDeleteExistingImage(index);
        
        // Also update the local state immediately
        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        onExistingImagesChange(newExistingImages);
    };

    const setPrimaryImage = (index: number) => {
        const newImages = [...images];
        const [primaryImage] = newImages.splice(index, 1);
        newImages.unshift(primaryImage);
        onImagesChange(newImages);
    };

    const setExistingImageAsPrimary = (index: number) => {
        if (!onExistingImagesChange) return;
        
        // Update all existing images to set the correct primary
        const updatedImages = existingImages.map((img, i) => ({
            ...img,
            is_primary: i === index
        }));
        
        onExistingImagesChange(updatedImages);
    };

    const hasImages = images.length > 0 || existingImages.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                <span className="text-sm text-gray-500">
                    {images.length + existingImages.length} images total
                    {images.length > 0 && ` (${images.length} new)`}
                </span>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-colors hover:border-blue-400">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="product-images"
                    disabled={loading}
                />
                <label htmlFor="product-images" className="cursor-pointer block">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <div className="text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-sm text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB each</div>
                </label>
            </div>

            {images.length > 0 && (
                <div className="border-b pb-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        New Images {images.length > 0 && `(${images.length} uploaded)`}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((file, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        Primary
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setPrimaryImage(index)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                                            title="Set as primary"
                                        >
                                            <Star size={16} className="text-yellow-600" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                        title="Remove image"
                                    >
                                        <X size={16} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {existingImages.length > 0 && (
                <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Existing Images {existingImages.length > 0 && `(${existingImages.length})`}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`}
                                    alt={image.alt_text || `Product image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg"
                                />
                                {image.is_primary && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        Primary
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    {!image.is_primary && onExistingImagesChange && (
                                        <button
                                            type="button"
                                            onClick={() => setExistingImageAsPrimary(index)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
                                            title="Set as primary"
                                        >
                                            <Star size={16} className="text-yellow-600" />
                                        </button>
                                    )}
                                    {onDeleteExistingImage && (
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                            title="Remove image"
                                        >
                                            <X size={16} className="text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!hasImages && (
                <div className="text-center py-8 text-gray-500">
                    <ImageIcon size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No images uploaded yet</p>
                    <p className="text-sm">Upload product images to get started</p>
                </div>
            )}
        </div>
    );
};

export default ImageManager;