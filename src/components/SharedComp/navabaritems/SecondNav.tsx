import { Database, Search, User, X } from 'lucide-react';
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
        }
    };

    // Handle Enter key press in search input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
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

                        {/* Search Bar */}
                        <div className={`${isMenuOpen ? 'max-xl:hidden' : ''} flex-1 max-w-4xl mx-4`}>
                            <div className="flex gap-2">
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

                            {/* Database Search Toggle Button */}
                            <div className="mt-2 flex justify-end">
                                <button
                                    onClick={() => setUseDatabaseSearch(!useDatabaseSearch)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
                                        useDatabaseSearch
                                            ? 'bg-secondary text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                    title={useDatabaseSearch ? 'Searching from database' : 'Search from database'}
                                >
                                    <Database className="w-4 h-4" />
                                    Database Search
                                </button>
                            </div>
                        </div>

                        {/* User Account */}
                        <UserInfo showMenu={true} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />
                    </div>
                </div>
            </div>
            <div className="max-w-11/12 mx-auto">
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