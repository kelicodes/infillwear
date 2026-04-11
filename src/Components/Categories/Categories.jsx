import { useState, useRef, useEffect } from "react";
import "./Categories.css";

const CATEGORIES = [
  {
    id: "tops",
    label: "Tees & Tops",
    sub: "Essential layers",
    href: "/shop/tops",
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
    href: "/shop/hoodies",
    accentVar: "--ice-blue",
    count: "87 styles",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80&auto=format&fit=crop",
    tag: "HYPE",
    tagClass: "badge-hype",
  },
  {
    id: "bottoms",
    label: "Bottoms",
    sub: "Low-key killers",
    href: "/shop/bottoms",
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
    href: "/shop/accessories",
    accentVar: "--hot-coral",
    count: "203 styles",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80&auto=format&fit=crop",
    tag: "SALE",
    tagClass: "badge-sale",
  },
];

const CategoryCard = ({ item, index }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <a
      ref={cardRef}
      href={item.href}
      className={`cat-card cat-card--${item.id} animate-fade-up delay-${index + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        "--accent": `var(${item.accentVar})`,
        "--gx": `${mousePos.x}%`,
        "--gy": `${mousePos.y}%`,
      }}
    >
      {/* Background image */}
      <div className="cat-card__media">
        <img src={item.image} alt={item.label} loading="lazy" />
        <div className="cat-card__media-overlay" />
      </div>

      {/* Spotlight glow that follows cursor */}
      <div className="cat-card__spotlight" />

      {/* Top badge */}
      <div className="cat-card__badge-row">
        <span className={`badge ${item.tagClass}`}>{item.tag}</span>
        <span className="cat-card__count">{item.count}</span>
      </div>

      {/* Bottom content */}
      <div className="cat-card__body">
        <p className="cat-card__sub">{item.sub}</p>
        <h3 className="cat-card__label">{item.label}</h3>

        <div className="cat-card__cta">
          <span className="cat-card__cta-text">Explore</span>
          <span className="cat-card__arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="cat-card__accent-bar" />
    </a>
  );
};

/* ── Featured wide card (hero banner style) ────────────── */
const FeaturedCard = () => (
  <a href="/shop/new" className="cat-featured animate-fade-up">
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
        The freshest pieces just landed. First come, first dripped.
      </p>
      <button className="btn btn-primary cat-featured__btn">
        Shop Now
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </a>
);

const Categories = () => {
  /* Scroll-reveal via IntersectionObserver */
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

        {/* ── Header ───────────────────────────────── */}
        <div className="categories-header animate-fade-up">
          <div className="categories-label">
            <span className="divider-dot" />
            Collections
          </div>
          <h2 className="categories-title">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="categories-sub">
            Built for everyday fits. Pick your vibe.
          </p>
        </div>

        {/* ── Layout: featured + grid ───────────────── */}
        <div className="categories-layout">

          {/* Featured wide card */}
          <FeaturedCard />

          {/* 4-card grid */}
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