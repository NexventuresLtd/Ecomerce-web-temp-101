import { useState, useEffect } from 'react';
import { categoryApi } from '../../app/dashcategory/category';
import { encodeId } from '../../app/products/id_encrypter';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setCategories(parsed);
            setLoading(false);
          } catch {
            console.warn("Invalid cache format");
          }
        }

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

  // Function to create category path for query parameter
  const createCategoryPath = (mainCategory: MainCategory, subCategory?: SubCategory, productCategory?: ProductCategory): string => {
    if (productCategory && subCategory) {
      // Full path: mainId/subId/productId
      return `${encodeId(mainCategory.id)}/${encodeId(subCategory.id)}/${encodeId(productCategory.id)}`;
    } else if (subCategory) {
      // Partial path: mainId/subId
      return `${encodeId(mainCategory.id)}/${encodeId(subCategory.id)}`;
    } else {
      // Main category only
      return encodeId(mainCategory.id);
    }
  };

  // Function to get category name for display
  const getCategoryDisplayName = (mainCategory: MainCategory, subCategory?: SubCategory, productCategory?: ProductCategory): string => {
    if (productCategory) {
      return productCategory.name;
    } else if (subCategory) {
      return subCategory.name;
    } else {
      return mainCategory.name;
    }
  };
  getCategoryDisplayName

  if (loading && categories.length === 0) {
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

  if (error && categories && categories.length === 0) {
    return (
      <div className="p-8 min-w-[800px]">
        <div className="text-red-600 text-sm mb-2 font-medium">Error loading categories</div>
        <div className="text-gray-500 text-xs">{error}</div>
      </div>
    );
  }

  const currentCategory = Array.isArray(categories)
    ? categories.find((cat) => cat.name.toLowerCase() === itemName.toLowerCase())
    : null;

  if (currentCategory) {
    return (
      <div className="p-8 pt-3 min-w-[800px] bg-white border border-gray-100 shadow-lg rounded-lg">
        {/* Header */}
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentCategory.name}
          </h2>
          {currentCategory.description && (
            <p className="text-gray-600 text-sm mt-2 max-w-2xl">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-4 2xl:grid-cols-5 gap-6">
          {currentCategory.sub_categories.map((subCategory) => (
            <div key={subCategory.id} className="space-y-4">
              {/* Sub Category Header */}
              <div className="pb-3 border-b border-gray-100">
                <a
                  href={`#`}
                  data-category-path={createCategoryPath(currentCategory, subCategory)}
                  className="group block cursor-pointer"
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
                {subCategory.product_categories
                  .slice() // avoid mutating original
                  .sort((a, b) => {
                    if (a.name.toLowerCase() === "others") return 1;
                    if (b.name.toLowerCase() === "others") return -1;
                    return 0;
                  })
                  .map((productCat) => (
                    <a
                      key={productCat.id}
                      href="#"
                      data-category-path={createCategoryPath(currentCategory, subCategory, productCat)}
                      className="block text-sm text-gray-700 hover:text-blue-600 py-2 px-2 rounded-md hover:bg-blue-50 transition-all duration-150 cursor-pointer font-normal border-l-2 border-transparent hover:border-blue-500"
                      title={productCat.description || productCat.name}
                    >
                      <div className="flex items-center justify-between">
                        {productCat.name.toLowerCase() === "others" ? (
                          <span className=" text-gray-500">{productCat.name.toLowerCase()}</span>
                        ) : (
                          <span>{productCat.name}</span>
                        )}
                      </div>

                      {productCat.description && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {productCat.description}
                        </p>
                      )}
                    </a>
                  ))}


                {/* If no product categories, show a message */}
                {subCategory.product_categories.length === 0 && (
                  <p className="text-gray-400 text-xs italic py-2">
                    No product categories available
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">
                {currentCategory.sub_categories.length} sub-categories •{' '}
                {currentCategory.sub_categories.reduce(
                  (total, sub) => total + sub.product_categories.length,
                  0
                )}{' '}
                product categories
              </span>
            </div>
            <a
              href={`#`}
              data-category-path={createCategoryPath(currentCategory)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer flex items-center gap-1 group"
            >
              View all {currentCategory.name} products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for when category is not found
  return (
    <div className="p-8 min-w-[800px] bg-white border border-gray-100 shadow-lg rounded-lg">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📁</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {itemName} Categories
        </h2>
        <p className="text-gray-500 text-sm">
          No categories found for "{itemName}".
          <br />
          Please check the category name or try again later.
        </p>
      </div>

      {/* Fallback grid for demonstration */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <div key={colIndex} className="space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <a
                href={`#`}
                data-category-path={encodeId(`${itemName.toLowerCase()}-${colIndex + 1}`)}
                className="group block cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600">
                  {itemName} Group {colIndex + 1}
                </h3>
              </a>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <a
                  key={itemIndex}
                  href={`#`}
                  data-category-path={encodeId(`${itemName.toLowerCase()}-${colIndex + 1}-item-${itemIndex + 1}`)}
                  className="block text-sm text-gray-700 hover:text-blue-600 py-2 px-2 rounded-md hover:bg-blue-50 transition-all duration-150 cursor-pointer"
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