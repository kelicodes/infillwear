import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product.availability || adding) return;
    setAdding(true);
    await addToCart(product);
    setTimeout(() => setAdding(false), 900);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    setWished((w) => !w);
  };

  return (
    <article
      className={`product-card${!product.availability ? " product-card--unavailable" : ""}`}
      onClick={() => navigate(`/product/${product._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
      aria-label={`View ${product.name}`}
    >
      {/* ── MEDIA ─────────────────────────────── */}
      <div className="card-media">
        <img
          src={product.images?.[0] || "/fallback.jpg"}
          alt={product.name}
          loading="lazy"
        />

        <div className="media-scrim" />

        {/* Badges */}
        <div className="card-badges">
          <span className="badge badge--new">New</span>
          {!product.availability && (
            <span className="badge badge--sold">Sold out</span>
          )}
        </div>

        {/* Floating actions */}
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`action-btn${wished ? " action-btn--active" : ""}`}
            onClick={handleWish}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={wished} />
          </button>

          <button
            className={`action-btn action-btn--cart${adding ? " action-btn--adding" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.availability}
            aria-label="Quick add to cart"
          >
            <CartIcon />
          </button>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────── */}
      <div className="card-body">
        <div className="card-meta">
          <span className="product-category">{product.category}</span>

          {product.availability ? (
            <span className="stock-dot stock-dot--in" aria-label="In stock" />
          ) : (
            <span className="stock-dot stock-dot--out" aria-label="Out of stock" />
          )}
        </div>

        <h3 className="product-title">{product.name}</h3>

        <p className="product-desc">{product.desc}</p>

        <div className="card-footer">
          <div className="price-block">
            <span className="price">KES {product.price?.toLocaleString()}</span>
          </div>

          <button
            className={`cta-btn${adding ? " cta-btn--adding" : ""}${!product.availability ? " cta-btn--disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.availability}
            aria-live="polite"
          >
            <span className="cta-label">
              {adding ? "Adding…" : product.availability ? "Add to cart" : "Unavailable"}
            </span>
            {product.availability && !adding && (
              <span className="cta-arrow"><ArrowIcon /></span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;