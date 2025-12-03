import { ChevronDown, ChevronRight, Edit, Eye, Trash2 } from "lucide-react";
import type { CategoryItemProps, ProductCategory, SubCategory } from "../../../types/dashboard/category";
import { getImageUrl } from "../../../app/dashcategory/helperShared";

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    level,
    expandedCategories,
    onToggleExpand,
    onView,
    onEdit,
    onDelete,
    subCategories,
    productCategories,
    mainCategories, // Add this prop
    viewMode,
    loading
}) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren =
        (category.type === 'main' && subCategories.some(sc => sc.main_category_id === category.id)) ||
        (category.type === 'sub' && productCategories.some(pc => pc.sub_category_id === category.id));

    return (
        <div key={`${category.type}-${category.id}`} className={`${level > 0 ? 'ml-6' : ''}`}>
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2 transition-shadow">
                <div className="flex items-center gap-3">
                    {hasChildren && viewMode === 'hierarchy' && (
                        <button
                            onClick={() => onToggleExpand(category.id)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                    )}
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        {getImageUrl(category) !== "" ?
                            <img
                                src={getImageUrl(category)}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            /> :
                            <span className="text-2xl font-bold text-gray-500">
                                {category.name.charAt(0).toUpperCase()}
                            </span>
                        }
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.slug}</p>
                        </div>
                        
                        {/* Parent hierarchy display */}
                        <div className="mt-1">
                            {category.type === 'main' && (
                                <div className="text-xs text-gray-600">
                                    <span className="font-medium">Type:</span> Top Level Category
                                </div>
                            )}
                            
                            {category.type === 'sub' && (
                                <div className="text-xs text-gray-600">
                                    <span className="font-medium">Top Level:</span> {(category as SubCategory).main_category_name || 'N/A'}
                                </div>
                            )}
                            
                            {category.type === 'product' && (
                                <div className="text-xs text-gray-600 space-y-1">
                                    <div>
                                        <span className="font-medium">Mid Level:</span> {(category as ProductCategory).sub_category_name || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Top Level:</span> {
                                            // Find the main category through sub category
                                            (() => {
                                                const productCat = category as ProductCategory;
                                                const subCat = subCategories.find(sc => sc.id === productCat.sub_category_id);
                                                const mainCat = subCat ? mainCategories.find(mc => mc.id === subCat.main_category_id) : null;
                                                return mainCat?.name || 'N/A';
                                            })()
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-2 mt-1">
                            {/* <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                {category.type}
                            </span>
                            {category.type === 'sub' && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                   {(category as SubCategory).main_category_name || 'N/A'}
                                </span>
                            )}
                            {category.type === 'product' && (
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                    End Level
                                </span>
                            )} */}
                        </div>
                        
                        {category.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{category.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onView(category)}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
                        disabled={loading}
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                        disabled={loading}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
                        disabled={loading}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && hasChildren && viewMode === 'hierarchy' && (
                <div className="mt-2">
                    {category.type === 'main' &&
                        subCategories
                            .filter(sc => sc.main_category_id === category.id)
                            .map(subCat => (
                                <CategoryItem
                                    key={`sub-${subCat.id}`}
                                    category={subCat}
                                    level={level + 1}
                                    expandedCategories={expandedCategories}
                                    onToggleExpand={onToggleExpand}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    subCategories={subCategories}
                                    productCategories={productCategories}
                                    mainCategories={mainCategories} // Pass mainCategories down
                                    viewMode={viewMode}
                                    loading={loading}
                                />
                            ))
                    }
                    {category.type === 'sub' &&
                        productCategories
                            .filter(pc => pc.sub_category_id === category.id)
                            .map(prodCat => (
                                <CategoryItem
                                    key={`product-${prodCat.id}`}
                                    category={prodCat}
                                    level={level + 1}
                                    expandedCategories={expandedCategories}
                                    onToggleExpand={onToggleExpand}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    subCategories={subCategories}
                                    productCategories={productCategories}
                                    mainCategories={mainCategories} // Pass mainCategories down
                                    viewMode={viewMode}
                                    loading={loading}
                                />
                            ))
                    }
                </div>
            )}
        </div>
    );
};
export default CategoryItem;