import { proVideoCategories, proVideoSubCategories } from "../../constants/NabarMain/navLinks";

  export const generateDropdownContent = (itemName: string) => {
    if (itemName === 'Pro Video') {
      return (
        <div className="p-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-6 pb-6 ">
            {proVideoCategories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="flex flex-col items-center text-center group hover:text-blue-600"
              >
                <div className="text-4xl mb-2">{category.image}</div>
                <span className="text-sm font-medium">{category.name}</span>
              </a>
            ))}
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🏷️</div>
              <div>
                <h3 className="font-bold text-blue-800">Shop Specials</h3>
                <p className="text-sm text-blue-600">In Pro Video</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Also in Professional Video</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
              {proVideoSubCategories.map((subcategory, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-700 hover:text-blue-600 py-1"
                >
                  {subcategory}
                </a>
              ))}
            </div>
          </div>
        </div>
      );
    }

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
