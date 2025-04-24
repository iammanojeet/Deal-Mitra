import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaUserCircle } from "react-icons/fa";

// Predefined filters (same as SearchPage)
const filters = [
  "Bags",
  "Shoes",
  "Jackets",
  "Electronics",
  "Books",
  "Clothing",
  "Home & Kitchen",
  "Beauty",
  "Toys",
  "Groceries",
];

const colors = [
  "Blue",
  "Red",
  "Brown",
  "Pink",
  "Silver",
  "Purple",
  "Yellow",
  "Orange",
  "Black",
  "Gray",
  "White",
  "Green",
];

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortByRating, setSortByRating] = useState("");
  const navigate = useNavigate();

  // URLs for Amazon and Flipkart
  const amazonUrl = `https://www.amazon.in/s?k=${search.replace(/ /g, "+")}`;
  const flipkartUrl = `https://www.flipkart.com/search?q=${search.replace(
    / /g,
    "+"
  )}`;

  // Handlers for filters and sorting (from SearchPage)
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleColorChange = (e) => {
    const color = e.target.id;
    setSelectedColor((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setSortByRating(e.target.value);
  };

  const handleDashboard = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  // Scrape handler (from SearchPage2)
  const handleScrape = async () => {
    setIsLoading(true);
    setError("");
    setProducts([]);
    let errorMessages = [];

    try {
      const [amazonResponse, flipkartResponse] = await Promise.all([
        fetch(
          `http://localhost:3001/scrape-amazon?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Amazon scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-flipkart?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({
            error: `Flipkart scraping failed: ${e.message}`,
          })),
      ]);

      let amazonProducts = [];
      if (amazonResponse.error) {
        errorMessages.push(amazonResponse.error);
      } else {
        amazonProducts = amazonResponse.map((product, index) => ({
          id: `amazon-${index}`,
          name: product.name,
          price: `₹${product.price.toLocaleString()}`,
          rating: parseFloat(product.rating) || 0,
          image: product.image_url,
          reviews: product.reviews,
          source: "amazon",
          category: inferCategory(product.name), // Optional: infer category
          color: inferColor(product.name), // Optional: infer color
        }));
      }

      let flipkartProducts = [];
      if (flipkartResponse.error) {
        errorMessages.push(flipkartResponse.error);
      } else {
        flipkartProducts = flipkartResponse.map((product, index) => ({
          id: `flipkart-${index}`,
          name: product.name,
          price: `₹${product.price.toLocaleString()}`,
          rating: parseFloat(product.rating) || 0,
          image: product.image_url,
          reviews: product.reviews,
          source: "flipkart",
          category: inferCategory(product.name), // Optional: infer category
          color: inferColor(product.name), // Optional: infer color
        }));
      }

      const combinedProducts = [...amazonProducts, ...flipkartProducts];
      setProducts(combinedProducts);

      if (combinedProducts.length > 0) {
        setError("Scraping completed successfully!");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      } else {
        setError("No products found from either platform.");
      }

      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError(`Error scraping data: ${err.message}`);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to infer category and color (optional, can be enhanced)
  const inferCategory = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("phone") || lowerName.includes("mobile"))
      return "Electronics";
    if (lowerName.includes("bag")) return "Bags";
    if (lowerName.includes("shoe")) return "Shoes";
    if (lowerName.includes("jacket")) return "Jackets";
    return "Electronics"; // Default
  };

  const inferColor = (name) => {
    const lowerName = name.toLowerCase();
    for (let color of colors) {
      if (lowerName.includes(color.toLowerCase())) return color;
    }
    return "Black"; // Default
  };

  // Navigation handler (from SearchPage2)
  const handleNavigate = (url) => {
    window.open(url, "_blank");
  };

  // Filtering logic (from SearchPage, adapted for scraped data)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedFilter
      ? product.category === selectedFilter
      : true;
    const matchesColor =
      selectedColor.length > 0 ? selectedColor.includes(product.color) : true;
    return matchesSearch && matchesCategory && matchesColor;
  });

  // Sorting logic (from SearchPage)
  let sortedProducts = [...filteredProducts];

  if (selectedSort === "price-low-high") {
    sortedProducts.sort(
      (a, b) =>
        parseFloat(a.price.replace("₹", "").replace(/,/g, "")) -
        parseFloat(b.price.replace("₹", "").replace(/,/g, ""))
    );
  } else if (selectedSort === "price-high-low") {
    sortedProducts.sort(
      (a, b) =>
        parseFloat(b.price.replace("₹", "").replace(/,/g, "")) -
        parseFloat(a.price.replace("₹", "").replace(/,/g, ""))
    );
  }

  if (sortByRating === "rating-high-low") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortByRating === "rating-low-high") {
    sortedProducts.sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Top bar with title and user icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Page</h1>
        <FaUserCircle
          className="text-3xl text-gray-700 cursor-pointer"
          onClick={handleDashboard}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Filters</h2>
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
          >
            <option value="">Select Category</option>
            {filters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>

          <h3 className="font-semibold mb-2">Sort by Rating</h3>
          <select
            value={sortByRating}
            onChange={handleRatingSortChange}
            className="w-full border border-gray-300 rounded px-2 py-2 mb-4"
          >
            <option value="">--</option>
            <option value="rating-high-low">Rating: High to Low</option>
            <option value="rating-low-high">Rating: Low to High</option>
          </select>

          <h3 className="font-semibold mb-2">Color</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {colors.map((color) => (
              <label key={color} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={color}
                  checked={selectedColor.includes(color)}
                  onChange={handleColorChange}
                  className="accent-blue-500"
                />
                <span className="text-sm">{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="flex w-full md:w-1/2 gap-2">
              <input
                type="text"
                placeholder="Search (e.g., Samsung Galaxy F14 5G)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={handleScrape}
                disabled={isLoading || !search.trim()}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Scraping..." : "Search"}
              </button>
            </div>
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="w-full md:w-1/3 border border-gray-300 rounded px-2 py-2"
            >
              <option value="">Sort by</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {/* Navigation Buttons */}
          <div className="mb-6">
            <p className="text-gray-600">
              Amazon URL:{" "}
              <a href={amazonUrl} className="text-blue-500">
                {amazonUrl}
              </a>
            </p>
            <button
              onClick={() => handleNavigate(amazonUrl)}
              className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Visit Amazon
            </button>
            <p className="text-gray-600 mt-4">
              Flipkart URL:{" "}
              <a href={flipkartUrl} className="text-blue-500">
                {flipkartUrl}
              </a>
            </p>
            <button
              onClick={() => handleNavigate(flipkartUrl)}
              className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Visit Flipkart
            </button>
            <p className="text-gray-600 mt-4">
              Blinkit URL:{" "}
              <a href={blinkitUrl} className="text-blue-500">
                {blinkitUrl}
              </a>
            </p>
            <button
              onClick={() => handleNavigate(blinkitUrl)}
              className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Visit Blinkit
            </button>
          </div>

          {/* Product Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded overflow-hidden shadow bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 sm:h-60 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {product.color} |{" "}
                      {product.source.charAt(0).toUpperCase() +
                        product.source.slice(1)}
                    </p>
                    <p className="text-md font-medium">{product.price}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(product.rating)
                              ? ""
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.rating}) | {product.reviews.toLocaleString()}{" "}
                        reviews
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
