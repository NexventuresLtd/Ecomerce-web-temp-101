import { useState, useEffect } from 'react';
import { categoryApi } from '../../app/dashcategory/category';
import { useNavigation } from '../../hooks/product/useNavigation';

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  sub_category_id: number;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  main_category_id: number;
  product_categories: ProductCategory[];
}

interface MainCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  sub_categories: SubCategory[];
}

const CACHE_KEY = "categories_cache_hierarchy";

export const GenerateDropdownContent = ({ itemName }: { itemName: string }) => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigateToProductCategory } = useNavigation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // 1️⃣ Load from cache immediately if exists
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setCategories(parsed);
            setLoading(false); // show UI quickly
          } catch {
            console.warn("Invalid cache format");
          }
        }

        // 2️⃣ Always fetch new data in background
        const response = await categoryApi.getFullHierarchy();
        if (response) {
          setCategories(response);
          localStorage.setItem(CACHE_KEY, JSON.stringify(response));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred while fetching categories"
        );
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    // only show skeleton if no cached data
    return (
      <div className="p-8 min-w-[800px]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 bg-gray-100 rounded w-4/5"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="p-8 min-w-[800px]">
        <div className="text-red-600 text-sm mb-2 font-medium">Error loading categories</div>
        <div className="text-gray-500 text-xs">{error}</div>
      </div>
    );
  }

  const currentCategory = categories.find(
    (cat) => cat.name.toLowerCase() === itemName.toLowerCase()
  );

  if (currentCategory) {
    return (
      <div className="p-8 min-w-[800px] bg-white border border-gray-100 shadow-lg rounded-lg">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-2xl hidden font-light text-gray-900 tracking-tight">
            {currentCategory.name}as
          </h2>
          {currentCategory.description && (
            <p className="text-gray-600 text-sm mt-2 max-w-2xl">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-4 2xl:grid-cols-5 gap-8">
          {currentCategory.sub_categories.map((subCategory) => (
            <div key={subCategory.id} className="space-y-4">
              {/* Sub Category Header */}
              <div className="pb-2 border-b border-gray-50">
                <a
                  href={`/category/${currentCategory.slug}/${subCategory.slug}`}
                  className="group block"
                >
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
                    {subCategory.name}
                  </h3>
                  {subCategory.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {subCategory.description}
                    </p>
                  )}
                </a>
              </div>

              {/* Product Categories List */}
              <div className="space-y-2">
                {subCategory.product_categories.map((productCat) => (
                  <a
                    key={productCat.id}
                    onClick={() => navigateToProductCategory(productCat.name)}
                    className="block text-sm text-gray-700 hover:text-blue-600 py-1 px-1 rounded-md hover:bg-blue-50 transition-all duration-150 cursor-pointer font-normal"
                  >
                    {productCat.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">
                {currentCategory.sub_categories.length} sub-categories •{" "}
                {currentCategory.sub_categories.reduce(
                  (total, sub) => total + sub.product_categories.length,
                  0
                )}{" "}
                product categories
              </span>
            </div>
            <a
              href={`/products`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              View all {currentCategory.name} products →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-8 min-w-[800px] bg-white border border-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-light text-gray-900 mb-6">{itemName} Categories</h2>
      <div className="grid grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <div key={colIndex} className="space-y-4">
            <div className="pb-2 border-b border-gray-50">
              <h3 className="font-semibold text-gray-900 text-lg">
                {itemName} Group {colIndex + 1}
              </h3>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, itemIndex) => (
                <a
                  key={itemIndex}
                  href="#"
                  className="block text-sm text-gray-700 hover:text-blue-600 py-1 transition-colors duration-150"
                >
                  {itemName} Item {itemIndex + 1}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
