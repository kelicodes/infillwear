import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card product-card animate-fade-up"
      onClick={() => navigate(`/product/${product._id}`)}
    >

      {/* MEDIA */}
      <div className="card-media">

        <img
          src={product.images?.[0] || "/fallback.jpg"}
          alt={product.name}
        />

        {/* Gradient overlay */}
        <div className="media-overlay"></div>

        {/* Top badges */}
        <div className="top-badges">
          <span className="badge badge-new">New</span>
        </div>

        {/* Hover actions */}
        <div
          className="card-actions"
          onClick={(e) => e.stopPropagation()} // 🚨 IMPORTANT
        >
          <button
            className="btn-icon"
            onClick={() => addToCart(product)}
          >
            🛒
          </button>
          <button className="btn-icon">❤️</button>
        </div>

      </div>

      {/* BODY */}
      <div className="card-body">

        {/* Category */}
        <span className="tag product-tag">{product.category}</span>

        {/* Title */}
        <h3 className="product-title">{product.name}</h3>

        {/* Description */}
        <p className="product-desc">{product.desc}</p>

        {/* Bottom row */}
        <div className="product-bottom">
          <span className="price">KES {product.price}</span>

          {product.availability ? (
            <span className="stock in">In Stock</span>
          ) : (
            <span className="stock out">Out</span>
          )}
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary product-btn"
          onClick={(e) => {
            e.stopPropagation(); // 🚨 prevents navigation
            addToCart(product);
          }}
          disabled={!product.availability}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default ProductCard;