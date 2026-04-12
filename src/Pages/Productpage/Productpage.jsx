import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Productpage.css";

/* ─── CONFIG ─────────────────────────────────────────────────────────────── */
const API            = "https://inf-ct8e.onrender.com/products/fetch";
const WHATSAPP_NUMBER = "254700000000"; // ← replace with your client's number

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const UNAVAILABLE_SIZES = ["XS"]; // ← pull from product.unavailableSizes in real use

/* ─── WhatsApp SVG icon ───────────────────────────────────────────────────── */
const WAIcon = () => (
  <svg className="whatsapp-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2C8.268 2 2 8.268 2 16c0 2.466.667 4.777 1.832 6.762L2 30l7.469-1.81A13.915 13.915 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"
      fill="#fff" fillOpacity="0.15"
    />
    <path
      d="M22.503 19.97c-.316-.158-1.87-.922-2.16-1.027-.29-.105-.501-.158-.712.158-.21.316-.816 1.027-1.001 1.238-.184.21-.369.237-.685.08-.316-.158-1.333-.491-2.539-1.567-.938-.837-1.572-1.87-1.756-2.186-.184-.316-.02-.487.138-.644.142-.14.316-.369.474-.554.158-.184.21-.316.316-.527.105-.21.052-.395-.026-.554-.079-.158-.712-1.717-.976-2.35-.257-.618-.519-.534-.712-.544l-.606-.01a1.163 1.163 0 00-.843.395c-.29.316-1.106 1.08-1.106 2.634 0 1.554 1.132 3.055 1.29 3.265.158.21 2.229 3.403 5.4 4.769.755.326 1.344.521 1.804.667.757.241 1.447.207 1.992.125.607-.09 1.87-.764 2.134-1.502.264-.738.264-1.37.185-1.502-.079-.132-.29-.21-.606-.369z"
      fill="white"
    />
  </svg>
);

