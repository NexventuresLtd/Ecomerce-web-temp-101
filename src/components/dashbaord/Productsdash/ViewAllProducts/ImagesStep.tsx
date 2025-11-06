import React, { useState, useEffect } from 'react';
import ImageManager from './ImageManager';
import { ImageIcon } from 'lucide-react';
import type { Product, ProductImage } from '../../../../types/Product/NewProductDataDash';
import mainAxios from '../../../../Instance/mainAxios';

const ImagesStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    product?: Product;
    loading: boolean;
}> = ({ formData, onChange, product, loading }) => {
    const [newImages, setNewImages] = useState<File[]>(formData.images || []);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(formData.existing_images || []);

    // Initialize existing images from product data
    useEffect(() => {
        if (product?.images) {
            const updatedExistingImages = [...product.images];
            setExistingImages(updatedExistingImages);
            onChange({ 
                ...formData, 
                existing_images: updatedExistingImages 
            });
        }
    }, [product]);

    const handleImagesChange = (images: File[]) => {
        setNewImages(images);
        onChange({ ...formData, images });
    };

    const handleExistingImagesChange = (images: ProductImage[]) => {
        setExistingImages(images);
        onChange({ 
            ...formData, 
            existing_images: images 
        });
    };

    const handleDeleteExistingImage = async (imageIndex: number) => {
        if (!product) return;
        
        try {
            // Call the backend to delete the image
            await mainAxios.delete(`/products/${product.id}/images/${imageIndex}`);
            
            // Update local state after successful deletion
            const updatedImages = existingImages.filter((_, index) => index !== imageIndex);
            setExistingImages(updatedImages);
            onChange({
                ...formData,
                existing_images: updatedImages
            });
            
            console.log(`Successfully deleted image at index ${imageIndex}`);
        } catch (error) {
            console.error('Error deleting image:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <ImageIcon className="text-yellow-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-yellow-800 font-medium">Product Images</h3>
                        <p className="text-yellow-600 text-sm mt-1">
                            The first image will be set as primary. You can reorder by setting another image as primary.
                            {!product && " At least one image is required to create a product."}
                        </p>
                    </div>
                </div>
            </div>

            <ImageManager
                images={newImages}
                existingImages={existingImages}
                onImagesChange={handleImagesChange}
                onExistingImagesChange={handleExistingImagesChange}
                onDeleteExistingImage={handleDeleteExistingImage}
                loading={loading}
            />
        </div>
    );
};

export default ImagesStep;