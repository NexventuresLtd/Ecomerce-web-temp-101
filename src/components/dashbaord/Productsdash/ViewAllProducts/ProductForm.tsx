import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader,
    Palette,
    Package,
    Tag,
    ImageIcon,
} from 'lucide-react';
import mainAxios from '../../../../Instance/mainAxios';
import { categoryApi } from '../../../../app/dashcategory/category';
import type { CategoryHierarchy, Product } from '../../../../types/Product/NewProductDataDash';
import BasicInfoStep from './BasicInfoStep';
import MediaAndTagsStep from './MediaAndTagsStep';
import ColorsStep from './ColorStep';
import ImagesStep from './ImagesStep';


const ProductForm: React.FC<{
    product?: Product;
    onClose: () => void;
    onSave: () => void;
    formatRWF: (amount: number) => string;
}> = ({ product, onClose, onSave, formatRWF }) => {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<CategoryHierarchy>({
        mainCategories: [],
        subCategories: [],
        productCategories: []
    });
    const [selectedMain, setSelectedMain] = useState<number | null>(null);
    const [selectedSub, setSelectedSub] = useState<number | null>(null);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price || '',
        original_price: product?.original_price || '',
        discount: product?.discount || '',
        is_new: product?.is_new || '',
        is_featured: product?.is_featured || false,
        is_active: product?.is_active !== undefined ? product.is_active : true,
        instock: product?.instock || '',
        delivery_fee: product?.delivery_fee || '',
        brock: product?.brock || '',
        returnDay: product?.returnDay || '',
        warranty: product?.warranty || '',
        tutorial_video: product?.tutorial_video || '',
        category_id: product?.category_id || '',
        tags: product?.tags || [],
        features: product?.features || [],
        colors: product?.colors || [],
        images: [] as File[],
        existing_images: product?.images || []
    });

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

                if (product && product.category_id) {
                    const productCat = productCats.find((pc: any) => pc.id === product.category_id);
                    if (productCat) {
                        setSelectedSub(productCat.sub_category_id);
                        const subCat = sub.find((s: any) => s.id === productCat.sub_category_id);
                        if (subCat) {
                            setSelectedMain(subCat.main_category_id);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, [product]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const submitData = new FormData();

            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price.toString());
            submitData.append('instock', formData.instock.toString());
            submitData.append('category_id', formData.category_id.toString());
            submitData.append('is_new', formData.is_new.toString());
            submitData.append('is_featured', formData.is_featured.toString());
            submitData.append('is_active', formData.is_active.toString());

            if (formData.original_price) submitData.append('original_price', formData.original_price.toString());
            if (formData.discount) submitData.append('discount', formData.discount.toString());
            if (formData.delivery_fee) submitData.append('delivery_fee', formData.delivery_fee);
            if (formData.brock) submitData.append('brock', formData.brock);
            if (formData.returnDay) submitData.append('returnDay', formData.returnDay);
            if (formData.warranty) submitData.append('warranty', formData.warranty);
            if (formData.tutorial_video) submitData.append('tutorial_video', formData.tutorial_video);

            if (formData.tags.length > 0) submitData.append('tags', JSON.stringify(formData.tags));
            if (formData.features.length > 0) submitData.append('features', JSON.stringify(formData.features));
            if (formData.colors.length > 0) submitData.append('colors', JSON.stringify(formData.colors));

            formData.images.forEach((image) => {
                submitData.append('images', image);
            });

            if (product) {
                submitData.append('keep_existing_images', 'true');
            }

            if (product) {
                await mainAxios.put(`/products/${product.id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await mainAxios.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Basic Info', icon: Package },
        { number: 2, title: 'Media & Tags', icon: Tag },
        { number: 3, title: 'Colors', icon: Palette },
        { number: 4, title: 'Images', icon: ImageIcon }
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-600 mt-1">Complete all steps to {product ? 'edit' : 'add'} a product</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex justify-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto">
                        {steps.map((stepItem, index) => {
                            const Icon = stepItem.icon;
                            const isCompleted = stepItem.number < step;
                            const isCurrent = stepItem.number === step;

                            return (
                                <div key={stepItem.number} className="flex items-center flex-shrink-0">
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                            isCurrent ? 'border-blue-600 text-blue-600 bg-blue-50' :
                                                'border-gray-300 text-gray-400'
                                            }`}>
                                            {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                        </div>
                                        <span className={`ml-2 font-medium text-sm ${isCurrent || isCompleted ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                            {stepItem.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-6 h-0.5 mx-3 ${stepItem.number < step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {step === 1 && (
                            <BasicInfoStep
                                formData={formData}
                                onChange={setFormData}
                                categories={categories}
                                selectedMain={selectedMain}
                                selectedSub={selectedSub}
                                onMainChange={setSelectedMain}
                                onSubChange={setSelectedSub}
                                categoriesLoading={categoriesLoading}
                                loading={loading}
                                formatRWF={formatRWF}
                            />
                        )}
                        {step === 2 && (
                            <MediaAndTagsStep formData={formData} onChange={setFormData} loading={loading} />
                        )}
                        {step === 3 && (
                            <ColorsStep formData={formData} onChange={setFormData} loading={loading} />
                        )}
                        {step === 4 && (
                            <ImagesStep formData={formData} onChange={setFormData} product={product} loading={loading} />
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-white">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || (!product && formData.images.length === 0)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        {product ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        {product ? 'Update Product' : 'Create Product'}
                                    </>
                                )}
                            </button>
                        )}
                        {step != 4 &&

                            <button
                                onClick={handleSubmit}
                                disabled={loading || (!product && formData.images.length === 0)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        {product ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        {product ? 'Update Product' : 'Create Product'}
                                    </>
                                )}
                            </button>
                        }

                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default ProductForm;