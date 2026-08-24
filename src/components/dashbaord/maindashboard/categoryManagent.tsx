import React, { useState, useEffect } from 'react';
import { Plus, ImageIcon, Grid, List, Filter } from 'lucide-react';
import type { Category, MainCategory, ProductCategory, SubCategory } from '../../../types/dashboard/category';
import { categoryApi } from '../../../app/dashcategory/category';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';
import CategoryItem from './CategoryItem';
import CategoryModal from './CategoryManageModal';
import ViewModal from './ViewModal';

// Categories View Component
const CategoriesView: React.FC = () => {
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'main' | 'sub' | 'product'>('main');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'hierarchy' | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'main' | 'sub' | 'product' | 'main'>('main');
    
    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            // Since the API returns nested structure, we need to flatten it
            const mainCats = await categoryApi.getMainCategories();
            
            // Flatten the nested structure
            const allSubCats: SubCategory[] = [];
            const allProductCats: ProductCategory[] = [];
            
            mainCats.forEach((mainCat: any) => {
                
                // Process sub categories
                if (mainCat.sub_categories && Array.isArray(mainCat.sub_categories)) {
                    mainCat.sub_categories.forEach((subCat: any) => {
                        // Add type and main category name to sub category
                        const enhancedSubCat = {
                            ...subCat,
                            type: 'sub' as const,
                            main_category_id: mainCat.id,
                            main_category_name: mainCat.name
                        };
                        allSubCats.push(enhancedSubCat);
                        
                        // Process product categories
                        if (subCat.product_categories && Array.isArray(subCat.product_categories)) {
                            subCat.product_categories.forEach((prodCat: any) => {
                                // Add type and parent names to product category
                                const enhancedProdCat = {
                                    ...prodCat,
                                    type: 'product' as const,
                                    sub_category_id: subCat.id,
                                    sub_category_name: subCat.name,
                                    main_category_id: mainCat.id,
                                    main_category_name: mainCat.name
                                };
                                allProductCats.push(enhancedProdCat);
                            });
                        }
                    });
                }
            });

            // Update state with enhanced categories
            setMainCategories(mainCats.map((cat: any) => ({ ...cat, type: 'main' as const })));
            setSubCategories(allSubCats);
            setProductCategories(allProductCats);
            
        } catch (error) {
            console.error('Failed to load categories:', error);
            setError(getAdminErrorMessage(error, 'Failed to load categories. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleCreateCategory = (type: 'main' | 'sub' | 'product') => {
        setModalType(type);
        setEditingCategory(null);
        setModalOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setModalType(category.type);
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleViewCategory = (category: Category) => {
        setViewingCategory(category);
        setViewModalOpen(true);
    };

    const handleDeleteCategory = async (category: Category) => {
        if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) return;

        setLoading(true);
        setError(null);
        try {
            if (category.type === 'main') {
                await categoryApi.deleteMainCategory(category.id);
            } else if (category.type === 'sub') {
                await categoryApi.deleteSubCategory(category.id);
            } else {
                await categoryApi.deleteProductCategory(category.id);
            }

            loadCategories(); // Reload categories
        } catch (error: any) {
            console.error('Failed to delete category:', error);
            setError(error.response?.data?.detail || 'Failed to delete category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCategory = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            if (editingCategory) {
                // Update existing category
                if (editingCategory.type === 'main') {
                    await categoryApi.updateMainCategory(editingCategory.id, data);
                } else if (editingCategory.type === 'sub') {
                    await categoryApi.updateSubCategory(editingCategory.id, data);
                } else {
                    await categoryApi.updateProductCategory(editingCategory.id, data);
                }
            } else {
                // Create new category
                if (modalType === 'main') {
                    await categoryApi.createMainCategory(data);
                } else if (modalType === 'sub') {
                    await categoryApi.createSubCategory(data);
                } else {
                    await categoryApi.createProductCategory(data);
                }
            }

            setModalOpen(false);
            loadCategories(); // Reload categories
        } catch (error: any) {
            console.error('Failed to save category:', error);
            setError(error.response?.data?.detail || 'Failed to save category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on selected type and search term
    const filteredCategories = () => {
        let allCategories: Category[] = [];

        if (activeTab === 'main') {
            allCategories = [...mainCategories];
        }

        if (activeTab === 'sub') {
            allCategories = [...subCategories];
        }

        if (activeTab === 'product') {
            allCategories = [...productCategories];
        }

        if (searchTerm) {
            return allCategories.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return allCategories;
    };

    const renderAllCategories = () => {
        const categories = filteredCategories();

        if (categories.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={24} className="text-gray-400" />
                    </div>
                    <h4 className="text-gray-700 font-medium">No categories found</h4>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or search term</p>
                </div>
            );
        }

        return categories.map(category => (
            <CategoryItem
                key={`${category.type}-${category.id}`}
                category={category}
                level={0}
                expandedCategories={expandedCategories}
                onToggleExpand={toggleExpand}
                onView={handleViewCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                subCategories={subCategories}
                productCategories={productCategories}
                mainCategories={mainCategories}
                viewMode={viewMode}
                loading={loading}
            />
        ));
    };

    const renderHierarchyView = () => {
        if (mainCategories.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={24} className="text-gray-400" />
                    </div>
                    <h4 className="text-gray-700 font-medium">No categories yet</h4>
                    <p className="text-gray-500 mt-1">Get started by creating your first category</p>
                    <button
                        onClick={() => handleCreateCategory('main')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Main Category
                    </button>
                </div>
            );
        }

        return mainCategories.map(category => (
            <CategoryItem
                key={`main-${category.id}`}
                category={category}
                level={0}
                expandedCategories={expandedCategories}
                onToggleExpand={toggleExpand}
                onView={handleViewCategory}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                subCategories={subCategories}
                productCategories={productCategories}
                mainCategories={mainCategories}
                viewMode={viewMode}
                loading={loading}
            />
        ));
    };

    return (
        <div className="p-6 mx-auto ">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                    <p className="text-gray-600">Organize your products with categories</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleCreateCategory('main')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                        disabled={loading}
                    >
                        <Plus size={16} />
                        Top level Category
                    </button>
                    <button
                        onClick={() => handleCreateCategory('sub')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
                        disabled={loading || mainCategories.length === 0}
                    >
                        <Plus size={16} />
                        Mid Level Category
                    </button>
                    <button
                        onClick={() => handleCreateCategory('product')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-400 flex items-center gap-2"
                        disabled={loading || subCategories.length === 0}
                    >
                        <Plus size={16} />
                        End level Category
                    </button>
                </div>
            </div>


            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 h-full">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                            <button
                                onClick={() => setActiveTab('main')}
                                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'main' ? 'bg-white' : 'text-gray-600'}`}
                            >
                                Top level Categories
                            </button>
                            <button
                                onClick={() => setActiveTab('sub')}
                                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'sub' ? 'bg-white' : 'text-gray-600'}`}
                            >
                                Mid Level Categories
                            </button>
                            <button
                                onClick={() => setActiveTab('product')}
                                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'product' ? 'bg-white' : 'text-gray-600'}`}
                            >
                                End level Categories
                            </button>
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                        <button
                            onClick={() => setViewMode('hierarchy')}
                            className={`px-3 py-1 rounded-md text-sm hidden ${viewMode === 'hierarchy' ? 'bg-white' : 'text-gray-600'}`}
                        >
                            <div className="flex items-center gap-1">
                                <List size={16} />
                                Hierarchy
                            </div>
                        </button>
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-3 py-2 rounded-md text-sm text-nowrap ${viewMode === 'all' ? 'bg-white' : 'text-gray-600'}`}
                        >
                            <div className="flex items-center gap-1">
                                <Grid size={16} />
                                All Categories
                            </div>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Loading categories...</p>
                    </div>
                ) : viewMode === 'hierarchy' ? (
                    renderHierarchyView()
                ) : (
                    renderAllCategories()
                )}
            </div>

            {/* Modals */}
            <CategoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmitCategory}
                editingCategory={editingCategory}
                mainCategories={mainCategories}
                subCategories={subCategories}
                type={modalType}
                loading={loading}
            />

            <ViewModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                category={viewingCategory}
                loading={loading}
            />
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 fixed z-50 top-20 right-0 m-4 shadow-lg">
                    <p>{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 text-red-800 hover:text-red-900 text-sm font-medium"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoriesView;