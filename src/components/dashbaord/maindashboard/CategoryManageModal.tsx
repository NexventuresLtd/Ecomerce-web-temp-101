import { useEffect, useState } from "react";
import type { CategoryModalProps, ProductCategory, SubCategory } from "../../../types/dashboard/category";
import { convertImageToBase64, generateSlug, getImageUrl } from "../../../app/dashcategory/helperShared";
import { ImageIcon, X } from "lucide-react";

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingCategory,
    mainCategories,
    subCategories,
    type,
    loading
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        main_category_id: 0,
        sub_category_id: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [slug, setSlug] = useState('');
   useEffect(() => {
        if (!isOpen) {
            setImagePreview('');
        }
    }, [isOpen]);
    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name,
                description: editingCategory.description || '',
                main_category_id: (editingCategory as SubCategory).main_category_id || 0,
                sub_category_id: (editingCategory as ProductCategory).sub_category_id || 0,
            });
            setSlug(editingCategory.slug);
        } else {
            setFormData({
                name: '',
                description: '',
                main_category_id: 0,
                sub_category_id: 0,
            });
            setSlug('');
        }
        setImageFile(null);
    }, [editingCategory, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug when name changes
        if (name === 'name' && !editingCategory) {
            setSlug(generateSlug(value));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const base64 = await convertImageToBase64(file);
            setImagePreview(base64);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageBase64 = '';
        if (imageFile) {
            imageBase64 = await convertImageToBase64(imageFile);
        }
        // alert(imageBase64)
        const submitData = {
            name: formData.name,
            slug: editingCategory ? editingCategory.slug : slug,
            description: formData.description,
            image: imageBase64,
            ...(type === 'sub' && { main_category_id: Number(formData.main_category_id) }),
            ...(type === 'product' && { sub_category_id: Number(formData.sub_category_id) }),
        };

        onSubmit(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingCategory ? 'Edit' : 'Add New'} {type === 'main' ? 'Main' : type === 'sub' ? 'Sub' : 'Product'} Category
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Category Name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="Category Slug"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from name</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {type === 'sub' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Category *</label>
                            <select
                                name="main_category_id"
                                value={formData.main_category_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value={0}>Select Main Category</option>
                                {mainCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {type === 'product' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category *</label>
                            <select
                                name="sub_category_id"
                                value={formData.sub_category_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value={0}>Select Sub Category</option>
                                {subCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Supported formats: JPG, PNG, GIF</p>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 text-sm">
                                <ImageIcon size={16} />
                                {imageFile ? 'Change Image' : 'Choose Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {/* {imageFile && <span className="text-sm">{imageFile.name}</span>} */}
                            {imagePreview && (
                                <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {editingCategory?.image && !imageFile && (
                                <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getImageUrl(editingCategory)}
                                        alt={editingCategory.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : editingCategory ? 'Update' : 'Create'} Category
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:bg-gray-100 flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CategoryModal;