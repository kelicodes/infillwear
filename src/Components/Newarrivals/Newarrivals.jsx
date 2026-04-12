import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Card/Card";
import "./Newarrivals.css";

const API = "https://inf-ct8e.onrender.com/products/fetch";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const res = await axios.get(API);

        // take latest 6 (simulate "new")
        const latest = res.data.products.slice(-6).reverse();

        setProducts(latest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNew();
  }, []);

  const addToCart = (product) => {
    console.log("Added:", product);
  };

  return (
    <section className="new-arrivals section">

      <div className="container">

        {/* HEADER */}
        <div className="new-header">
          <h2 className="text-display text-gradient">New Arrivals</h2>
          <p>Fresh drops. Limited pieces. Stay ahead.</p>
        </div>

        {/* PRODUCTS */}
        <div className="new-scroll">

          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="card skeleton new-skeleton"></div>
                ))
            : products.map((product) => (
                <div className="new-item" key={product._id}>
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                  />
                </div>
              ))}

        </div>

      </div>
    </section>
  );
};

export default NewArrivals;