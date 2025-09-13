import { useState, useEffect } from 'react';
import { categoryApi } from '../../app/dashcategory/category';

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

export const GenerateDropdownContent = ({ itemName }: { itemName: string }) => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getFullHierarchy()
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching categories');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-sm mb-2">Error loading categories</div>
        <div className="text-gray-500 text-xs">{error}</div>
      </div>
    );
  }

  // Find the main category that matches the itemName
  const currentCategory = categories.find(cat =>
    cat.name.toLowerCase() === itemName.toLowerCase()
  );

  if (currentCategory) {
    return (
      <div className="p-6">
        {/* Main sub-categories grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-6 pb-6 border-b">
          {currentCategory.sub_categories.map((subCategory) => (
            <a
              key={subCategory.id}
              href={`/category/${currentCategory.slug}/${subCategory.slug}`}
              className="flex flex-col items-center text-center group hover:text-blue-600 transition-colors"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {subCategory.image ? (
                  <img
                    src={subCategory.image}
                    alt={subCategory.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <span className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                    📷
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{subCategory.name}</span>
            </a>
          ))}
        </div>

        {/* Promotional banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏷️</div>
            <div>
              <h3 className="font-bold text-blue-800">Shop Specials</h3>
              <p className="text-sm text-blue-600">In {currentCategory.name}</p>
            </div>
          </div>
        </div>

        {/* Product categories list */}
        <div>
          <h3 className="font-bold text-lg mb-4">Also in {currentCategory.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
            {currentCategory.sub_categories.flatMap(subCat =>
              subCat.product_categories.map(productCat => (
                <a
                  key={productCat.id}
                  href={`/category/${currentCategory.slug}/${subCat.slug}/${productCat.slug}`}
                  className="text-gray-700 hover:text-blue-600 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                >
                  {productCat.name}
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for categories not found in API
  return (
    <div className="p-6">
      <h3 className="font-bold text-lg mb-4">{itemName} Categories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href="#"
            className="text-gray-700 hover:text-blue-600 py-1 text-sm"
          >
            {itemName} Subcategory {i + 1}
          </a>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Featured in {itemName}</h4>
        <p className="text-sm text-gray-600">Explore our top products in this category</p>
      </div>
    </div>
  );
};