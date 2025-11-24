import { Search, User, X } from 'lucide-react';
import UserInfo from './UserInfo';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchResults } from './search';
import { useNavigation } from '../../../hooks/product/useNavigation';
import type { Product } from '../../../types/Product/producttypeAdmin';
import { productApi } from '../../../app/products/allProductgeter';

interface SecondNavProps {
    isMenuOpen: boolean
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>
}

export default function SecondNav({ isMenuOpen, setIsMenuOpen, setActiveDropdown }: SecondNavProps) {
    const [query, setQuery] = useState('');
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [useDatabaseSearch, setUseDatabaseSearch] = useState<boolean>(false);
    const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
    const navigate = useNavigate();
    console.log(error)
    const { navigateToProduct } = useNavigation();

    // Load products from API
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await productApi.getProducts(0, 200);
                const products: Product[] = response.products || response;
                setAllProducts(products);
            } catch (err: any) {
                setError(err.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleProductSelect = (product: Product) => {
        setQuery(product.title);
        setActiveDropdown(null);
        setShowMobileSearch(false);
        navigateToProduct(product.id.toString());
    };

    const clearSearch = () => {
        setQuery('');
    };

    const handleDatabaseToggle = (useDatabase: boolean) => {
        setUseDatabaseSearch(useDatabase);
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/products/search/${encodeURIComponent(query.trim())}`);
            setActiveDropdown(null);
            setIsMenuOpen(false);
            setShowMobileSearch(false);
        }
    };

    // Handle Enter key press in search input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const openMobileSearch = () => {
        setShowMobileSearch(true);
        setActiveDropdown(null);
        setIsMenuOpen(false);
    };

    const closeMobileSearch = () => {
        setShowMobileSearch(false);
        setQuery('');
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200" onMouseEnter={() => setActiveDropdown(null)}>
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-2">
                    <div className="flex justify-between items-center h-22">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = "/"}>
                            <div className="px-4 py-3">
                                <div className="text-transparent uppercase bg-clip-text bg-black font-extrabold text-3xl leading-tight h-22 w-22 overflow-hidden">
                                    <img src="/Umukamezilogo.jpg" className='w-full h-full object- scale-120' alt="" />
                                </div>
                            </div>
                        </div>

                        {/* Expert Contact */}
                        <div className="hidden xl:flex items-center space-x-3 text-sm">
                            <User className="w-5 h-5 text-gray-600" />
                            <div className='text-xs'>
                                <div className="text-gray-600">Ask Our Experts</div>
                                <div className="font-semibold">250781691713</div>
                            </div>
                        </div>

                        {/* Desktop Search Bar - Hidden on mobile */}
                        <div className={`${isMenuOpen ? 'max-xl:hidden' : ''} hidden md:flex flex-1 max-w-4xl mx-4`}>
                            <div className="flex gap-2 w-full">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Search for products..."
                                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                                    />
                                    {query && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Separate Search Button */}
                                <button
                                    onClick={handleSearch}
                                    disabled={!query.trim()}
                                    className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                        query.trim()
                                            ? 'bg-third cursor-pointer text-white hover:bg-third/90'
                                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    }`}
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Icon - Visible only on mobile */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={openMobileSearch}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                <Search className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Account */}
                        <UserInfo showMenu={true} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />
                    </div>
                </div>
            </div>

            {/* Mobile Search Popup */}
            {showMobileSearch && (
                <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col">
                    {/* Search Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <div className="relative flex-1 mr-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={closeMobileSearch}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search Button */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <button
                            onClick={handleSearch}
                            disabled={!query.trim()}
                            className={`w-full px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                query.trim()
                                    ? 'bg-third cursor-pointer text-white hover:bg-third/90'
                                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                            }`}
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Search
                        </button>
                    </div>

                    {/* Search Results in Mobile Popup - Scrollable area */}
                    <div className="flex-1 overflow-y-auto bg-black/70">
                        <div className="relative">
                            {/* Search Results Dropdown - Show suggestions exactly like desktop */}
                            {!loading && query.trim() && (
                                <SearchResults
                                    query={query}
                                    products={allProducts}
                                    onSelect={handleProductSelect}
                                    isLoading={loading}
                                    useDatabase={useDatabaseSearch}
                                    onDatabaseToggle={handleDatabaseToggle}
                                />
                            )}
                            {loading && query.trim() && (
                                <div className="p-4 text-center text-gray-500">
                                    Loading suggestions...
                                </div>
                            )}
                            {!query.trim() && (
                                <div className="p-4 text-center text-gray-500">
                                    Type to search for products...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Search Results */}
            <div className="max-w-11/12 mx-auto hidden md:block">
                <div className="relative">
                    {/* Search Results Dropdown - Always render when we have products and query */}
                    {!loading && query.trim() && (
                        <SearchResults
                            query={query}
                            products={allProducts}
                            onSelect={handleProductSelect}
                            isLoading={loading}
                            useDatabase={useDatabaseSearch}
                            onDatabaseToggle={handleDatabaseToggle}
                        />
                    )}
                </div>
            </div>
        </>
    )
}