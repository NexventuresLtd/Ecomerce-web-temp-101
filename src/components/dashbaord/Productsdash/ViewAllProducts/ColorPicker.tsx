// Color Picker Component
import React, { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {

    Plus,
    X,

    Palette,

} from 'lucide-react';

const ColorPicker: React.FC<{
    colors: Array<{ name: string; hex: string; stock: number }>;
    onColorsChange: (colors: Array<{ name: string; hex: string; stock: number }>) => void;
    loading?: boolean;
}> = ({ colors, onColorsChange, loading = false }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentColor, setCurrentColor] = useState({ name: '', hex: '#3B82F6', stock: 0 });

    const predefinedColors = [
        { name: 'Red', hex: '#EF4444' },
        { name: 'Blue', hex: '#3B82F6' },
        { name: 'Green', hex: '#10B981' },
        { name: 'Yellow', hex: '#F59E0B' },
        { name: 'Purple', hex: '#8B5CF6' },
        { name: 'Pink', hex: '#EC4899' },
        { name: 'Indigo', hex: '#6366F1' },
        { name: 'Gray', hex: '#6B7280' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
    ];

    const handleAddColor = () => {
        if (currentColor.name.trim() && currentColor.stock >= 0) {
            onColorsChange([...colors, { ...currentColor }]);
            setCurrentColor({ name: '', hex: '#3B82F6', stock: 0 });
            setShowAddForm(false);
        }
    };

    const handleRemoveColor = (index: number) => {
        onColorsChange(colors.filter((_, i) => i !== index));
    };

    const selectPredefinedColor = (color: { name: string; hex: string }) => {
        setCurrentColor({ ...currentColor, name: color.name, hex: color.hex });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Color Variations</label>
                <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    <Plus size={16} />
                    Add Color
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-gray-50 rounded-lg space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Name</label>
                                <input
                                    type="text"
                                    value={currentColor.name}
                                    onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                                    placeholder="Enter color name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={currentColor.stock || ''}
                                    onChange={(e) => setCurrentColor({ ...currentColor, stock: parseInt(e.target.value) || 0 })}
                                    placeholder="Enter stock quantity"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Color</label>
                            <div className="grid grid-cols-5 gap-2">
                                {predefinedColors.map((color, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => selectPredefinedColor(color)}
                                        className={`p-2 rounded-lg border-2 transition-all ${currentColor.hex === color.hex ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300'}`}
                                    >
                                        <div className="w-8 h-8 rounded-md" style={{ backgroundColor: color.hex }} />
                                        <div className="text-xs mt-1 text-gray-600 truncate">{color.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentColor.hex }} />
                                <span className="text-sm text-gray-600 font-mono">{currentColor.hex}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                disabled={loading || !currentColor.name.trim()}
                            >
                                Add Color
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {colors.map((color, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg border border-gray-300" style={{ backgroundColor: color.hex }} />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{color.name}</div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="font-mono">{color.hex}</span>
                                    <span>{color.stock} in stock</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            disabled={loading}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {colors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Palette size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No colors added yet</p>
                    <p className="text-sm">Click "Add Color" to create color variations</p>
                </div>
            )}
        </div>
    );
};
export default ColorPicker;