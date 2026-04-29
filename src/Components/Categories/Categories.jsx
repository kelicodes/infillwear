import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const CATEGORIES = [
  {
    id: "tops",
    label: "Tees & Tops",
    sub: "Essential layers",
    href: "/collection/tops",
    accentVar: "--acid-green",
    count: "124 styles",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80&auto=format&fit=crop",
    tag: "NEW DROP",
    tagClass: "badge-new",
  },
  {
    id: "hoodies",
    label: "Hoodies",
    sub: "Stay warm, stay loud",
    href: "/collection",
    accentVar: "--ice-blue",
    count: "87 styles",
    image:
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80&auto=format&fit=crop",
    tag: "HYPE",
    tagClass: "badge-hype",
  },
  {
    id: "bottoms",
    label: "Bottoms",
    sub: "Low-key killers",
    href: "/collection",
    accentVar: "--lilac",
    count: "96 styles",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop",
    tag: "LIMITED",
    tagClass: "badge-ltd",
  },
  {
    id: "accessories",
    label: "Accessories",
    sub: "Finish the fit",
    href: "/collection",
    accentVar: "--hot-coral",
    count: "203 styles",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80&auto=format&fit=crop",
    tag: "SALE",
    tagClass: "badge-sale",
  },
];

/* ── Category Card ───────────────────────────── */
const CategoryCard = ({ item, index }) => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const goToPage = () => {
    navigate(item.href);
  };

  return (
    <div
      ref={cardRef}
      className={`cat-card cat-card--${item.id} animate-fade-up delay-${index + 1}`}
      onClick={goToPage}
      onMouseMove={handleMouseMove}
      style={{
        "--accent": `var(${item.accentVar})`,
        "--gx": `${mousePos.x}%`,
        "--gy": `${mousePos.y}%`,
        cursor: "pointer",
      }}
    >
      {/* Background image */}
      <div className="cat-card__media">
        <img src={item.image} alt={item.label} loading="lazy" />
        <div className="cat-card__media-overlay" />
      </div>

      {/* Spotlight */}
      <div className="cat-card__spotlight" />

      {/* Badge row */}
      <div className="cat-card__badge-row">
        <span className={`badge ${item.tagClass}`}>{item.tag}</span>
        <span className="cat-card__count">{item.count}</span>
      </div>

      {/* Content */}
      <div className="cat-card__body">
        <p className="cat-card__sub">{item.sub}</p>
        <h3 className="cat-card__label">{item.label}</h3>

        <div className="cat-card__cta">
          <span className="cat-card__cta-text">Explore</span>
        </div>
      </div>

      <div className="cat-card__accent-bar" />
    </div>
  );
};

/* ── Featured Card ───────────────────────────── */
const FeaturedCard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="cat-featured animate-fade-up"
      onClick={() => navigate("/collection")}
      style={{ cursor: "pointer" }}
    >
      <img
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80&auto=format&fit=crop"
        alt="New arrivals"
        className="cat-featured__img"
        loading="lazy"
      />
      <div className="cat-featured__overlay" />

      <div className="cat-featured__content">
        <span className="badge badge-hype">SS25 DROP</span>
        <h2 className="cat-featured__title">
          New <span className="text-gradient">Arrivals</span>
        </h2>

        <p className="cat-featured__body">
          The freshest pieces just landed.
        </p>

        <button
          className="btn btn-primary cat-featured__btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/collection");
          }}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

/* ── Main Component ─────────────────────────── */
const Categories = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const cards = sectionRef.current?.querySelectorAll(
      ".cat-card, .cat-featured"
    );

    cards?.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="categories section" ref={sectionRef}>
      <div className="container">

        <div className="categories-header animate-fade-up">
          <h2 className="categories-title">
            Shop by <span className="text-gradient">Category</span>
          </h2>
        </div>

        <div className="categories-layout">
          <FeaturedCard />

          <div className="categories-grid">
            {CATEGORIES.map((item, i) => (
              <CategoryCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Categories;