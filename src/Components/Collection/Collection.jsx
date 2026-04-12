import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../Card/Card";
import { useNavigate } from "react-router-dom";
import "./Collection.css";

const API = "https://inf-ct8e.onrender.com/products/fetch";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // filters
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

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

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // category
    if (activeCat !== "all") {
      data = data.filter((p) => p.category === activeCat);
    }

    // search
    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort
    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);

    return data;
  }, [products, activeCat, search, sort]);

  // 🔥 LIMIT TO 5 PRODUCTS ONLY
  const visibleProducts = filteredProducts.slice(0, 5);

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

      {/* CONTROLS */}
      <div className="collection-controls">
        <input
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* FILTERS */}
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
      </div>

      {/* GRID */}
      <div className="collection-grid">
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="skeleton card skeleton-card"></div>
            ))
        ) : visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <div className="empty-state">No products found 😢</div>
        )}
      </div>

      {/* 🔥 VERY VISIBLE SHOP MORE BUTTON */}
      <div className="shop-more-wrap">
        <button
          className="btn btn-primary shop-more-btn"
          onClick={() => navigate("/collection")}
        >
          Shop More →
        </button>
      </div>

    </div>
  );
};

export default Collection;