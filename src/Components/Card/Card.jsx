import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Card.css";

const BASE_URL = "https://inf-1-udgs.onrender.com";

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [wished, setWished] = useState(false);
  const [cartState, setCartState] = useState("idle"); 
  // idle | adding | added

  const handleWish = (e) => {
    e.stopPropagation();
    setWished((prev) => !prev);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!product.availability || cartState === "adding") return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You have to login inorder to add items to cart");
      navigate("/gin");
      return;
    }

    try {
      setCartState("adding");

      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add to cart");
        setCartState("idle");
        return;
      }

      setCartState("added");
      toast.success("Added to cart");

      setTimeout(() => {
        setCartState("idle");
      }, 1800);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setCartState("idle");
    }
  };

  return (
    <article
      className={`product-card${!product.availability ? " product-card--unavailable" : ""}`}
      onClick={() => navigate(`/product/${product._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/product/${product._id}`)
      }
    >
      {/* IMAGE */}
      <div className="card-media">
        <img
          src={product.images?.[0] || "/fallback.jpg"}
          alt={product.name}
          loading="lazy"
        />

        <div className="media-scrim" />

        <div className="card-badges">
          <span className="badge badge--new">New</span>

          {!product.availability && (
            <span className="badge badge--sold">Sold out</span>
          )}
        </div>

        {/* FLOATING ACTIONS */}
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`action-btn${wished ? " action-btn--active" : ""}`}
            onClick={handleWish}
          >
            <HeartIcon filled={wished} />
          </button>

          <button
            className={`action-btn action-btn--cart ${
              cartState === "adding" ? " action-btn--adding" : ""
            } ${cartState === "added" ? " action-btn--done" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.availability}
          >
            {cartState === "adding" ? "…" : cartState === "added" ? "✓" : <CartIcon />}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="card-body">
        <div className="card-meta">
          <span className="product-category">{product.category}</span>

          {product.availability ? (
            <span className="stock-dot stock-dot--in" />
          ) : (
            <span className="stock-dot stock-dot--out" />
          )}
        </div>

        <h3 className="product-title">{product.name}</h3>

        <p className="product-desc">{product.desc}</p>

        <div className="card-footer">
          <div className="price-block">
            <span className="price">
              KES {product.price?.toLocaleString()}
            </span>
          </div>

          <button
            className={`cta-btn ${
              cartState === "adding" ? " cta-btn--adding" : ""
            } ${
              cartState === "added" ? " cta-btn--success" : ""
            } ${
              !product.availability ? " cta-btn--disabled" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!product.availability}
          >
            <span className="cta-label">
              {cartState === "adding"
                ? "Adding..."
                : cartState === "added"
                ? "Added!"
                : product.availability
                ? "Add to Cart"
                : "Unavailable"}
            </span>

            {product.availability &&
              cartState === "idle" && (
                <span className="cta-arrow">
                  <ArrowIcon />
                </span>
              )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;