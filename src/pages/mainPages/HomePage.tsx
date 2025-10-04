import { useState, useEffect, useCallback } from 'react';

import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Hero from '../../components/HomePage/Header/Hero/Hero';
import CategorySection from '../../components/HomePage/body/categories';
import Offers from '../../components/HomePage/body/Offers/OurOffers';
import Footer from '../../components/SharedComp/footer';

const HomePage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 20; // Initial fetch size

  // Load all products with pagination
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts(skip, limit);
      const newProducts = response.products || response;
      setAllProducts(prev => [...prev, ...newProducts]);
      setSkip(prev => prev + limit);
      
      // If we get fewer products than requested, we've reached the end
      if (newProducts.length < limit) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [skip, limit]);

  // Initial data load
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products for different sections
  const featuredProducts = allProducts.filter(product => product.is_active);
  const topPicks = allProducts.filter(product => !product.is_active);
  const latestProducts = allProducts.filter(product => product.is_new);
  const reusedProducts = allProducts.filter(product => !product.is_new);

  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <CategorySection />

        {loading && allProducts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            {featuredProducts.length > 0 &&
              <Offers
                title="Featured Products"
                subtitle="Our handpicked selection of premium items just for you"
                showLoadMore={false}
                products={featuredProducts}
              />}

            {topPicks.length > 0 && <Offers
              title="Top Picks"
              subtitle="Our customers' top picks just for you"
              showLoadMore={false}
              products={topPicks}
            />
            }
            {latestProducts.length > 0 && <Offers
              title="Latest Products"
              subtitle="Don't miss out on our newest arrivals"
              showLoadMore={true}
              products={latestProducts}
              initialDisplayCount={12}
              hasMore={hasMore && latestProducts.length > 12}
              onLoadMore={loadProducts}
              isLoadingMore={loading}
            />}
            {reusedProducts.length > 0 && <Offers
              title="Re used Products"
              subtitle="Grab these deals before they're gone"
              showLoadMore={true}
              initialDisplayCount={24}
              products={reusedProducts}
              hasMore={hasMore && reusedProducts.length > 24}
              onLoadMore={loadProducts}
              isLoadingMore={loading}
            />
            }
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default HomePage;