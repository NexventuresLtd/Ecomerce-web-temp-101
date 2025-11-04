import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database } from 'lucide-react';
import type { Product } from '../../../types/Product/producttypeAdmin';
import { RWF } from '../../../app/priceConver';
import mainAxios from '../../../Instance/mainAxios';


// Add this interface for database search response
interface DatabaseSearchResponse {
  query: string;
  corrected_query: string;
  products: Product[];
  suggestions: string[];
  total_results: number;
}

// Fuzzy Search Hook
export const useSearchProducts = (query: string, products: Product[], useDatabase: boolean = false) => {
    const [results, setResults] = useState<Product[]>([]);
    const [suggestion, setSuggestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSuggestion('');
            return;
        }

        const searchProducts = async () => {
            if (useDatabase) {
                // Database search
                setIsLoading(true);
                try {
                    const response = await mainAxios.get<DatabaseSearchResponse>('/search', {
                        params: {
                            query: query.trim(),
                            limit: 600,
                            skip: 0
                        }
                    });
                    
                    setResults(response.data.products.slice(0, 8));
                    setSuggestion(response.data.corrected_query !== query ? response.data.corrected_query : '');
                } catch (error) {
                    console.error('Database search failed:', error);
                    setResults([]);
                    setSuggestion('');
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Local fuzzy search (existing code)
                setIsLoading(false);
                const searchQuery = query.toLowerCase().trim();
                const searchTerms = searchQuery.split(/\s+/);

                // Create searchable text for each product
                const searchableProducts = products.map(product => ({
                    ...product,
                    searchableText: `${product.title} ${product.features || ''} ${product.category?.name || ''} ${product.tags?.join(' ') || ''} ${product.features?.join(' ') || ''}`.toLowerCase()
                }));

                // ... rest of your existing fuzzy search logic ...
                // Scoring function
                const scoreProduct = (product: typeof searchableProducts[0]) => {
                    let score = 0;
                    const titleLower = product.title.toLowerCase();
                    const brandLower = (product.features || []).map(f => f.toLowerCase()); // array
                    const categoryLower = (product.category?.name || '').toLowerCase();
                    const tags = (product.tags || []).map(t => t.toLowerCase());
                    const features = (product.features || []).map(f => f.toLowerCase());

                    // Exact matches (highest priority)
                    if (titleLower === searchQuery) score += 100;
                    if (brandLower.includes(searchQuery)) score += 90;
                    if (categoryLower === searchQuery) score += 80;

                    // Multi-term exact matches
                    const allTermsInTitle = searchTerms.every(term => titleLower.includes(term));
                    if (allTermsInTitle && searchTerms.length > 1) score += 95;

                    // Prefix matches
                    if (titleLower.startsWith(searchQuery)) score += 85;
                    if (brandLower.some(b => b.startsWith(searchQuery))) score += 75;

                    // Word boundary matches
                    searchTerms.forEach(term => {
                        const wordBoundaryRegex = new RegExp(`\\b${term}`, 'i');
                        if (wordBoundaryRegex.test(titleLower)) score += 70;
                        if (brandLower.some(b => wordBoundaryRegex.test(b))) score += 60;
                        if (tags.some(tag => tag.includes(term))) score += 50;
                        if (features.some(feature => feature.includes(term))) score += 40;
                    });

                    // Fuzzy matches with edit distance
                    searchTerms.forEach(term => {
                        if (product.searchableText.includes(term)) {
                            score += 40;
                        } else {
                            // Simple fuzzy matching for typos
                            const fuzzyMatches = findFuzzyMatches(term, product.searchableText);
                            score += fuzzyMatches * 20;
                        }
                    });

                    // Brand priority boost for multi-term queries
                    if (searchTerms.length > 1) {
                        const brandMatch = searchTerms.find(term => brandLower.some(b => b.includes(term)));
                        if (brandMatch) score += 30;
                    }

                    return score;
                };

                // Find fuzzy matches for typo correction
                const findFuzzyMatches = (term: string, text: string): number => {
                    let matches = 0;
                    const words = text.split(/\s+/);

                    words.forEach(word => {
                        if (word.length >= 3 && term.length >= 3) {
                            const distance = levenshteinDistance(term, word);
                            const similarity = 1 - distance / Math.max(term.length, word.length);
                            if (similarity > 0.7) matches += similarity;
                        }
                    });

                    return matches;
                };

                // Levenshtein distance for fuzzy matching
                const levenshteinDistance = (str1: string, str2: string): number => {
                    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

                    for (let i = 0; i <= str1.length; i += 1) matrix[0][i] = i;
                    for (let j = 0; j <= str2.length; j += 1) matrix[j][0] = j;

                    for (let j = 1; j <= str2.length; j += 1) {
                        for (let i = 1; i <= str1.length; i += 1) {
                            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                            matrix[j][i] = Math.min(
                                matrix[j][i - 1] + 1,
                                matrix[j - 1][i] + 1,
                                matrix[j - 1][i - 1] + indicator,
                            );
                        }
                    }

                    return matrix[str2.length][str1.length];
                };

                // Score and sort products
                const scoredProducts = searchableProducts
                    .map(product => ({ ...product, score: scoreProduct(product) }))
                    .filter(product => product.score > 10)
                    .sort((a, b) => b.score - a.score);

                // Generate "Did you mean?" suggestion
                if (scoredProducts.length === 0 || scoredProducts[0].score < 50) {
                    const suggestions = generateSuggestions(searchQuery, searchableProducts);
                    if (suggestions.length > 0) {
                        setSuggestion(suggestions[0]);
                    }
                } else {
                    setSuggestion('');
                }

                setResults(scoredProducts.slice(0, 8));
            }
        };

        searchProducts();
    }, [products, query, useDatabase]);

    // Generate suggestions for typos (existing code)
    const generateSuggestions = (query: string, products: Product[]) => {
        const suggestions: { word: string; score: number }[] = [];
        const queryTerms = query.toLowerCase().split(/\s+/);

        products.forEach(product => {
            const allWords = `${product.title} ${product.features || ''} ${product.category?.name || ''} ${product.tags?.join(' ') || ''}`
                .toLowerCase()
                .split(/\s+/)
                .filter(word => word.length > 2);

            queryTerms.forEach(queryTerm => {
                if (queryTerm.length >= 3) {
                    allWords.forEach(word => {
                        if (word !== queryTerm) {
                            const distance = levenshteinDistance(queryTerm, word);
                            const similarity = 1 - distance / Math.max(queryTerm.length, word.length);

                            if (similarity > 0.6 && similarity < 1) {
                                const existingSuggestion = suggestions.find(s => s.word === word);
                                if (existingSuggestion) {
                                    existingSuggestion.score += similarity;
                                } else {
                                    suggestions.push({ word, score: similarity });
                                }
                            }
                        }
                    });
                }
            });
        });

        return suggestions
            .sort((a, b) => b.score - a.score)
            .slice(0, 1)
            .map(s => query.replace(/\b\w+\b/, s.word));
    };

    const levenshteinDistance = (str1: string, str2: string): number => {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i += 1) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j += 1) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator,
                );
            }
        }

        return matrix[str2.length][str1.length];
    };

    return { results, suggestion, isLoading };
};

