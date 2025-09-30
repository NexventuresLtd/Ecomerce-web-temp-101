import { ImageIcon, Loader, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { productApi } from "../../../app/products/allProductgeter";
import { ImageUpload } from "./ImageUploader";
import type { Product, ProductImage } from "../../../types/Product/producttypeAdmin";

// Image Manager Component
export const ImageManager = ({ productId, onClose }: {
    productId: Product;
    onClose: () => void;
}) => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // loadProductImages();
        setLoading(true);
        setImages(
            (productId.images ?? []).map(img => ({
                ...img,
                product_id: productId.id
            })) as ProductImage[]
        );
        setLoading(false);
    }, [productId]);

    const loadProductImages = async () => {
        try {
            setLoading(true);
            const product = await productApi.getProduct(productId.id);
            setImages(
                (product.images || []).map((img: ProductImage) => ({
                    ...img,
                    product_id: product.id
                }))
            );
        } catch (error) {
            console.error('Failed to load product images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (base64Images: string[]) => {
        if (!base64Images.length) return;

        try {
            setUploading(true);

            for (const base64Image of base64Images) {
                const formData = new FormData();
                // Convert base64 to blob
                const response = await fetch(base64Image);
                const blob = await response.blob();
                formData.append('image', blob);
                formData.append('is_primary', 'false');

                await productApi.addProductImage(productId.id, formData);
            }

            await loadProductImages(); // Refresh images
        } catch (error) {
            console.error('Failed to upload images:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        try {
            await productApi.deleteProductImage(imageId);
            await loadProductImages(); // Refresh images
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const handleSetPrimary = async (imageIndex: number) => {
        try {
            await productApi.setPrimaryImage(productId.id, imageIndex);
            await loadProductImages(); // Refresh images
        } catch (error) {
            console.error('Failed to set primary image:', error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Product Images</h4>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                    Done
                </button>
            </div>

            <ImageUpload
                onImageUpload={(images) => handleImageUpload(images.map(img => img.url))}
                multiple={true}
                label="Upload product images (multiple)"
                loading={uploading}
            />

            {uploading && (
                <div className="flex items-center justify-center py-4">
                    <Loader className="animate-spin mr-2" size={20} />
                    <span>Uploading images...</span>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {images.map((image, index) => (
                    <div key={image.id} className="relative group">
                        {/* {image.url ? "yes":"no"} */}
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${image.url}`}
                            alt="Product"
                            className="w-full h-32 object-cover rounded-md"
                        />
                        {image.is_primary && (
                            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                Primary
                            </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            {!image.is_primary && (
                                <button
                                    onClick={() => handleSetPrimary(index)}
                                    className="p-2 bg-white rounded-md text-blue-600 hover:text-blue-800"
                                    title="Set as primary"
                                >
                                    <ImageIcon size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="p-2 hidden bg-white rounded-md text-red-600 hover:text-red-800"
                                title="Delete image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && !uploading && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
                    <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No images uploaded yet</p>
                </div>
            )}
        </div>
    );
};

