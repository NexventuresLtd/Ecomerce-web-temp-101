import React, { useState, useMemo } from 'react';
import { Search, Filter, Play, Eye, Calendar, Heart, Bookmark, ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../components/SharedComp/footer';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';

// Type Definitions
export interface Vlog {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
    channel: string;
    publishedAt: string;
    views: number;
    tags: string[];
    category: string;
}

// Mock Data
// Updated Mock Data
const vlogData: Vlog[] = [
    // --- existing vlogs (your original list) ---
    {
        id: '1',
        title: 'Building a Startup from Zero: My Journey',
        description: 'Join me as I share the complete journey of building a tech startup from scratch...',
        youtubeId: 'TcpQ4OAKVpQ',
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=480&h=270&fit=crop',
        channel: 'TechEntrepreneur',
        publishedAt: '2024-08-15',
        views: 245000,
        tags: ['startup', 'entrepreneurship', 'business', 'tech'],
        category: 'Business'
    },

    // --- new camera/tutorial/project setup vlogs ---
    {
        id: '9',
        title: 'Camera Setup for Professional Projects',
        description: 'Step-by-step guide on setting up DSLR and mirrorless cameras for professional filming. Covers lighting, angles, tripods, and audio gear for the best results in projects and vlogs.',
        youtubeId: 'TcpQ4OAKVpQ',
        thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=480&h=270&fit=crop',
        channel: 'ProCreator',
        publishedAt: '2024-09-01',
        views: 51000,
        tags: ['camera', 'tutorial', 'projects', 'filmmaking'],
        category: 'Tutorials'
    },
    {
        id: '10',
        title: 'Best Budget Camera Gear for Students & Startups',
        description: 'Affordable yet powerful camera gear recommendations for students, entrepreneurs, and small creators who want professional results without breaking the bank.',
        youtubeId: 'TcpQ4OAKVpQ',
        thumbnail: 'https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=480&h=270&fit=crop',
        channel: 'FilmOnBudget',
        publishedAt: '2024-09-05',
        views: 72000,
        tags: ['gear', 'budget', 'students', 'camera'],
        category: 'Tutorials'
    },
    {
        id: '11',
        title: 'Lighting Setup for High-Quality Videos',
        description: 'Learn how to use softboxes, natural light, and LED panels to achieve the perfect lighting for YouTube videos, product shoots, and professional project presentations.',
        youtubeId: 'TcpQ4OAKVpQ',
        thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=480&h=270&fit=crop',
        channel: 'LightMasters',
        publishedAt: '2024-09-10',
        views: 43000,
        tags: ['lighting', 'camera', 'tutorial', 'setup'],
        category: 'Tutorials'
    },

    // --- new Umukamezi-related content ---
    {
        id: '12',
        title: 'Umukamezi: Modern Projects & Innovations',
        description: 'Exploring how Umukamezi-inspired projects are shaping modern entrepreneurship, lifestyle, and community-driven innovations in Africa.',
        youtubeId: 'TcpQ4OAKVpQ',
        thumbnail: 'https://images.unsplash.com/photo-1590080876331-43e68d8a5d24?w=480&h=270&fit=crop',
        channel: 'UmukameziVision',
        publishedAt: '2024-09-12',
        views: 86000,
        tags: ['umukamezi', 'projects', 'innovation', 'africa'],
        category: 'Lifestyle'
    },
    {
        id: '13',
        title: 'Umukamezi Story: Culture Meets Tech',
        description: 'A deep dive into Umukamezi stories and how culture, technology, and creativity merge to create unique value for communities and businesses.',
        youtubeId: 'p2q3g0uQHBo',
        thumbnail: 'https://images.unsplash.com/photo-1581091870622-1c8c9b7bcf4e?w=480&h=270&fit=crop',
        channel: 'CulturalTech',
        publishedAt: '2024-09-15',
        views: 99000,
        tags: ['umukamezi', 'culture', 'tech', 'business'],
        category: 'Business'
    }
];

const categories = ['All', 'Tech', 'Business', 'Lifestyle', 'Tutorials'];

// Utility Functions
const formatViews = (views: number): string => {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

// SearchBar Component
interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search vlogs by title, tags, or channel..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>

                {/* Filter Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Filter className="w-5 h-5" />
                    Filters
                </button>

                {/* Category Filters (Desktop) */}
                <div className="hidden lg:flex gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden mt-4 pt-4 border-t border-gray-200"
                    >
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => onCategoryChange(category)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// VlogCard Component
interface VlogCardProps {
    vlog: Vlog;
    onVlogClick: (vlog: Vlog) => void;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (vlogId: string) => void;
    onSave: (vlogId: string) => void;
}

const VlogCard: React.FC<VlogCardProps> = ({
    vlog,
    onVlogClick,
    isLiked,
    isSaved,
    onLike,
    onSave
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
            onClick={() => onVlogClick(vlog)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
                <img
                    src={vlog.thumbnail}
                    alt={vlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="bg-white bg-opacity-90 rounded-full p-3"
                    >
                        <Play className="w-6 h-6 text-gray-900" fill="currentColor" />
                    </motion.div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                        {vlog.category}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLike(vlog.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked
                            ? 'bg-red-500 text-white'
                            : 'bg-white bg-opacity-80 text-gray-700 hover:bg-red-50'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSave(vlog.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isSaved
                            ? 'bg-primary text-white'
                            : 'bg-white bg-opacity-80 text-gray-700 hover:bg-blue-50'
                            }`}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-third transition-colors">
                        {vlog.title}
                    </h3>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {vlog.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(vlog.views)} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(vlog.publishedAt)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{vlog.channel}</span>
                    <div className="flex flex-wrap gap-1">
                        {vlog.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// VlogDetail Component
interface VlogDetailProps {
    vlog: Vlog;
    relatedVlogs: Vlog[];
    onClose: () => void;
    onVlogClick: (vlog: Vlog) => void;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (vlogId: string) => void;
    onSave: (vlogId: string) => void;
}

const VlogDetail: React.FC<VlogDetailProps> = ({
    vlog,
    relatedVlogs,
    onClose,
    onVlogClick,
    isLiked,
    isSaved,
    onLike,
    onSave
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="min-h-screen py-8 px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Vlogs
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onLike(vlog.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                Like
                            </button>
                            <button
                                onClick={() => onSave(vlog.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSaved
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                Save
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    <div className="lg:flex">
                        {/* Main Content */}
                        <div className="lg:flex-1 p-6">
                            {/* Video Player */}
                            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                                <iframe
                                    src={`https://www.youtube.com/embed/${vlog.youtubeId}`}
                                    title={vlog.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />

                            </div>

                            {/* Video Info */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{vlog.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                    <span className="font-medium">{vlog.channel}</span>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{formatViews(vlog.views)} views</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(vlog.publishedAt)}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {vlog.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{vlog.description}</p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {vlog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* External Link */}
                            <a
                                href={`https://www.youtube.com/watch?v=${vlog.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Watch on YouTube
                            </a>
                        </div>

                        {/* Related Videos Sidebar */}
                        <div className="lg:w-80 bg-gray-50 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Related Videos</h3>
                            <div className="space-y-4">
                                {relatedVlogs.map((relatedVlog) => (
                                    <motion.div
                                        key={relatedVlog.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex gap-3 cursor-pointer group"
                                        onClick={() => onVlogClick(relatedVlog)}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={relatedVlog.thumbnail}
                                                alt={relatedVlog.title}
                                                className="w-24 h-16 object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                                                {relatedVlog.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">{relatedVlog.channel}</p>
                                            <p className="text-xs text-gray-500">{formatViews(relatedVlog.views)} views</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// VlogList Component
interface VlogListProps {
    vlogs: Vlog[];
    onVlogClick: (vlog: Vlog) => void;
    likedVlogs: Set<string>;
    savedVlogs: Set<string>;
    onLike: (vlogId: string) => void;
    onSave: (vlogId: string) => void;
}

const VlogList: React.FC<VlogListProps> = ({
    vlogs,
    onVlogClick,
    likedVlogs,
    savedVlogs,
    onLike,
    onSave
}) => {
    if (vlogs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No vlogs found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vlogs.map((vlog) => (
                <VlogCard
                    key={vlog.id}
                    vlog={vlog}
                    onVlogClick={onVlogClick}
                    isLiked={likedVlogs.has(vlog.id)}
                    isSaved={savedVlogs.has(vlog.id)}
                    onLike={onLike}
                    onSave={onSave}
                />
            ))}
        </div>
    );
};

// Main VlogPage Component
const VlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedVlog, setSelectedVlog] = useState<Vlog | null>(null);
    const [likedVlogs, setLikedVlogs] = useState<Set<string>>(new Set());
    const [savedVlogs, setSavedVlogs] = useState<Set<string>>(new Set());

    const filteredVlogs = useMemo(() => {
        let filtered = vlogData;

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(vlog => vlog.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(vlog =>
                vlog.title.toLowerCase().includes(term) ||
                vlog.channel.toLowerCase().includes(term) ||
                vlog.tags.some(tag => tag.toLowerCase().includes(term)) ||
                vlog.description.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [searchTerm, selectedCategory]);

    const relatedVlogs = useMemo(() => {
        if (!selectedVlog) return [];
        return vlogData
            .filter(vlog =>
                vlog.id !== selectedVlog.id &&
                (vlog.category === selectedVlog.category ||
                    vlog.tags.some(tag => selectedVlog.tags.includes(tag)))
            )
            .slice(0, 5);
    }, [selectedVlog]);

    const handleVlogClick = (vlog: Vlog) => {
        setSelectedVlog(vlog);
    };

    const handleCloseDetail = () => {
        setSelectedVlog(null);
    };

    const handleLike = (vlogId: string) => {
        setLikedVlogs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(vlogId)) {
                newSet.delete(vlogId);
            } else {
                newSet.add(vlogId);
            }
            return newSet;
        });
    };

    const handleSave = (vlogId: string) => {
        setSavedVlogs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(vlogId)) {
                newSet.delete(vlogId);
            } else {
                newSet.add(vlogId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Umukamezi Vlogs</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the latest Umukamezi vlogs, tutorials, and insights from top creators.
                            Stay updated with trending topics and learn from industry experts.
                        </p>
                    </div>

                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <VlogList
                    vlogs={filteredVlogs}
                    onVlogClick={handleVlogClick}
                    likedVlogs={likedVlogs}
                    savedVlogs={savedVlogs}
                    onLike={handleLike}
                    onSave={handleSave}
                />
            </div>

            {/* Vlog Detail Modal */}
            <AnimatePresence>
                {selectedVlog && (
                    <VlogDetail
                        vlog={selectedVlog}
                        relatedVlogs={relatedVlogs}
                        onClose={handleCloseDetail}
                        onVlogClick={handleVlogClick}
                        isLiked={likedVlogs.has(selectedVlog.id)}
                        isSaved={savedVlogs.has(selectedVlog.id)}
                        onLike={handleLike}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
};

export default VlogPage;