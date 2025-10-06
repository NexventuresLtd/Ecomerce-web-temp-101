import React, { } from 'react';
import ImageManager from './ImageManager';
import { ImageIcon } from 'lucide-react';
import type { Product } from '../../../../types/Product/NewProductDataDash';

const ImagesStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    product?: Product;
    loading: boolean;
}> = ({ formData, onChange, product, loading }) => {
    const handleImagesChange = (images: File[]) => {
        onChange({ ...formData, images });
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
                images={formData.images}
                existingImages={formData.existing_images}
                onImagesChange={handleImagesChange}
                loading={loading}
            />
        </div>
    );
};
export default ImagesStep;