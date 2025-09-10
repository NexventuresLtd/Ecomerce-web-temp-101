import { X } from "lucide-react";
import { getImageUrl } from "../../../app/dashcategory/helperShared";
import type { ProductCategory, SubCategory, ViewModalProps } from "../../../types/dashboard/category";

const ViewModal: React.FC<ViewModalProps> = ({
    isOpen,
    onClose,
    category
}) => {
    if (!isOpen || !category) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900">Category Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                        {getImageUrl(category) !== "" ?
                            <img
                                src={getImageUrl(category)}
                                alt={category.name}
                                className="w-full h-full object-cover"
                            /> :
                            <span className="text-9xl font-bold text-gray-500">
                                {category.name.charAt(0).toUpperCase()}
                                {category.name.charAt(1).toUpperCase()}
                            </span>
                        }
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Name</h3>
                            <p className="text-lg font-semibold text-gray-900">{category.name}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                            <p className="text-md text-gray-900">{category.slug}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Type</h3>
                            <p className="text-md text-gray-900 capitalize">{category.type} category</p>
                        </div>

                        {category.description && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="text-md text-gray-900">{category.description}</p>
                            </div>
                        )}

                        {category.type === 'sub' && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Main Category</h3>
                                <p className="text-md text-gray-900">{(category as SubCategory).main_category_name || 'N/A'}</p>
                            </div>
                        )}

                        {category.type === 'product' && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Sub Category</h3>
                                <p className="text-md text-gray-900">{(category as ProductCategory).sub_category_name || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ViewModal;