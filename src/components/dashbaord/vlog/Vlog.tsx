// components/VlogManager.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Eye, 
  Search, 
  Youtube,
  Calendar,
//   Filter,
//   Upload,
//   Tag,
//   Users
} from 'lucide-react';
import type { Vlog, VlogCreate } from '../../../types/vlog/vogtypes';
import { vlogService } from '../../../app/vlog/vlog';


// Vlog Form Component
interface VlogFormProps {
  vlog?: Vlog;
  onSubmit: (data: VlogCreate) => void;
  onCancel: () => void;
  loading: boolean;
}

const VlogForm: React.FC<VlogFormProps> = ({ vlog, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState<VlogCreate>({
    title: vlog?.title || '',
    description: vlog?.description || '',
    youtube_id: vlog?.youtube_id || '',
    thumbnail: vlog?.thumbnail || '',
    channel: vlog?.channel || 'Umukamezi',
    published_at: vlog?.published_at || new Date().toISOString().split('T')[0],
    views: vlog?.views || 0,
    tags: vlog?.tags || [],
    category: vlog?.category || ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
          <h3 className="text-lg font-semibold text-gray-900">
            {vlog ? 'Edit Vlog' : 'Add New Vlog'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video ID *
              </label>
              <input
                type="text"
                required
                value={formData.youtube_id}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_id: e.target.value }))}
                placeholder="dQw4w9WgXcQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail URL *
              </label>
              <input
                type="url"
                required
                value={formData.thumbnail}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name *
              </label>
              <input
                type="text"
                required
                value={formData.channel}
                onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published Date *
              </label>
              <input
                type="date"
                required
                value={formData.published_at.split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {formData.youtube_id && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
              <div className="aspect-video bg-black rounded overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${formData.youtube_id}/hqdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (vlog ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Vlog Card Component
interface VlogCardProps {
  vlog: Vlog;
  onEdit: (vlog: Vlog) => void;
  onDelete: (vlogId: string) => void;
}

const VlogCard: React.FC<VlogCardProps> = ({ vlog, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="relative aspect-video bg-gray-900">
        <img
          src={`https://img.youtube.com/vi/${vlog.youtube_id}/hqdefault.jpg`}
          alt={vlog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 transition-all duration-200 flex items-center justify-center">
          <a
            href={`https://youtube.com/watch?v=${vlog.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            <Play className="w-12 h-12 text-white" fill="white" />
          </a>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            YouTube
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {vlog.title}
        </h3>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {vlog.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{vlog.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(vlog.published_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {vlog.category}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(vlog)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(vlog.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {vlog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {vlog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {vlog.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{vlog.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main Vlog Manager Component
const VlogManager: React.FC = () => {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVlog, setEditingVlog] = useState<Vlog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadVlogs();
  }, []);

  const loadVlogs = async () => {
    try {
      setLoading(true);
      const vlogsData = await vlogService.getVlogs(0, 50); // Load first 50 vlogs
      setVlogs(vlogsData);
    } catch (error) {
      console.error('Error loading vlogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVlog = async (vlogData: VlogCreate) => {
    try {
      const newVlog = await vlogService.createVlog(vlogData);
      setVlogs(prev => [newVlog, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating vlog:', error);
      alert('Failed to create vlog');
    }
  };

  const handleUpdateVlog = async (vlogData: VlogCreate) => {
    if (!editingVlog) return;
    
    try {
      const updatedVlog = await vlogService.updateVlog(editingVlog.id, vlogData);
      setVlogs(prev => prev.map(vlog => vlog.id === editingVlog.id ? updatedVlog : vlog));
      setEditingVlog(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating vlog:', error);
      alert('Failed to update vlog');
    }
  };

  const handleDeleteVlog = async (vlogId: string) => {
    if (!window.confirm('Are you sure you want to delete this vlog?')) return;

    try {
      await vlogService.deleteVlog(vlogId);
      setVlogs(prev => prev.filter(vlog => vlog.id !== vlogId));
    } catch (error) {
      console.error('Error deleting vlog:', error);
      alert('Failed to delete vlog');
    }
  };

  // Filter vlogs based on search and category
  const filteredVlogs = vlogs.filter(vlog => {
    const matchesSearch = vlog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vlog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || vlog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(vlogs.map(vlog => vlog.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vlog Management</h1>
            <p className="text-gray-600">Manage your YouTube vlog content</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vlog
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vlogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vlogs Grid */}
      <AnimatePresence>
        {filteredVlogs.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredVlogs.map(vlog => (
              <VlogCard
                key={vlog.id}
                vlog={vlog}
                onEdit={setEditingVlog}
                onDelete={handleDeleteVlog}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vlogs found</h3>
            <p className="text-gray-600">Get started by adding your first vlog.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vlog Form Modal */}
      <AnimatePresence>
        {(showForm || editingVlog) && (
          <VlogForm
            vlog={editingVlog || undefined}
            onSubmit={editingVlog ? handleUpdateVlog : handleCreateVlog}
            onCancel={() => {
              setShowForm(false);
              setEditingVlog(null);
            }}
            loading={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VlogManager;