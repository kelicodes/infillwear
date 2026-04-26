import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../../Components/Card/Card"
import "./Ourcollection.css";

const API = "https://inf-1-udgs.onrender.com/products/fetch";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("");
  const [brand, setBrand] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API);
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🧠 get unique brands (fallback using category if no brand field)
  const brands = useMemo(() => {
    const list = products.map((p) => p.brand || p.category);
    return ["all", ...new Set(list)];
  }, [products]);

  // 🔥 FILTER + SEARCH + SORT ENGINE
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // CATEGORY FILTER
    if (activeCat !== "all") {
      data = data.filter((p) => p.category === activeCat);
    }

    // BRAND FILTER
    if (brand !== "all") {
      data = data.filter((p) => (p.brand || p.category) === brand);
    }

    // SEARCH FILTER
    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORT
    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [products, activeCat, brand, search, sort]);

  const addToCart = (product) => {
    console.log("Added:", product);
  };

  return (
    <div className="collection container section">

      {/* HEADER */}
      <div className="collection-header">
        <h1 className="text-display text-gradient">Collection</h1>
        <p>Discover premium drops curated for your style.</p>
      </div>

      {/* SEARCH + SORT BAR */}
      <div className="collection-controls">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {/* SORT */}
        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>

      </div>

      {/* FILTER TAGS */}
      <div className="collection-filters">

        {["all", "trousers", "combo"].map((cat) => (
          <span
            key={cat}
            className={`tag ${activeCat === cat ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </span>
        ))}

        {/* BRAND FILTER */}
        {brands.map((b) => (
          <span
            key={b}
            className={`tag ${brand === b ? "active" : ""}`}
            onClick={() => setBrand(b)}
          >
            {b}
          </span>
        ))}

      </div>

      {/* GRID */}
      <div className="collection-grid">

        {loading
          ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton card skeleton-card"></div>
            ))
          : filteredProducts.length > 0
          ? filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))
          : (
              <div className="empty-state">
                No products found 😢
              </div>
            )}

      </div>
    </div>
  );
};

export default Collection;