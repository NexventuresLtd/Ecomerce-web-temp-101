import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search,  } from 'lucide-react';
import { productsData as products } from '../../../constants/ProductsData/ProductData';
import type { Product } from '../../../types/Product/ProductType';


// Fuzzy Search Hook
export const useSearchProducts = (query: string) => {
    const [results, setResults] = useState<Product[]>([]);
    const [suggestion, setSuggestion] = useState<string>('');

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSuggestion('');
            return;
        }

        const searchQuery = query.toLowerCase().trim();
        const searchTerms = searchQuery.split(/\s+/);

        // Create searchable text for each product
        const searchableProducts = products.map(product => ({
            ...product,
            searchableText: `${product.title} ${product.brand} ${product.category} ${product.tags.join(' ')} ${product.features.join(' ')}`.toLowerCase()
        }));

        // Scoring function
        const scoreProduct = (product: typeof searchableProducts[0]) => {
            let score = 0;
            const { title, brand, category, tags, searchableText } = product;
            const titleLower = title.toLowerCase();
            const brandLower = brand.toLowerCase();
            const categoryLower = category.toLowerCase();

            // Exact matches (highest priority)
            if (titleLower === searchQuery) score += 100;
            if (brandLower === searchQuery) score += 90;
            if (categoryLower === searchQuery) score += 80;

            // Multi-term exact matches
            const allTermsInTitle = searchTerms.every(term => titleLower.includes(term));
            if (allTermsInTitle && searchTerms.length > 1) score += 95;

            // Prefix matches
            if (titleLower.startsWith(searchQuery)) score += 85;
            if (brandLower.startsWith(searchQuery)) score += 75;

            // Word boundary matches
            searchTerms.forEach(term => {
                const wordBoundaryRegex = new RegExp(`\\b${term}`, 'i');
                if (wordBoundaryRegex.test(titleLower)) score += 70;
                if (wordBoundaryRegex.test(brandLower)) score += 60;
                if (tags.some(tag => tag.toLowerCase().includes(term))) score += 50;
            });

            // Fuzzy matches with edit distance
            searchTerms.forEach(term => {
                if (searchableText.includes(term)) {
                    score += 40;
                } else {
                    // Simple fuzzy matching for typos
                    const fuzzyMatches = findFuzzyMatches(term, searchableText);
                    score += fuzzyMatches * 20;
                }
            });

            // Brand priority boost for multi-term queries
            if (searchTerms.length > 1) {
                const brandMatch = searchTerms.find(term => brandLower.includes(term));
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
    }, [products, query]);

    // Generate suggestions for typos
    const generateSuggestions = (query: string, products: Product[]) => {
        const suggestions: { word: string; score: number }[] = [];
        const queryTerms = query.toLowerCase().split(/\s+/);

        products.forEach(product => {
            const allWords = `${product.title} ${product.brand} ${product.category} ${product.tags.join(' ')}`
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

    return { results, suggestion };
};

// Highlight matched text component
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
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, onSelect }) => {
    const { results, suggestion } = useSearchProducts( query);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [query]);

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
        const primaryImage = product.images.find(img => img.isprimary);
        return primaryImage?.image || product.images[0]?.image || '';
    };

    if (!query.trim()) return null;

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
                                className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center space-x-3 ${selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => onSelect(product)}
                            >
                                {/* Product image */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                    {getPrimaryImage(product) ? (
                                        <img
                                            src={getPrimaryImage(product)}
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
                                        <HighlightedText text={`${product.brand} • ${product.category}`} query={query} />
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex-shrink-0 text-right">
                                    <div className="font-semibold text-gray-900">
                                        Rwf {product.price.toFixed(2)}
                                    </div>
                                    {product.originalPrice && (
                                        <div className="text-sm text-gray-500 line-through">
                                            Rwf {product.originalPrice.toFixed(2)}
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
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};