/* ─── Trust badges ────────────────────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: "🚚", label: "2–4 Day Delivery" },
  { icon: "🔒", label: "Secure Checkout" },
  { icon: "💳", label: "Pay on Delivery" },
  { icon: "↩️", label: "Easy Returns" },
];

const FEATURES = [
  { icon: "🧵", label: "Premium Fabric" },
  { icon: "✂️", label: "Tailored Fit" },
  { icon: "🌍", label: "Made in Kenya" },
  { icon: "♻️", label: "Eco Conscious" },
];

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
const ProductSkeleton = () => (
  <div className="product-skeleton-wrap container">
    <div className="skeleton-gallery">
      <div className="skeleton-main-img" />
      <div className="skeleton-thumbs">
        {[1, 2, 3].map(i => <div key={i} className="skeleton-thumb" />)}
      </div>
    </div>
    <div className="skeleton-info">
      <div className="skeleton-line" style={{ height: 14, width: "40%" }} />
      <div className="skeleton-line" style={{ height: 40, width: "90%" }} />
      <div className="skeleton-line" style={{ height: 40, width: "70%" }} />
      <div className="skeleton-line" style={{ height: 14, width: "80%", marginTop: 8 }} />
      <div className="skeleton-line" style={{ height: 14, width: "65%" }} />
      <div className="skeleton-line" style={{ height: 52, width: "100%", borderRadius: 99, marginTop: 24 }} />
      <div className="skeleton-line" style={{ height: 52, width: "100%", borderRadius: 99 }} />
    </div>
  </div>
);

/* ─── Not Found ───────────────────────────────────────────────────────────── */
const NotFound = ({ onBack }) => (
  <div className="product-not-found container section">
    <div className="not-found-icon">◎</div>
    <h2>Product Not Found</h2>
    <p>This drop might have sold out or the link may be incorrect.</p>
    <button className="btn btn-secondary" onClick={onBack}>← Back to Collection</button>
  </div>
);

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */
const ProductPage = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wished, setWished]       = useState(false);
  const [cartState, setCartState] = useState("idle"); // idle | adding | added

  // Touch/swipe tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  /* Fetch */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res  = await axios.get(API);
        const found = res.data.products.find(p => String(p._id) === String(id));
        setProduct(found || null);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  /* Image cycling */
  const images = product?.images?.length ? product.images : [null];

  const prevImg = useCallback(() =>
    setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImg = useCallback(() =>
    setActiveImg(i => (i + 1) % images.length), [images.length]);

  /* Keyboard nav */
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowLeft")  prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevImg, nextImg]);

  /* Touch swipe handlers */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe > 40px and more horizontal than vertical
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextImg();
      else        prevImg();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  /* Add to cart */
  const addToCart = () => {
    if (cartState !== "idle" || !product.availability) return;
    setCartState("adding");
    // → plug in your cart logic here
    console.log("Add to cart:", product, "size:", selectedSize);
    setTimeout(() => {
      setCartState("added");
      setTimeout(() => setCartState("idle"), 2200);
    }, 600);
  };

  /* WhatsApp order */
  const buyOnWhatsApp = () => {
    const sizeText  = selectedSize ? ` (Size: ${selectedSize})` : "";
    const priceText = `KSh ${(product.price || 0).toLocaleString()}`;
    const msg = encodeURIComponent(
      `Hey! 👋 I'd like to order:\n\n` +
      `*${product.name}*${sizeText}\n` +
      `Price: ${priceText}\n\n` +
      `Please confirm availability and delivery details. Thanks!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  /* Stock helpers */
  const stockLevel = product
    ? product.availability
      ? (product.stock && product.stock < 5 ? "low" : "in")
      : "out"
    : "out";

  const stockText = {
    in:  "In Stock — Ready to Ship",
    low: `Only ${product?.stock || 3} left — Order Now`,
    out: "Sold Out",
  }[stockLevel];

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const savePct     = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  /* ── RENDER ── */
  if (loading) return <ProductSkeleton />;
  if (!product) return <NotFound onBack={() => navigate(-1)} />;

  return (
    <div className="product-page container">

      {/* ══════════ LEFT — GALLERY ══════════ */}
      <div className="product-gallery animate-fade-up">

        {/* Main image — touch swipeable */}
        <div
          className="main-image"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images[activeImg]
            ? <img src={images[activeImg]} alt={product.name} />
            : (
              <div style={{
                width: "100%", height: 580,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-elevated)",
                fontFamily: "Unbounded, sans-serif",
                fontSize: "4rem", color: "var(--text-muted)",
              }}>
                {(product.name || "?")[0].toUpperCase()}
              </div>
            )
          }

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={prevImg} aria-label="Previous">‹</button>
              <button className="gallery-nav next" onClick={nextImg} aria-label="Next">›</button>
              <div className="img-counter">{activeImg + 1} / {images.length}</div>
            </>
          )}
        </div>

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="mobile-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`mobile-dot ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Desktop thumbnails */}
        {images.length > 1 && (
          <div className="thumbnail-row">
            {images.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                {img
                  ? <img src={img} alt="" />
                  : <div style={{ width: "100%", height: "100%", background: "var(--bg-elevated)" }} />
                }
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ RIGHT — INFO ══════════ */}
      <div className="product-info">

        {/* Eyebrow */}
        <div className="product-eyebrow animate-fade-up">
          <span className="product-breadcrumb">
            Shop / <span>{product.category || "Collection"}</span>
          </span>
          {product.category && (
            <span className="product-category-tag">{product.category}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="product-title animate-fade-up delay-1">{product.name}</h1>

        {/* Description */}
        {product.desc && (
          <p className="product-desc animate-fade-up delay-1">{product.desc}</p>
        )}

        {/* Price */}
        <div className="price-row animate-fade-up delay-2">
          <span className="price-main">KSh {(product.price || 0).toLocaleString()}</span>
          {hasDiscount && (
            <>
              <span className="price-original">KSh {product.originalPrice.toLocaleString()}</span>
              <span className="price-save-badge">Save {savePct}%</span>
            </>
          )}
        </div>

        <div className="product-divider" />

        {/* Urgency bar — only when low stock */}
        {stockLevel === "low" && (
          <div className="urgency-bar animate-fade-up delay-2">
            <span className="urgency-icon">🔥</span>
            <span>Almost gone — only {product.stock || 3} pieces left!</span>
          </div>
        )}

        {/* Stock */}
        <div className={`stock-indicator animate-fade-up delay-2`}>
          <span className={`stock-dot ${stockLevel}`} />
          <span className={`stock-text ${stockLevel}`}>{stockText}</span>
        </div>

        {/* Size selector */}
        <div className="size-section animate-fade-up delay-2">
          <div className="size-label-row">
            <span className="size-label">
              Select Size {selectedSize && <span style={{ color: "var(--acid-green)" }}>— {selectedSize}</span>}
            </span>
            <span className="size-guide-link">Size Guide →</span>
          </div>
          <div className="size-grid">
            {SIZES.map(size => (
              <button
                key={size}
                className={`size-btn
                  ${selectedSize === size ? "selected" : ""}
                  ${UNAVAILABLE_SIZES.includes(size) ? "unavailable" : ""}
                `}
                onClick={() => !UNAVAILABLE_SIZES.includes(size) && setSelectedSize(size)}
                disabled={UNAVAILABLE_SIZES.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Features grid */}
        <div className="product-features animate-fade-up delay-3">
          {FEATURES.map(f => (
            <div key={f.label} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>

        {/* ── CTA BUTTONS ── */}
        <div className="product-actions animate-fade-up delay-3">

          <div className="cta-row">
            {/* Add to Cart */}
            <button
              className={`btn-cart ${cartState === "added" ? "added" : ""}`}
              onClick={addToCart}
              disabled={!product.availability || cartState === "adding"}
            >
              {cartState === "adding" && <span className="spin" style={{ fontSize: "1rem" }}>↻</span>}
              {cartState === "added"  && <span style={{ animation: "check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>✓</span>}
              {cartState === "idle"   && <span>🛒</span>}
              {cartState === "idle"   ? (product.availability ? "Add to Cart" : "Sold Out")
                                       : cartState === "adding" ? "Adding…"
                                       : "Added!"}
            </button>
          </div>

          {/* WhatsApp — THE converter */}
          <button
            className="btn-whatsapp"
            onClick={buyOnWhatsApp}
            disabled={!product.availability}
          >
            <WAIcon />
            <div className="wa-text-block">
              <span>Order via WhatsApp</span>
              <span className="wa-sub">Chat with us · Fast reply guaranteed</span>
            </div>
          </button>

          {/* Wishlist + Share */}
          <div className="secondary-actions">
            <button
              className={`btn-icon-action ${wished ? "wished" : ""}`}
              onClick={() => setWished(w => !w)}
            >
              {wished ? "♥" : "♡"} {wished ? "Saved" : "Wishlist"}
            </button>
            <button
              className="btn-icon-action"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
            >
              ↗ Share
            </button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="trust-strip animate-fade-up delay-4">
          {TRUST_ITEMS.map(t => (
            <div key={t.label} className="trust-item">
              <span className="trust-icon">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>

      </div>

      {/* ══════════ MOBILE STICKY CTA BAR ══════════
          Hidden on desktop via CSS, shown on mobile only  */}
      <div className="mobile-cta-bar">

        {/* Wishlist */}
        <button
          className={`mobile-wish-btn ${wished ? "wished" : ""}`}
          onClick={() => setWished(w => !w)}
          aria-label="Wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>

        {/* Add to Cart */}
        <button
          className={`mobile-cart-btn ${cartState === "added" ? "added" : ""}`}
          onClick={addToCart}
          disabled={!product.availability || cartState === "adding"}
        >
          {cartState === "adding" && <span style={{ fontSize: "0.9rem" }}>↻</span>}
          {cartState === "added"  && <span>✓</span>}
          {cartState === "idle"   && <span>🛒</span>}
          <span>
            {cartState === "idle"
              ? (product.availability ? "Add to Cart" : "Sold Out")
              : cartState === "adding" ? "Adding…"
              : "Added!"}
          </span>
        </button>

        {/* WhatsApp */}
        <button
          className="mobile-wa-btn"
          onClick={buyOnWhatsApp}
          disabled={!product.availability}
        >
          {/* Inline small WA icon */}
          <svg className="wa-icon-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.466.667 4.777 1.832 6.762L2 30l7.469-1.81A13.915 13.915 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#fff" fillOpacity="0.15"/>
            <path d="M22.503 19.97c-.316-.158-1.87-.922-2.16-1.027-.29-.105-.501-.158-.712.158-.21.316-.816 1.027-1.001 1.238-.184.21-.369.237-.685.08-.316-.158-1.333-.491-2.539-1.567-.938-.837-1.572-1.87-1.756-2.186-.184-.316-.02-.487.138-.644.142-.14.316-.369.474-.554.158-.184.21-.316.316-.527.105-.21.052-.395-.026-.554-.079-.158-.712-1.717-.976-2.35-.257-.618-.519-.534-.712-.544l-.606-.01a1.163 1.163 0 00-.843.395c-.29.316-1.106 1.08-1.106 2.634 0 1.554 1.132 3.055 1.29 3.265.158.21 2.229 3.403 5.4 4.769.755.326 1.344.521 1.804.667.757.241 1.447.207 1.992.125.607-.09 1.87-.764 2.134-1.502.264-.738.264-1.37.185-1.502-.079-.132-.29-.21-.606-.369z" fill="white"/>
          </svg>
          <span>WhatsApp</span>
        </button>

      </div>
    </div>
  );
};

export default ProductPage;