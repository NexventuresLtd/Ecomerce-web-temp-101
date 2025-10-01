import { ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
import { fileToBase64 } from "../../../app/ImageConvert";

// Image Upload Component
export const ImageUpload = ({
    onImageUpload,
    multiple = false,
    isEditing = false,
    label,
    existingImages = [],
    loading = false
}: {
    onImageUpload: (images: Array<{ url: string; is_primary: boolean }>) => void;
    multiple?: boolean;
    isEditing?: boolean;
    label: string;
    existingImages?: Array<{ url: string; is_primary: boolean }>;
    loading?: boolean;
}) => {
    const [previewImages, setPreviewImages] = useState<Array<{ url: string; is_primary: boolean }>>(existingImages);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        await processFiles(Array.from(files));
    };

    const processFiles = async (files: File[]) => {
        const newImages: Array<{ url: string; is_primary: boolean }> = [];

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                try {
                    const base64 = await fileToBase64(file);
                    newImages.push({ url: base64, is_primary: false });
                } catch (error) {
                    console.error('Error converting file to base64:', error);
                }
            }
        }

        if (newImages.length > 0) {
            if (multiple) {
                const updatedImages = [...previewImages, ...newImages];
                setPreviewImages(updatedImages);
                onImageUpload(updatedImages);
            } else {
                setPreviewImages(newImages);
                onImageUpload(newImages);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        await processFiles(files);
    };

    const removeImage = (index: number) => {
        const newImages = previewImages.filter((_, i) => i !== index);
        setPreviewImages(newImages);
        onImageUpload(newImages);
    };

    const setPrimary = (index: number) => {
        const updatedImages = previewImages.map((img, i) => ({
            ...img,
            is_primary: i === index
        }));
        setPreviewImages(updatedImages);
        onImageUpload(updatedImages);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={loading ? undefined : handleDrop}
            >
                <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center flex-wrap">
                        <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${loading ? 'pointer-events-none text-gray-400' : ''}`}>
                            <span>Upload images</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple={multiple}
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>

            {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={`${isEditing ? import.meta.env.VITE_API_BASE_URL + "/" + image.url : image.url}`}
                                alt={`Preview ${index + 1}`}
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
                                        onClick={() => setPrimary(index)}
                                        className="p-2 bg-white rounded-md text-blue-600 hover:text-blue-800"
                                        title="Set as primary"
                                        disabled={loading}
                                    >
                                        <ImageIcon size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white rounded-md text-red-600 hover:text-red-800"
                                    title="Remove image"
                                    disabled={loading}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
