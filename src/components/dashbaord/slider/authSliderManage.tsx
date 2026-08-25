// components/dashbaord/slider/authSliderManage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Upload,
  Save,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { authSliderService } from '../../../app/authSlider/authSlider';
import { getAdminErrorMessage } from '../../../app/utils/getAdminErrorMessage';
import type { AuthSlider } from '../../../types/authSlider';

interface AuthSliderFormProps {
  slider?: AuthSlider;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const AuthSliderForm: React.FC<AuthSliderFormProps> = ({ slider, onSubmit, onCancel }) => {
  const [title, setTitle] = useState<string>(slider?.title || '');
  const [subtitle, setSubtitle] = useState<string>(slider?.subtitle || '');
  const [sortOrder, setSortOrder] = useState<number>(slider?.sort_order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(slider?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    slider?.image ? `${import.meta.env.VITE_API_BASE_URL}${slider.image}` : ''
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (!slider && !imageFile) {
      alert('Image is required');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      if (subtitle.trim()) formData.append('subtitle', subtitle);
      formData.append('sort_order', String(sortOrder));
      if (slider) formData.append('is_active', String(isActive));
      if (imageFile) formData.append('image', imageFile);
      onSubmit(formData);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {slider ? 'Edit Auth Slide' : 'Add New Auth Slide'}
          </h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-md" disabled={isUploading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Slide Image {!slider && '*'}
            </label>
            {imagePreview && (
              <div className="relative aspect-[3/4] max-h-64 rounded-xl overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors text-sm text-gray-600">
              <Upload className="w-4 h-4" />
              {imagePreview ? 'Change image' : 'Upload image'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isUploading} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              />
            </div>
            {slider && (
              <label className="flex items-center gap-2 mt-6 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50" disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" disabled={isUploading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
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

const AuthSliderManager: React.FC = () => {
  const [sliders, setSliders] = useState<AuthSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<AuthSlider | null>(null);

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      setLoading(true);
      setSliders(await authSliderService.getAuthSliders(0, 50));
    } catch (error) {
      alert(getAdminErrorMessage(error, 'Failed to load auth slides'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      const created = await authSliderService.createAuthSlider(formData);
      setSliders((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
      setShowForm(false);
    } catch (error) {
      alert(getAdminErrorMessage(error, 'Failed to create slide'));
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingSlider) return;
    try {
      const updated = await authSliderService.updateAuthSlider(editingSlider.id, formData);
      setSliders((prev) => prev.map((s) => (s.id === editingSlider.id ? updated : s)).sort((a, b) => a.sort_order - b.sort_order));
      setEditingSlider(null);
      setShowForm(false);
    } catch (error) {
      alert(getAdminErrorMessage(error, 'Failed to update slide'));
    }
  };

  const handleDelete = async (sliderId: number) => {
    if (!window.confirm('Delete this auth slide?')) return;
    try {
      await authSliderService.deleteAuthSlider(sliderId);
      setSliders((prev) => prev.filter((s) => s.id !== sliderId));
    } catch (error) {
      alert(getAdminErrorMessage(error, 'Failed to delete slide'));
    }
  };

  const toggleActive = async (slider: AuthSlider) => {
    try {
      const fd = new FormData();
      fd.append('is_active', String(!slider.is_active));
      const updated = await authSliderService.updateAuthSlider(slider.id, fd);
      setSliders((prev) => prev.map((s) => (s.id === slider.id ? updated : s)));
    } catch (error) {
      alert(getAdminErrorMessage(error, 'Failed to update slide'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auth Page Slider</h1>
          <p className="text-gray-600 mt-2">Manage the image slideshow shown on the login &amp; register pages</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </motion.button>
      </div>

      <AnimatePresence>
        {sliders.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sliders.map((slider) => {
              const imageUrl = `${import.meta.env.VITE_API_BASE_URL}${slider.image}`;
              return (
                <motion.div
                  key={slider.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white rounded-lg border overflow-hidden group ${slider.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}
                >
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-50 to-purple-50">
                    <img src={imageUrl} alt={slider.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => { setEditingSlider(slider); setShowForm(true); }} className="p-2 bg-white/90 rounded-full hover:bg-white" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleActive(slider)} className="p-2 bg-white/90 rounded-full hover:bg-white" title={slider.is_active ? 'Deactivate' : 'Activate'}>
                        {slider.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(slider.id)} className="p-2 bg-white/90 rounded-full hover:bg-white" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      #{slider.sort_order}
                    </span>
                    {!slider.is_active && (
                      <span className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">Hidden</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{slider.title}</h3>
                    {slider.subtitle && <p className="text-gray-600 text-xs mt-1 line-clamp-2">{slider.subtitle}</p>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl max-w-md mx-auto">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No auth slides yet</h3>
              <p className="text-gray-600 mb-6">Add slides to show on the login &amp; register pages.</p>
              <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add First Slide
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showForm || editingSlider) && (
          <AuthSliderForm
            slider={editingSlider || undefined}
            onSubmit={editingSlider ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingSlider(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthSliderManager;
