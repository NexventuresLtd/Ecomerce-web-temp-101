import React from 'react';

import {

    Palette,

} from 'lucide-react';
import ColorPicker from './ColorPicker';

const ColorsStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    loading: boolean;
}> = ({ formData, onChange, loading }) => {
    const handleColorsChange = (colors: Array<{ name: string; hex: string; stock: number }>) => {
        onChange({ ...formData, colors });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Palette className="text-blue-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-blue-800 font-medium">Color Variations</h3>
                        <p className="text-blue-600 text-sm mt-1">
                            Add color variations for your product. Each color can have its own stock quantity.
                        </p>
                    </div>
                </div>
            </div>

            <ColorPicker
                colors={formData.colors}
                onColorsChange={handleColorsChange}
                loading={loading}
            />
        </div>
    );
};
export default ColorsStep;