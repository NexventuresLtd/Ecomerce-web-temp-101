import { X } from "lucide-react";
import { useState } from "react";

// Color Picker Component
export const ColorPicker = ({
    colors,
    onColorsChange,
    loading = false
}: {
    colors: Array<{ name: string; hex: string; stock: number }>;
    onColorsChange: (colors: Array<{ name: string; hex: string; stock: number }>) => void;
    loading?: boolean;
}) => {
    const [currentColor, setCurrentColor] = useState({ name: '', hex: '#000000', stock: 0 });

    const handleAddColor = () => {
        if (currentColor.name.trim() && currentColor.stock >= 0) {
            onColorsChange([...colors, { ...currentColor }]);
            setCurrentColor({ name: '', hex: '#000000', stock: 0 });
        }
    };

    const handleRemoveColor = (index: number) => {
        onColorsChange(colors.filter((_, i) => i !== index));
    };

    const updateColor = (index: number, field: string, value: string | number) => {
        const updatedColors = [...colors];
        updatedColors[index] = { ...updatedColors[index], [field]: value };
        onColorsChange(updatedColors);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Colors</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
                    <input
                        type="text"
                        value={currentColor.name}
                        onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                        placeholder="Color name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Value</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={currentColor.hex}
                            onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
                            className="h-10 w-10 p-1 border border-gray-300 rounded-md"
                            disabled={loading}
                        />
                        <input
                            type="text"
                            value={currentColor.hex}
                            onChange={(e) => setCurrentColor({ ...currentColor, hex: e.target.value })}
                            placeholder="#000000"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                        type="number"
                        value={currentColor.stock}
                        onChange={(e) => setCurrentColor({ ...currentColor, stock: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading || !currentColor.name.trim() || currentColor.stock < 0}
            >
                Add Color
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {colors.map((color, index) => (
                    <div key={index} className="flex flex-col p-3 bg-white border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-6 h-6 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.hex }}
                                ></div>
                                <span className="font-medium">{color.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveColor(index)}
                                className="text-red-600 hover:text-red-800"
                                disabled={loading}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Hex Code</label>
                                <input
                                    type="text"
                                    value={color.hex}
                                    onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Stock</label>
                                <input
                                    type="number"
                                    value={color.stock}
                                    onChange={(e) => updateColor(index, 'stock', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};