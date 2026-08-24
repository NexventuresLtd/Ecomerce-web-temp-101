// components/HeroSliderManager.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Calendar,
  Upload,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';
import { heroSliderService } from '../../../app/sliders/sliders';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';
import type { HeroSlider } from '../../../types/sliders';

// HeroSlider Form Component
interface HeroSliderFormProps {
  slider?: HeroSlider;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const HeroSliderForm: React.FC<HeroSliderFormProps> = ({ slider, onSubmit, onCancel, loading }) => {
  const [title, setTitle] = useState<string>(slider?.title || '');
  const [subtitle, setSubtitle] = useState<string>(slider?.subtitle || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(slider?.image ? `${import.meta.env.VITE_API_BASE_URL}${slider.image}` : '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    // For update, image is optional. For create, it's required if no preview exists
    if (!slider && !imageFile && !imagePreview) {
      alert('Image is required');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('title', title);
      
      if (subtitle.trim()) {
        formData.append('subtitle', subtitle);
      }
      
      // Only append image if it's a new file
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (!slider?.image) {
      setImagePreview('');
    } else {
      // Reset to original image
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}${slider.image}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {slider ? 'Edit Hero Slider' : 'Add New Hero Slider'}
            </h3>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded-md"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Preview Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Slider Image {!slider && '*'}
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative aspect-[16/6] rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  src={imagePreview}
                  alt="Slider preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  {imagePreview ? 'Change image' : 'Upload slider image'}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PNG, JPG up to 5MB
                </p>
                <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
            
            {slider?.image && !imageFile && (
              <p className="text-xs text-gray-500 italic">
                Note: Current image will be kept if no new image is selected
              </p>
            )}
          </div>

          {/* Title & Subtitle Section */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slider title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter slider subtitle (optional)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {slider ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// HeroSlider Card Component
interface HeroSliderCardProps {
  slider: HeroSlider;
  onEdit: (slider: HeroSlider) => void;
  onDelete: (sliderId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showOrderControls?: boolean;
}

const HeroSliderCard: React.FC<HeroSliderCardProps> = ({ 
  slider, 
  onEdit, 
  onDelete,
  onMoveUp,
  onMoveDown,
  showOrderControls = false 
}) => {
  const imageUrl = slider.image 
    ? `${import.meta.env.VITE_API_BASE_URL}${slider.image}`
    : '/placeholder-hero.jpg';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/6] bg-gradient-to-r from-blue-50 to-purple-50">
        <img
          src={imageUrl}
          alt={slider.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-hero.jpg';
          }}
        />
        
        {/* Overlay with Controls */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
          <button
            onClick={() => onEdit(slider)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(slider.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Order Controls */}
        {showOrderControls && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <button
              onClick={onMoveUp}
              className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white"
              title="Move up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={onMoveDown}
              className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white"
              title="Move down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ID Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
            #{slider.id}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
          {slider.title}
        </h3>
        
        {slider.subtitle && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {slider.subtitle}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(slider.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded ${slider.order ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
              Order: {slider.order || 'Default'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main HeroSlider Manager Component
const HeroSliderManager: React.FC = () => {
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HeroSlider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'order'>('newest');

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      setLoading(true);
      const slidersData = await heroSliderService.getHeroSliders(0, 50);
      setSliders(slidersData);
    } catch (error) {
      console.error('Error loading hero sliders:', error);
      alert(getAdminErrorMessage(error, 'Failed to load hero sliders'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlider = async (formData: FormData) => {
    try {
      const newSlider = await heroSliderService.createHeroSlider(formData);
      setSliders(prev => [newSlider, ...prev]);
      setShowForm(false);
      alert('Hero slider created successfully!');
    } catch (error: any) {
      console.error('Error creating hero slider:', error);
      alert(error.response?.data?.detail || 'Failed to create hero slider');
    }
  };

  const handleUpdateSlider = async (formData: FormData) => {
    if (!editingSlider) return;

    try {
      const updatedSlider = await heroSliderService.updateHeroSlider(editingSlider.id, formData);
      setSliders(prev => prev.map(slider => slider.id === editingSlider.id ? updatedSlider : slider));
      setEditingSlider(null);
      setShowForm(false);
      alert('Hero slider updated successfully!');
    } catch (error: any) {
      console.error('Error updating hero slider:', error);
      alert(error.response?.data?.detail || 'Failed to update hero slider');
    }
  };

  const handleDeleteSlider = async (sliderId: string) => {
    if (!window.confirm('Are you sure you want to delete this hero slider?')) return;

    try {
      await heroSliderService.deleteHeroSlider(sliderId);
      setSliders(prev => prev.filter(slider => slider.id !== sliderId));
      alert('Hero slider deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting hero slider:', error);
      alert(error.response?.data?.detail || 'Failed to delete hero slider');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newSliders = [...sliders];
    const temp = newSliders[index];
    newSliders[index] = newSliders[index - 1];
    newSliders[index - 1] = temp;
    
    // Update order values
    newSliders.forEach((slider, idx) => {
      slider.order = idx + 1;
    });
    
    setSliders(newSliders);
  };

  const handleMoveDown = async (index: number) => {
    if (index === sliders.length - 1) return;
    
    const newSliders = [...sliders];
    const temp = newSliders[index];
    newSliders[index] = newSliders[index + 1];
    newSliders[index + 1] = temp;
    
    // Update order values
    newSliders.forEach((slider, idx) => {
      slider.order = idx + 1;
    });
    
    setSliders(newSliders);
  };

  // Filter and sort sliders
  const filteredSliders = sliders
    .filter(slider => 
      slider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'order':
          return (a.order || 999) - (b.order || 999);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hero Slider Management
            </h1>
            <p className="text-gray-600 mt-2">Manage your website hero banners and promotions</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add New Slider
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Total Sliders</p>
            <p className="text-2xl font-bold text-gray-900">{sliders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{sliders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Last Added</p>
            <p className="text-lg font-semibold text-gray-900">
              {sliders[0] ? new Date(sliders[0].created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sliders by title or subtitle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="order">By Order</option>
              </select>
              
              <button
                onClick={loadSliders}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <AnimatePresence>
        {filteredSliders.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredSliders.map((slider, index) => (
              <HeroSliderCard
                key={slider.id}
                slider={slider}
                onEdit={(slider) => {
                  setEditingSlider(slider);
                  setShowForm(true);
                }}
                onDelete={handleDeleteSlider}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                showOrderControls={sortOrder === 'order'}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl max-w-md mx-auto">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hero sliders found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first hero slider to engage visitors.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Slider
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {(showForm || editingSlider) && (
          <HeroSliderForm
            slider={editingSlider || undefined}
            onSubmit={editingSlider ? handleUpdateSlider : handleCreateSlider}
            onCancel={() => {
              setShowForm(false);
              setEditingSlider(null);
            }}
            loading={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSliderManager;