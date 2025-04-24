import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPagev3 = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price-low-high");
  const [filterSource, setFilterSource] = useState("both");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [ratingFilter, setRatingFilter] = useState("all");
  const navigate = useNavigate();

  // Suggested products categorized to match the image layout
  const suggestedProducts = {
    "Appliance for Cool Summer": [
      {
        name: "Air Coolers",
        price: 12990,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/air-cooler/u/5/u/190-200-acgc-dac881-88-crompton-original-imah4vgzbgfgnh4p.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/crompton-88-l-desert-air-cooler-honeycomb-cooling-pad/p/itm295301ffdc909?pid=AICFFVVJFQHHNCN8&lid=LSTAICFFVVJFQHHNCN8VHHYBK&marketplace=FLIPKART&q=air+cooler+for+home&store=j9e%2Fabm%2F52j&srno=s_1_1&otracker=AS_Query_OrganicAutoSuggest_2_8_na_na_na&otracker1=AS_Query_OrganicAutoSuggest_2_8_na_na_na&fm=search-autosuggest&iid=en_xrovLDPafxweZCWoipBk6deYc3DnOsRj6cLnMveBmdpzDt-j6r3IT8BA6PD_9bswuKVHt9gLtOua_VeJu6WLX4QEIsITtCzc4bHaOMTqL08%3D&ppt=sp&ppn=sp&ssid=r3jj4536kg0000001745179807337&qH=19732f755d610b90",
        offer: "Min. 50% Off",
      },
      {
        name: "Ceiling Fans",
        price: 2499,
        image_url:
          "https://rukminim2.flixcart.com/image/312/312/xif0q/fan/m/w/v/apsra-high-speed-50-1-ceiling-fan-1200-digismart-original-imah7kuh2dywnduh.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/digismart-apsra-390-rpm-high-speed-1200-mm-3-blade-ceiling-fan/p/itmeba39e127c6d1?pid=FANFZBZT66HP6H7X&lid=LSTFANFZBZT66HP6H7XPLBDWI&marketplace=FLIPKART&q=ceiling+fans+for+home&store=j9e%2Fabm%2Flbz&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_1_11_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_11_na_na_na&fm=search-autosuggest&iid=en_UbWFN1Y_qxjsQuMIxgySnGInlDOhSM711sEF_nnstFQQBYJGsiTyB-euvJm8fpzriUSWYDJf_HZhklq0EKyPAw%3D%3D&ppt=pp&ppn=pp&ssid=wvqt0pzg6o0000001745179846189&qH=6ec6267f6e4d0094",
        offer: "Special Offer",
      },
      {
        name: "Home Theatre Systems",
        price: 14999,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/x/b/c/-original-imah4mfspzzsyfyh.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/boult-bassbox-x500-dolby-digital-500w-power-5-1-channel-dedicated-dsp-3-eq-mode-500-w-bluetooth-soundbar/p/itmaf336ec2376aa?pid=ACCH3CP2BEDEHG9J&lid=LSTACCH3CP2BEDEHG9JCVEIJB&marketplace=FLIPKART&q=home+theater+systems&store=0pm%2F0o7&srno=s_1_2&otracker=search&otracker1=search&fm=Search&iid=en_u7Tu1FeOgaqA19EUcKfw8gAc_szt_SJsPXxOJ9z-E1Qqs3IbB6x_rduU1fPytGseXf1Qmt9F_kV-Xvo4iTEbhw%3D%3D&ppt=sp&ppn=sp&ssid=3bvwo8bb680000001745179920589&qH=73179e053ab8933b",
        offer: "Explore Now",
      },
      {
        name: "Bluetooth Speakers",
        price: 4999,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/m/n/x/-original-imah4jfdjj6g3jrn.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/mivi-fort-h120-soundbar-120-watts-2-1-channel-multi-input-eq-modes-bt-v5-1-w-bluetooth-soundbar/p/itm4885ee5f0e78a?pid=ACCH3MUY4XKMBPZF&lid=LSTACCH3MUY4XKMBPZFAUFGUL&marketplace=FLIPKART&q=bluetooth+speakers&store=0pm%2F0o7&srno=s_1_2&otracker=search&otracker1=search&fm=Search&iid=en_CVRHCcMjLad1pio_MnUgcS5no8kulLD899SyiebnDKbzoxCSvWhuHA9IC7w-oFxkbkoaI8HJJNX3zztPpyF4pQ%3D%3D&ppt=sp&ppn=sp&ssid=mw8gbe22ow0000001745179998472&qH=ee4f310f9b00616b",
        offer: "Min. 30% Off",
      },
    ],
    "Summer Fashion": [
      {
        name: "Men's Casual Shoes",
        price: 3999,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/7/g/4/7-2ff23201b11-7-flying-machine-blue-original-imagrz9vuct3nywh.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/flying-machine-zeeke-sneakers-men/p/itmb3c7fc1e017e1?pid=SHOGRHFEMHPQQUMT&lid=LSTSHOGRHFEMHPQQUMTZUZL3A&marketplace=FLIPKART&q=mens+casual+shoes&store=osp%2Fcil%2Fe1f&srno=s_1_9&otracker=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&fm=search-autosuggest&iid=23d2b26b-3e88-497c-b344-0ca2b513d524.SHOGRHFEMHPQQUMT.SEARCH&ppt=sp&ppn=sp&ssid=5v09uzfiyo0000001745180073641&qH=587e1a421f8a47d8",
        offer: "Min. 70% Off",
      },
      {
        name: "Men's Slippers & Flip Flops",
        price: 799,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/slipper-flip-flop/6/r/z/12-2000312-nostrain-olive-green-original-imah6xhwzuvgfaxc.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/nostrain-men-parallel-linen-sugar-slides/p/itm8fafb86fc1ada?pid=SFFHYUHDAXFHKGFK&lid=LSTSFFHYUHDAXFHKGFKZ4FS1X&marketplace=FLIPKART&q=Mens+Slippers+%26+Flip+Flops&store=osp%2Fcil%2Fe1r&srno=s_1_9&otracker=search&otracker1=search&fm=Search&iid=c1130be6-4bf6-4971-883e-175d9abc484c.SFFHYUHDAXFHKGFK.SEARCH&ppt=sp&ppn=sp&qH=e059079b32f10e2b",
        offer: "Min. 70% Off",
      },
      {
        name: "Men's Innerwear",
        price: 499,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/brief/4/q/d/s-3-mbtr-16p-flxprnt-po3-co1-s24-dollar-bigboss-original-imagxhhqp3trbzub.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/dollar-bigboss-men-cotton-shuffle-intellisoft-spandex-brief/p/itm452bba758552e?pid=BRFGXHHRFU7SSB6Z&lid=LSTBRFGXHHRFU7SSB6ZAKHBAX&marketplace=FLIPKART&q=Mens+Innerwear&store=clo%2Fqfl%2Fszr%2F3xl&spotlightTagId=default_TrendingId_clo%2Fqfl%2Fszr%2F3xl&srno=s_1_3&otracker=search&otracker1=search&fm=Search&iid=fc22257f-ea1d-4e2e-8659-1f13171a7eb6.BRFGXHHRFU7SSB6Z.SEARCH&ppt=sp&ppn=sp&ssid=aowdvdlxv40000001745180149793&qH=3aafe4c73f258d42",
        offer: "3 for 999",
      },
      {
        name: "Backpacks",
        price: 1999,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/backpack/c/j/m/-original-imah2uw5hxrfyjdm.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/american-tourister-daybreak-25-l-laptop-backpack/p/itm47097fb7d0e84?pid=BKPH2PEQZY7T7DZS&lid=LSTBKPH2PEQZY7T7DZSFIBSBG&marketplace=FLIPKART&q=Backpacks&store=reh%2F4d7&srno=s_1_2&otracker=search&otracker1=search&fm=Search&iid=en_mqZ3Yipq1fJPM_EaViCo915gwxpwXDQq2_TtZtgerZzXSSKJXSmH-Au0i_PF__DfX1v-RgL4CqwfbbtV5W5cKA%3D%3D&ppt=sp&ppn=sp&ssid=ed1chx6cxs0000001745180187481&qH=ae5a70558e976875",
        offer: "Min. 50% Off",
      },
    ],
    "Season's Top Picks": [
      {
        name: "Men's Casual Shoes",
        price: 3999,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/7/g/4/7-2ff23201b11-7-flying-machine-blue-original-imagrz9vuct3nywh.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/flying-machine-zeeke-sneakers-men/p/itmb3c7fc1e017e1?pid=SHOGRHFEMHPQQUMT&lid=LSTSHOGRHFEMHPQQUMTZUZL3A&marketplace=FLIPKART&q=mens+casual+shoes&store=osp%2Fcil%2Fe1f&srno=s_1_9&otracker=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_16_na_na_na&fm=search-autosuggest&iid=23d2b26b-3e88-497c-b344-0ca2b513d524.SHOGRHFEMHPQQUMT.SEARCH&ppt=sp&ppn=sp&ssid=5v09uzfiyo0000001745180073641&qH=587e1a421f8a47d8",
        offer: "Min. 70% Off",
      },
      {
        name: "Slippers",
        price: 699,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/slipper-flip-flop/x/q/r/10-clb-1301-knoos-tan-original-imah44hf6c53bky9.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/knoos-men-slippers/p/itmd058586e77d71?pid=SFFH44HG6SXZU2TZ&lid=LSTSFFH44HG6SXZU2TZI0WW8T&marketplace=FLIPKART&q=Slippers&store=osp&srno=s_1_4&otracker=search&otracker1=search&fm=Search&iid=0957c37c-f235-485a-81a1-acb62a982507.SFFH44HG6SXZU2TZ.SEARCH&ppt=sp&ppn=sp&ssid=wdf0gjn2u80000001745180247396&qH=3aee0b29b3eeb026",
        offer: "Min. 60% Off",
      },
      {
        name: "Casual Shirts",
        price: 1299,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/m/v/o/m-short-pop-02-marmic-fab-original-imagwykcftpkbsbp.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/marmic-fab-men-self-design-casual-pink-shirt/p/itm7c8fa2d9a18e3?pid=SHTGWYKCV8TQFBWF&lid=LSTSHTGWYKCV8TQFBWFFCQTCK&marketplace=FLIPKART&q=Casual+Shirts&store=clo%2Fash%2Faxc%2Fmmk%2Fkp7&srno=s_1_9&otracker=search&otracker1=search&fm=Search&iid=9f8c06c7-d583-44c7-8013-83773ed15e09.SHTGWYKCV8TQFBWF.SEARCH&ppt=sp&ppn=sp&qH=027430bf68f5c981",
        offer: "Special Offer",
      },
      {
        name: "Women's Sarees",
        price: 2499,
        image_url:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/sari/u/j/x/free-ff-tarag-pathan-maroon-miracletex-unstitched-original-imah4zgaghsg6e3p.jpeg?q=70",
        product_url:
          "https://www.flipkart.com/akfabrics-digital-print-daily-wear-lycra-blend-saree/p/itm45a6b2336d2eb?pid=SARGXUQZBNPC5KUK&lid=LSTSARGXUQZBNPC5KUKOMYXCF&marketplace=FLIPKART&q=Womens+Sarees&store=clo%2F8on%2Fzpd&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=en_U8sbo0W3p6z-Bh8hLGPtzcHsIdG3ikJZFHvBDblb3MfCM8mx5nBbKGgNJmWYIG82gsMRdVBiY5JKAeh0JmPvcw%3D%3D&ppt=sp&ppn=sp&ssid=n5w8z2rdyo0000001745180393577&qH=35574ff2df1871e3",
        offer: "Min. 40% Off",
      },
    ],
  };

  // Load suggested products on component mount
  useEffect(() => {
    // Flatten the suggested products for initial display
    const initialProducts = Object.values(suggestedProducts).flat();
    setProducts(initialProducts);
    setError("Showing suggested products");
    setTimeout(() => setError(""), 3000);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleScrape = async () => {
    setIsLoading(true);
    setError("");
    setProducts([]); // Clear suggested products when searching
    let errorMessages = [];

    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "https://deal-mitra.onrender.com";

    const query = search.replace(/ /g, "+");

    try {
      const [
        amazonResponse,
        flipkartResponse,
        zeptoResponse,
        instamartResponse,
        bigbasketResponse,
      ] = await Promise.all([
        fetch(`${baseUrl}/scrape-amazon?search=${query}`)
          .then((res) => res.json())
          .catch((e) => ({ error: `Amazon scraping failed: ${e.message}` })),

        fetch(`${baseUrl}/scrape-flipkart?search=${query}`)
          .then((res) => res.json())
          .catch((e) => ({ error: `Flipkart scraping failed: ${e.message}` })),

        fetch(`${baseUrl}/scrape-zepto?search=${query}`)
          .then((res) => res.json())
          .catch((e) => ({ error: `Zepto scraping failed: ${e.message}` })),

        fetch(`${baseUrl}/scrape-instamart?search=${query}`)
          .then((res) => res.json())
          .catch((e) => ({ error: `Instamart scraping failed: ${e.message}` })),

        fetch(`${baseUrl}/scrape-bigbasket?search=${query}`)
          .then((res) => res.json())
          .catch((e) => ({ error: `BigBasket scraping failed: ${e.message}` })),
      ]);

      const parseProducts = (response, source) => {
        if (response.error) {
          errorMessages.push(response.error);
          return [];
        }
        return response.slice(0, 5).map((product) => ({
          ...product,
          source,
        }));
      };

      const combinedProducts = [
        ...parseProducts(amazonResponse, "amazon"),
        ...parseProducts(flipkartResponse, "flipkart"),
        ...parseProducts(zeptoResponse, "zepto"),
        ...parseProducts(instamartResponse, "instamart"),
        ...parseProducts(bigbasketResponse, "bigbasket"),
      ];

      setProducts(combinedProducts);

      if (combinedProducts.length > 0) {
        setError("Scraping completed successfully!");
      } else if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      } else {
        setError("No products found from any platform.");
      }

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

  const handleProductClick = (productUrl) => {
    if (productUrl !== "N/A") {
      handleNavigate(productUrl);
    }
  };

  const handleDashboard = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const sortProducts = (products) => {
    if (sortBy === "price-low-high") {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-high-low") {
      return [...products].sort((a, b) => b.rating - a.rating);
    }
    return products;
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      const withinPriceRange =
        product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesSource =
        filterSource === "both" || product.source === filterSource;
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "3" && product.rating >= 3) ||
        (ratingFilter === "4" && product.rating >= 4) ||
        (ratingFilter === "5" && product.rating >= 5);

      return withinPriceRange && matchesSource && matchesRating;
    });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [e.target.name === "min" ? "min" : "max"]: value,
    }));
  };

  const handleRecipe = (e) => {
    e.preventDefault();
    navigate("/recipepage");
  };

  const displayedProducts = sortProducts(filterProducts(products));

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* Header with User Icon on the Left */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <img src="/public/Logo.jpg" alt="" height="80px" width="80px" />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-800">
          DEAL MITRA
        </h1>
        <FaUserCircle
          className="ml-auto text-3xl text-gray-700 cursor-pointer mr-2"
          onClick={handleDashboard}
        />
      </div>

      <div className="flex-grow p-4 overflow-auto">
        {error && (
          <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
        )}
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Filter Panel */}
          <div className="w-full md:w-1/4 bg-orange-100 p-4 rounded-lg h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">FILTER</h3>
            <div className="space-y-4">
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Range (₹)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                    min="0"
                    max={priceRange.max}
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    min={priceRange.min}
                    max="1000000"
                    className="w-1/2 px-2 py-1 border rounded"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: parseInt(e.target.value),
                    }))
                  }
                  className="w-full mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="3">3 Stars and Above</option>
                  <option value="4">4 Stars and Above</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 h-full overflow-y-auto">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                className="w-full md:w-2/3 px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter search term (e.g., Samsung Galaxy F14 5G)"
              />
              <div className="mt-2 md:mt-0 md:ml-4 flex space-x-20">
                <button
                  onClick={handleScrape}
                  disabled={isLoading || !search.trim()}
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Scraping..." : "Search"}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating-high-low">Rating: High to Low</option>
                </select>
              </div>
            </div>

            {/* Suggested Products Carousel */}
            {displayedProducts.length > 0 &&
              products.length > 0 &&
              products[0].offer && (
                <div>
                  {Object.entries(suggestedProducts).map(
                    ([category, products], index) => (
                      <div key={index} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {category}
                          </h3>
                          <button className="text-blue-500 text-sm font-medium">
                            &gt;
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {products.map((product, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-2 rounded-lg shadow-sm border cursor-pointer"
                              onClick={() =>
                                handleProductClick(product.product_url)
                              }
                            >
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-32 object-contain mb-2"
                              />
                              <p className="text-sm font-medium text-gray-800">
                                {product.name}
                              </p>
                              <p className="text-xs text-green-600">
                                {product.offer}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{product.price.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

            {/* Scraped Products Grid */}
            {displayedProducts.length > 0 && !products[0]?.offer && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
                    onClick={() => handleProductClick(product.product_url)}
                  >
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
                      {product.reviews
                        ? product.reviews.toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Source:{" "}
                      {product.source.charAt(0).toUpperCase() +
                        product.source.slice(1)}
                    </p>
                    <p className="text-blue-500 text-sm mt-2 underline">
                      {product.product_url !== "N/A"
                        ? "View Product"
                        : "No link available"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPagev3;