// Highlight matched text component (unchanged)
export const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query.trim()) return <span>{text}</span>;

    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;

    queryTerms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-gray-900 px-0.5 rounded">$1</mark>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

// Main Search Results Component
export interface SearchResultsProps {
    query: string;
    products: Product[];
    onSelect: (product: Product) => void;
    isLoading?: boolean;
    useDatabase?: boolean;
    onDatabaseToggle?: (useDatabase: boolean) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
    query, 
    products, 
    onSelect, 
    isLoading = false,
    useDatabase = false,
    onDatabaseToggle 
}) => {
    const { results, suggestion, isLoading: searchLoading } = useSearchProducts(query, products, useDatabase);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [query, useDatabase]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!query || results.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < results.length) {
                        onSelect(results[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    setSelectedIndex(-1);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [query, results, selectedIndex, onSelect]);

    const getPrimaryImage = (product: Product): string => {
        const primaryImage = product.images?.find(img => img.is_primary);
        return primaryImage?.url || product.images?.[0]?.url || '';
    };

    if (!query.trim()) return null;

    const displayLoading = isLoading || searchLoading;

    if (displayLoading) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                    <div className="px-4 py-8 text-center text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>{useDatabase ? 'Searching database...' : 'Loading products...'}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            >
                {/* Search Mode Toggle */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <span className="text-sm text-gray-600">
                        Search mode: 
                        <span className={`font-medium ml-1 ${useDatabase ? 'text-green-600' : 'text-blue-600'}`}>
                            {useDatabase ? 'Database' : 'Local'}
                        </span>
                    </span>
                    <button
                        onClick={() => onDatabaseToggle?.(!useDatabase)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                            useDatabase 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        title={useDatabase ? 'Switch to local search' : 'Switch to database search'}
                    >
                        <Database className="w-3 h-3" />
                        <span>{useDatabase ? 'DB Search' : 'Local Search'}</span>
                    </button>
                </div>

                {/* Did you mean suggestion */}
                {suggestion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-b border-gray-100"
                    >
                        Did you mean <button className="text-blue-600 hover:underline font-medium">{suggestion}</button>?
                    </motion.div>
                )}

                {/* Search results */}
                {results.length > 0 ? (
                    <div className="py-2">
                        {results.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center space-x-3 ${
                                    selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => onSelect(product)}
                            >
                                {/* Product image */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                    {getPrimaryImage(product) ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}${getPrimaryImage(product)}`}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Search className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Product details */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                        <HighlightedText text={product.title} query={query} />
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        <HighlightedText text={`${product.features?.join(', ') || ''} • ${product.category?.name || ''}`} query={query} />
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex-shrink-0 text-right">
                                    <div className="font-semibold text-gray-900">
                                        {RWF.format(product.price ?? 0)}
                                    </div>
                                    {product.original_price && (
                                        <div className="text-sm text-gray-500 line-through">
                                            {RWF.format(product.original_price ?? 0)}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 py-8 text-center text-gray-500"
                    >
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No products found. Try another search.</p>
                        {useDatabase && (
                            <p className="text-sm mt-1">Searching from database</p>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};