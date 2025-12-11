import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../types/Product/producttypeAdmin';
import { productApi } from '../../app/products/allProductgeter';
import Navbar from '../../components/SharedComp/navabaritems/NavBar';
import Hero from '../../components/HomePage/Header/Hero/Hero';
import CategorySection from '../../components/HomePage/body/categories';
import Offers from '../../components/HomePage/body/Offers/OurOffers';
import Footer from '../../components/SharedComp/footer';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [topPicks, setTopPicks] = useState<Product[]>([]);

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [latestLoading, setLatestLoading] = useState(true);
  const [topPicksLoading, setTopPicksLoading] = useState(true);


  const [error, setError] = useState<string | null>(null);

  // Load featured products (is_featured = true)
  const loadFeaturedProducts = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      const params = {
        is_featured: 'true',
        limit: '100',
        sort_by: 'created_at',
        sort_order: 'desc'
      };
      const response = await productApi.getProducts(0, 100, params);
      const products = response.products || response || [];
      setFeaturedProducts(products.filter((data:any)=> data.is_active));
    } catch (err: any) {
      console.error('Error loading featured products:', err);
      setError(err.message || "Failed to fetch featured products");
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  // Load latest products (newest first)
  const loadLatestProducts = useCallback(async () => {
    try {
      setLatestLoading(true);
      const params = {
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: '100'
      };
      const response = await productApi.getProducts(0, 100, params);
      const products = response.products || response || [];
      setLatestProducts(products.filter((data:any)=> data.is_active));
    } catch (err: any) {
      console.error('Error loading latest products:', err);
      setError(err.message || "Failed to fetch latest products");
    } finally {
      setLatestLoading(false);
    }
  }, []);

  // Load top picks (highest rated or most popular)
  const loadTopPicks = useCallback(async () => {
    try {
      setTopPicksLoading(true);
      const params = {
        sort_by: 'rating',
        sort_order: 'desc',
        rating_min: '4',
        limit: '80'
      };
      const response = await productApi.getProducts(0, 80, params);
      const products = response.products || response || [];
      setTopPicks(products.filter((data:any)=> data.is_active));
    } catch (err: any) {
      console.error('Error loading top picks:', err);
      setError(err.message || "Failed to fetch top picks");
    } finally {
      setTopPicksLoading(false);
    }
  }, []);



  // Load all product sections
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        await Promise.all([
          loadFeaturedProducts(),
          loadLatestProducts(),
          loadTopPicks()
        ]);
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError(err.message || "Failed to fetch products");
      }
    };

    loadAllProducts();
  }, [loadFeaturedProducts, loadLatestProducts, loadTopPicks]);

  // Check if any products are still loading
  const isLoading = featuredLoading || latestLoading || topPicksLoading;
  console.log("latest", latestProducts.length);
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <CategorySection />

        {isLoading && featuredProducts.length === 0 && latestProducts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Error: {error}
          </div>
        ) : (
          <>
            {/* Featured Products Section */}
            {featuredProducts.filter((data:any)=> data.is_active).length > 0 && (
              <Offers
                initialDisplayCount={12}
                bg="bg-white"
                title="Featured Products"
                subtitle="Our handpicked selection of premium items just for you"
                showLoadMore={false}
                products={featuredProducts}
              // isLoading={featuredLoading}
              />
            )}

            {/* Top Picks Section */}
            {topPicks.filter((data:any)=> data.is_active).length > 0 && (
              <Offers
                initialDisplayCount={12}
                bg="bg-gray-100"
                title="Top Picks"
                subtitle="Our customers' top picks just for you"
                showLoadMore={false}
                products={topPicks}
              // isLoading={topPicksLoading}
              />
            )}

            {/* Latest Products Section */}
            {latestProducts.filter((data:any)=> data.is_active).length > 0 && (
              <Offers
                initialDisplayCount={ 12}
                bg="bg-slate-100"
                onLoadMore={() => {}}
                title="Latest Products"
                subtitle="Don't miss out on our newest arrivals"
                showLoadMore={true}
                products={latestProducts}
              // isLoading={latestLoading}
              />
            )}


            {/* Fallback if no specific categories have products but general products exist */}
            
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default HomePage;