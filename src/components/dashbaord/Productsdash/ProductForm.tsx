import React, { useEffect, useState } from "react";

import { categoryApi } from "../../../app/dashcategory/category";
import { ArrowLeft, ArrowRight, Loader, Plus, X } from "lucide-react";
import { ImageUpload } from "./ImageUploader";
import { ColorPicker } from "./colorpicker";
import type { CategoryHierarchy, Product } from "../../../types/Product/producttypeAdmin";

// Multi-Step Product Form Component
export const ProductForm = ({
    product,
    onSubmit,
    loading = false
}: {
    product?: Product | null;
    onSubmit: (data: Product) => void;
    onCancel: () => void;
    loading?: boolean;
}) => {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<CategoryHierarchy>({
        mainCategories: [],
        subCategories: [],
        productCategories: []
    });

    const [selectedMain, setSelectedMain] = useState<number | null>(null);
    const [selectedSub, setSelectedSub] = useState<number | null>(null);
    const [currentTag, setCurrentTag] = useState('');
    const [currentFeature, setCurrentFeature] = useState('');
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [formData, setFormData] = useState<Product>({
        id: product?.id || 0,
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price,
        original_price: product?.original_price,
        discount: product?.discount,
        rating: product?.rating,
        is_new: product?.is_new || false,
        is_featured: product?.is_featured || false,
        is_active: product?.is_active !== undefined ? product.is_active : true,
        reviews_count: product?.reviews_count,
        instock: product?.instock,
        delivery_fee: product?.delivery_fee,
        brock: product?.brock || '',
        returnDay: product?.returnDay || '',
        warranty: product?.warranty || '',
        hover_image: product?.hover_image || '',
        tutorial_video: product?.tutorial_video || '',
        tags: product?.tags || [],
        features: product?.features || [],
        colors: product?.colors || [],
        category_id: product?.category_id || 0,
        images: product?.images || []
    });

    // Load categories once on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const main = await categoryApi.getMainCategories();
                const sub = await categoryApi.getSubCategories();
                const productCats = await categoryApi.getProductCategories();
                const hierarchy: CategoryHierarchy = {
                    mainCategories: main,
                    subCategories: sub,
                    productCategories: productCats
                };
                setCategories(hierarchy);

                // If editing, set the selected values based on product category
                if (product && product.category_id) {
                    // This would need additional logic to find the hierarchy based on category_id
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleHoverImageUpload = (images: Array<{ url: string; is_primary: boolean }>) => {
        if (images.length > 0) {
            setFormData(prev => ({
                ...prev,
                hover_image: images[0].url
            }));
        }
    };

    const handleProductImagesUpload = (images: Array<{ url: string; is_primary: boolean }>) => {
        setFormData(prev => ({
            ...prev,
            images: images.map((img) => ({
                id: (img as any).id ?? 0,
                url: img.url,
                is_primary: img.is_primary,
                // Optionally add product_id if needed: product_id: prev.id
            }))
        }));
    };

    const handleAddTag = () => {
        if (currentTag.trim()) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === ',' || e.key === ';') {
            e.preventDefault();
            const tags = currentTag.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag);
            if (tags.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), ...tags]
                }));
                setCurrentTag('');
            }
        }
    };

    const handleRemoveTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: (prev.tags || []).filter((_, i) => i !== index)
        }));
    };

    const handleAddFeature = () => {
        if (currentFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), currentFeature.trim()]
            }));
            setCurrentFeature('');
        }
    };

    const handleFeatureInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFeature();
        } else if (e.key === ',' || e.key === ';') {
            e.preventDefault();
            const features = currentFeature.split(/[,;]/).map(feature => feature.trim()).filter(feature => feature);
            if (features.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    features: [...(prev.features || []), ...features]
                }));
                setCurrentFeature('');
            }
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index)
        }));
    };

    const handleColorsChange = (colors: Array<{ name: string; hex: string; stock: number }>) => {
        setFormData(prev => ({
            ...prev,
            colors
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        (formData.discount) && (formData.discount > 0) && (formData.discount < 100) ? onSubmit(formData) : alert("Invalid discount");
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    // Step 1: Basic Information
    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                    <select
                        value={selectedMain || ''}
                        onChange={(e) => setSelectedMain(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={categoriesLoading || loading}
                    >
                        <option value="">Select Main Category</option>
                        {categories.mainCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <select
                        value={selectedSub || ''}
                        onChange={(e) => setSelectedSub(e.target.value ? parseInt(e.target.value) : null)}
                        disabled={!selectedMain || categoriesLoading || loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Sub Category</option>
                        {categories.subCategories
                            .filter(sub => sub.main_category_id === selectedMain)
                            .map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Category *</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        disabled={!selectedSub || categoriesLoading || loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Product Category</option>
                        {categories.productCategories
                            .filter(pc => pc.sub_category_id === selectedSub)
                            .map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Price *</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                    <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">In Stock *</label>
                    <input
                        type="number"
                        name="instock"
                        value={formData.instock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee</label>
                    <select onChange={handleChange} name="delivery_fee" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}>
                        <option >City Center → Free</option>
                        <option >In Kigali → 2,000 RFW</option>
                        <option >Out of Kigali → 5,000 RFW</option>
                        <option >Outside Rwanda → Negotiable</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brock </label>
                    <input
                        type="text"
                        name="brock"
                        value={formData.brock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty </label>
                    <select
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((data) => (
                            <option key={data}>{data} Month</option>
                        ))}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((data) => (
                            <option key={data}>{data} Year</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Days </label>
                    <select
                        name="returnDay"
                        value={formData.returnDay}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option>Not Applied</option>
                        {[1, 2, 3, 4, 5, 6, 7].map((data) => (
                            <option key={data}>{data} {data == 1 ? "day" : "days"}</option>
                        ))}
                        {[1, 2, 3, 4].map((data) => (
                            <option key={data}>{data} {data == 1 ? " week" : "weeks"}</option>
                        ))}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((data) => (
                            <option key={data}>{data} Month</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>


                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label className="ml-2 block text-sm text-gray-700">Mark as New</label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label className="ml-2 block text-sm text-gray-700">Mark as Featured</label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label className="ml-2 block text-sm text-gray-700">Active Product</label>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
                    disabled={loading || !formData.title || !formData.price || !formData.instock || !formData.description || !formData.category_id}
                >
                    Next <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    // Step 2: Media & Additional Information
    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Media & Additional Information</h3>

            <div className="grid grid-cols-1 gap-6">
                <ImageUpload
                    onImageUpload={handleHoverImageUpload}
                    multiple={false}
                    label="Hover Image"
                    existingImages={formData.hover_image ? [{ url: formData.hover_image, is_primary: true }] : []}
                    loading={loading}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tutorial Video URL</label>
                    <input
                        type="url"
                        name="tutorial_video"
                        value={formData.tutorial_video}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/video.mp4"
                        disabled={loading}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separate with commas)</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleTagInput}
                            placeholder="Add tags (comma separated)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading || !currentTag.trim()}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags?.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="ml-1 text-gray-500 hover:text-gray-700"
                                    disabled={loading}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (separate with commas)</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={currentFeature}
                            onChange={(e) => setCurrentFeature(e.target.value)}
                            onKeyDown={handleFeatureInput}
                            placeholder="Add features (comma separated)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={loading || !currentFeature.trim()}
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.features?.map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="ml-1 text-gray-500 hover:text-gray-700"
                                    disabled={loading}
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
                    disabled={loading}
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
                    disabled={loading}
                >
                    Next <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    // Step 3: Colors & Variations
    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Colors & Variations</h3>

            <ColorPicker
                colors={formData.colors || []}
                onColorsChange={handleColorsChange}
                loading={loading}
            />

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
                    disabled={loading}
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
                    disabled={loading}
                >
                    Next <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );

    // Step 4: Product Images
    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Product Images</h3>

            <ImageUpload
                onImageUpload={handleProductImagesUpload}
                multiple={true}
                label="Upload product images (multiple)"
                existingImages={formData.images || []}
                loading={loading}
            />

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center"
                    disabled={loading}
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center"
                    disabled={loading || !formData.images || formData.images.length === 0}
                >
                    {loading ? (
                        <>
                            <Loader className="animate-spin mr-2" size={16} />
                            {product ? 'Updating Product...' : 'Creating Product...'}
                        </>
                    ) : (
                        <>
                            <Plus size={16} className="mr-2" />
                            {product ? 'Update Product' : 'Create Product'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <React.Fragment key={stepNumber}>
                            <div className={`flex flex-col items-center ${stepNumber <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${stepNumber <= step ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
                                    {stepNumber}
                                </div>
                                <div className="text-xs mt-1">
                                    {stepNumber === 1 && 'Basic Info'}
                                    {stepNumber === 2 && 'Media & Tags'}
                                    {stepNumber === 3 && 'Colors'}
                                    {stepNumber === 4 && 'Images'}
                                </div>
                            </div>
                            {stepNumber < 4 && (
                                <div className={`w-16 h-1 mx-2 ${stepNumber < step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </form>
    );
};
