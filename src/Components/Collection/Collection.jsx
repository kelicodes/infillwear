import { useEffect, useState } from "react";
import ProductCard from "../Card/Card";
import "./Collection.css";
import axios from "axios";

const API = "https://inf-ct8e.onrender.com/products/fetch";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API);
        setProducts(res.data.products);
        setFiltered(res.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter
  const handleFilter = (cat) => {
    setActiveCat(cat);

    if (cat === "all") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === cat));
    }
  };

  const addToCart = (product) => {
    console.log("Added:", product);
  };

  return (
    <div className="collection container section">

      {/* HEADER */}
      <div className="collection-header">
        <h1 className="text-display text-gradient">Collection</h1>
        <p>Discover the latest drops and curated pieces.</p>
      </div>

      {/* FILTERS */}
      <div className="collection-filters">
        {["all", "trousers", "combo"].map((cat) => (
          <span
            key={cat}
            className={`tag ${activeCat === cat ? "active" : ""}`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* GRID */}
      <div className="collection-grid">

        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <div key={i} className="skeleton card skeleton-card"></div>)
          : filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}

      </div>
    </div>
  );
};

export default Collection;