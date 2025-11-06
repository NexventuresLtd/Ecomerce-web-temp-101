import { useCallback, useEffect, useState } from 'react'
import Offers from '../../components/HomePage/body/Offers/OurOffers'
import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';

const Suggestions = ({ category }: any) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const limit = 20; // Initial fetch size

    // Load all products with pagination
    const loadProducts = useCallback(async () => {
        try {
            const params: Record<string, any> = {};
            if (category) {
                params.product_category_id = category;
            }
            const response = await productApi.getProducts(skip, limit, params);
            const newProducts = response.products || response;
            setAllProducts(prev => [...prev, ...newProducts]);
            setSkip(prev => prev + limit);

            // If we get fewer products than requested, we've reached the end
            if (newProducts.length < limit) {
                setHasMore(false);
            }
        } catch (err: any) {
            console.log(err);
            // setError(err.message || "Failed to fetch products");
        } finally {

        }
    }, [skip, limit]);

    // Initial data load
    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <>
            <Offers
                showLoadMore={true}
                initialDisplayCount={12}
                products={allProducts.filter(product => product.is_active)}
                hasMore={hasMore && allProducts.filter(product => product.is_active).length > 12}
                onLoadMore={loadProducts}
                isLoadingMore={loading}
            />
        </>
    )
}

export default Suggestions
