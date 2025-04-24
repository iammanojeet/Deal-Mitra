import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage2 = () => {
  const [search, setSearch] = useState("Samsung Galaxy F14 5G");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("none"); // Sorting state
  const [filterSource, setFilterSource] = useState("both"); // Filtering state
  const navigate = useNavigate();

  const amazonUrl = `https://www.amazon.in/s?k=${search.replace(/ /g, "+")}`;
  const flipkartUrl = `https://www.flipkart.com/search?q=${search.replace(
    / /g,
    "+"
  )}`;
  const zeptoUrl = `https://www.zeptonow.com/search?query=${search.replace(
    / /g,
    "+"
  )}`;
  const instamartUrl = `https://www.swiggy.com/instamart/search?custom_back=true&query=${search.replace(
    / /g,
    "+"
  )}`;
  const bigbasketUrl = `https://www.bigbasket.com/ps/?q=${search.replace(
    / /g,
    "+"
  )}`;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleScrape = async () => {
    setIsLoading(true);
    setError("");
    setProducts([]); // Clear previous products
    let errorMessages = [];

    try {
      // Run both scrapers concurrently
      const [
        amazonResponse,
        flipkartResponse,
        zeptoResponse,
        instamartResponse,
        bigbasketResponse,
      ] = await Promise.all([
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
        fetch(
          `http://localhost:3001/scrape-zepto?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `Zepto scraping failed: ${e.message}` })),
        fetch(
          `http://localhost:3001/scrape-instamart?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({
            error: `Instamart scraping failed: ${e.message}`,
          })),
        fetch(
          `http://localhost:3001/scrape-bigbasket?search=${search.replace(
            / /g,
            "+"
          )}`
        )
          .then((res) => res.json())
          .catch((e) => ({ error: `BigBasket scraping failed: ${e.message}` })),
      ]);

      // Process Amazon results (limit to 5)
      let amazonProducts = [];
      if (amazonResponse.error) {
        errorMessages.push(amazonResponse.error);
      } else {
        amazonProducts = amazonResponse
          .slice(0, 5) // Limit to first 5 products
          .map((product) => ({
            ...product,
            source: "amazon",
          }));
      }

      // Process Flipkart results (limit to 5)
      let flipkartProducts = [];
      if (flipkartResponse.error) {
        errorMessages.push(flipkartResponse.error);
      } else {
        flipkartProducts = flipkartResponse
          .slice(0, 5) // Limit to first 5 products
          .map((product) => ({
            ...product,
            source: "flipkart",
          }));
      }

      // Process Zepto results (limit to 5)
      let zeptoProducts = [];
      if (zeptoResponse.error) {
        errorMessages.push(zeptoResponse.error);
      } else {
        zeptoProducts = zeptoResponse
          .slice(0, 5) // Limit to first 5 products
          .map((product) => ({
            ...product,
            source: "zepto",
          }));
      }

      // Process Instamart results (limit to 5)
      let instamartProducts = [];
      if (instamartResponse.error) {
        errorMessages.push(instamartResponse.error);
      } else {
        instamartProducts = instamartResponse
          .slice(0, 5) // Limit to first 5 products
          .map((product) => ({
            ...product,
            source: "instamart",
          }));
      }

      // Process BigBasket results (limit to 5)
      let bigbasketProducts = [];
      if (bigbasketResponse.error) {
        errorMessages.push(bigbasketResponse.error);
      } else {
        bigbasketProducts = bigbasketResponse
          .slice(0, 5) // Limit to first 5 products
          .map((product) => ({
            ...product,
            source: "bigbasket",
          }));
      }

      // Combine products
      const combinedProducts = [
        ...amazonProducts,
        ...flipkartProducts,
        ...zeptoProducts,
        ...instamartProducts,
        ...bigbasketProducts,
      ];
      setProducts(combinedProducts);

      // Set success or error message
      if (combinedProducts.length > 0) {
        setError("Scraping completed successfully!");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      } else {
        setError("No products found from either platform.");
      }

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError(`Error scraping data: ${err.message}`);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (url) => {
    window.open(url, "_blank");
  };

  // Sorting logic
  const sortProducts = (products) => {
    if (sortBy === "price-low-high") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-high-low") {
      return [...products].sort((a, b) => b.rating - a.rating);
    }
    return products; // Default: no sorting
  };

  // Filtering logic
  const filterProducts = (products) => {
    if (filterSource === "amazon") {
      return products.filter((product) => product.source === "amazon");
    } else if (filterSource === "flipkart") {
      return products.filter((product) => product.source === "flipkart");
    } else if (filterSource === "zepto") {
      return products.filter((product) => product.source === "zepto");
    } else if (filterSource === "instamart") {
      return products.filter((product) => product.source === "instamart");
    } else if (filterSource === "bigbasket") {
      return products.filter((product) => product.source === "bigbasket");
    }
    return products; // Default: show all products
  };

  // Apply sorting and filtering
  const displayedProducts = sortProducts(filterProducts(products));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Page</h1>
        {error && (
          <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
        )}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter search term (e.g., Samsung Galaxy F14 5G)"
          />
          <div className="mt-2 flex space-x-4">
            <button
              onClick={handleScrape}
              disabled={isLoading || !search.trim()}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Scraping..." : "Search"}
            </button>
            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">Sort By: None</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating-high-low">Rating: High to Low</option>
            </select>
            {/* Filtering Dropdown */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">Source: Both</option>
              <option value="amazon">Source: Amazon</option>
              <option value="flipkart">Source: Flipkart</option>
              <option value="zepto">Source: Zepto</option>
              <option value="instamart">Source: Instamart</option>
              <option value="bigbasket">Source: BigBasket</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">Amazon URL: {amazonUrl}</p>
          <button
            onClick={() => handleNavigate(amazonUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Amazon
          </button>
          <p className="text-gray-600 mt-4">Flipkart URL: {flipkartUrl}</p>
          <button
            onClick={() => handleNavigate(flipkartUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Flipkart
          </button>
          <p className="text-gray-600 mt-4">Zepto URL: {zeptoUrl}</p>
          <button
            onClick={() => handleNavigate(zeptoUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Zepto
          </button>
          <p className="text-gray-600 mt-4">Instamart URL: {instamartUrl}</p>
          <button
            onClick={() => handleNavigate(instamartUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit Instamart
          </button>
          <p className="text-gray-600 mt-4">BigBasket URL: {bigbasketUrl}</p>
          <button
            onClick={() => handleNavigate(bigbasketUrl)}
            className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Visit BigBasket
          </button>
        </div>
        {displayedProducts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Scraped Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedProducts.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-2"
                  />
                  <h4 className="text-md font-semibold text-gray-800">
                    {product.name}
                  </h4>
                  <p className="text-gray-600">
                    Price: ₹{product.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600">Rating: {product.rating} ★</p>
                  <p className="text-gray-600">
                    Reviews:{" "}
                    {product.reviews ? product.reviews.toLocaleString() : "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Source:{" "}
                    {product.source.charAt(0).toUpperCase() +
                      product.source.slice(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage2;
