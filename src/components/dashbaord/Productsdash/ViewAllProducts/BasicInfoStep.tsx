import type { CategoryHierarchy } from "../../../../types/Product/NewProductDataDash";


const BasicInfoStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    categories: CategoryHierarchy;
    selectedMain: number | null;
    selectedSub: number | null;
    onMainChange: (id: number | null) => void;
    onSubChange: (id: number | null) => void;
    categoriesLoading: boolean;
    loading: boolean;
    formatRWF: (amount: number) => string;
}> = ({ formData, onChange, categories, selectedMain, selectedSub, onMainChange, onSubChange, categoriesLoading, loading, formatRWF }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        onChange({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const deliveryOptions = [
        "City Center → Free",
        "In Kigali → 2,000 RWF",
        "Out of Kigali → 5,000 RWF",
        "Outside Rwanda → Negotiable"
    ];

    const warrantyOptions = [
        ...Array.from({ length: 10 }, (_, i) => `${i + 1} Month`),
        ...Array.from({ length: 5 }, (_, i) => `${i + 1} Year`)
    ];

    const returnOptions = [
        "Not Applied",
        ...Array.from({ length: 7 }, (_, i) => `${i + 1} ${i === 0 ? "day" : "days"}`),
        ...Array.from({ length: 4 }, (_, i) => `${i + 1} ${i === 0 ? "week" : "weeks"}`),
        ...Array.from({ length: 6 }, (_, i) => `${i + 1} Month`)
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Category</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                                <select
                                    value={selectedMain || ''}
                                    onChange={(e) => onMainChange(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    disabled={categoriesLoading || loading}
                                >
                                    <option value="">Select Main Category</option>
                                    {categories.mainCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                                <select
                                    value={selectedSub || ''}
                                    onChange={(e) => onSubChange(e.target.value ? parseInt(e.target.value) : null)}
                                    disabled={!selectedMain || categoriesLoading || loading}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Category *</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    disabled={!selectedSub || categoriesLoading || loading}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product title"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product description"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (RWF) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter current price"
                                    required
                                    disabled={loading}
                                />
                                {formData.price && (
                                    <p className="text-sm text-green-600 mt-1">
                                        {formatRWF(Number(formData.price))}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (RWF)</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.original_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter original price"
                                    disabled={loading}
                                />
                                {formData.original_price && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {formatRWF(Number(formData.original_price))}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter discount percentage"
                                    min="0"
                                    max="100"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Stock & Status</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="instock"
                                    value={formData.instock}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter stock quantity"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        disabled={loading}
                                    />
                                    <label className="ml-2 text-sm text-gray-700">Active</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
                                <select
                                    name="is_new"
                                    value={formData.is_new}
                                    onChange={handleChange}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="Used like new">Used like new</option>
                                    <option value="refurbished">Refurbished</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee</label>
                    <select
                        name="delivery_fee"
                        value={formData.delivery_fee}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select delivery option</option>
                        {deliveryOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                    <select
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select warranty</option>
                        <option value="No Warranty">No Warranty</option>
                        {warrantyOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                    <select
                        name="returnDay"
                        value={formData.returnDay}
                        onChange={handleChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={loading}
                    >
                        <option value="">Select return policy</option>
                        {returnOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brock</label>
                <textarea
                    name="brock"
                    value={formData.brock}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter any Brock information"
                    disabled={loading}
                />
            </div>
        </div>
    );
};
export default BasicInfoStep;