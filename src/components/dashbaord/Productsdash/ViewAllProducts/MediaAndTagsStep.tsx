import React, { useState } from 'react';
import {
    X
} from 'lucide-react';

import EnhancedTextEditor from '../Enhanced';
const MediaAndTagsStep: React.FC<{
    formData: any;
    onChange: (data: any) => void;
    loading: boolean;
}> = ({ formData, onChange, loading }) => {
    const [currentTag, setCurrentTag] = useState('');
    // const [currentFeature, setCurrentFeature] = useState('');

    const handleAddTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            onChange({
                ...formData,
                tags: [...formData.tags, currentTag.trim()]
            });
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (index: number) => {
        onChange({
            ...formData,
            tags: formData.tags.filter((_: string, i: number) => i !== index)
        });
    };

    // const handleAddFeature = () => {
    //     if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
    //         onChange({
    //             ...formData,
    //             features: [...formData.features, currentFeature.trim()]
    //         });
    //         setCurrentFeature('');
    //     }
    // };

    // const handleRemoveFeature = (index: number) => {
    //     onChange({
    //         ...formData,
    //         features: formData.features.filter((_: string, i: number) => i !== index)
    //     });
    // };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Product Tags</h3>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                placeholder="Enter a tag"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={loading}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                disabled={loading || !currentTag.trim()}
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(index)}
                                        className="text-blue-600 hover:text-blue-800"
                                        disabled={loading}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Tutorial Video</h3>
                    <input
                        type="url"
                        name="tutorial_video"
                        value={formData.tutorial_video}
                        onChange={(e) => onChange({ ...formData, tutorial_video: e.target.value })}
                        placeholder="Enter YouTube or video URL"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <p className="text-sm text-gray-500">Enter a URL for product tutorial or demonstration video</p>
                </div>
            </div>
            <EnhancedTextEditor
                value={formData.features.join('\n')}
                onChange={(value) => onChange({ ...formData, features: value.split('\n').filter((f: string) => f.trim()) })}
                placeholder="Enter product features, specifications, and benefits..."
                loading={loading}
                label="Product features"
                required
            />

        </div>
    );
};
export default MediaAndTagsStep;