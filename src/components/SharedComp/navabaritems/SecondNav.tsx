import { Search, User, X } from 'lucide-react';
import UserInfo from './UserInfo';
import { useState, useEffect } from 'react';

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
    console.log(error)
    const { navigateToProduct } = useNavigation();

    // Load products from API
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await productApi.getProducts(0, 100); // Load first 100 products for search
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

    return (
        <>
            <div className="bg-white border-b border-gray-200" onMouseEnter={() => setActiveDropdown(null)}>
                <div className="max-w-full md:max-w-11/12 mx-auto px-4 sm:px-6 lg:px-2">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = "/"}>
                            <div className="px-4 py-3">
                                <div className="text-transparent uppercase bg-clip-text bg-black font-extrabold text-3xl leading-tight h-14 w-22 overflow-hidden">
                                 <img src="/Umukamezilogo.jpg" className='w-full h-full object-cover scale-150' alt=""  />   
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
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
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
                        </div>

                        {/* User Account */}
                        <UserInfo showMenu={true} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setActiveDropdown={setActiveDropdown} />
                    </div>
                </div>
            </div>
            <div className="max-w-11/12 mx-auto">
                <div className="relative">
                    {/* Search Results Dropdown */}
                    {!loading && (
                        <SearchResults
                            query={query}
                            products={allProducts}
                            onSelect={handleProductSelect}
                            isLoading={loading}
                        />
                    )}
                </div>
            </div>
        </>
    )
}