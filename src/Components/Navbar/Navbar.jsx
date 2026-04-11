import { useEffect, useState, useRef } from "react";

/* ─── Inline styles as JS (no external CSS dependency) ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Syne:wght@400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-main:      #080810;
    --bg-surface:   #0e0e1c;
    --bg-glass:     rgba(255,255,255,0.04);
    --bg-glass-mid: rgba(255,255,255,0.07);
    --text-primary: #f0f0ff;
    --text-muted:   #55556a;
    --acid-green:   #b8ff35;
    --hot-coral:    #ff4557;
    --ice-blue:     #4df4ff;
    --grad-primary: linear-gradient(135deg,#b8ff35 0%,#4df4ff 100%);
    --blur: blur(20px);
    --t-fast: 0.18s;
    --t-mid:  0.32s;
    --ease-bounce: cubic-bezier(0.34,1.56,0.64,1);
    --ease-out: cubic-bezier(0.22,1,0.36,1);
  }

  body {
    background: var(--bg-main);
    font-family: 'Syne', sans-serif;
    color: var(--text-primary);
    min-height: 100vh;
  }

  /* ── NAV SHELL ───────────────────────────────────── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3%;
    background: rgba(8,8,16,0.3);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background var(--t-mid) var(--ease-out),
                border-color var(--t-mid),
                box-shadow var(--t-mid);
  }

  .nav--scrolled {
    background: rgba(8,8,16,0.88);
    border-bottom-color: rgba(184,255,53,0.12);
    box-shadow: 0 8px 48px rgba(0,0,0,0.6),
                0 1px 0 rgba(184,255,53,0.08);
  }

  /* ── LOGO ────────────────────────────────────────── */
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
    user-select: none;
  }

  .nav-logo-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--acid-green);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform var(--t-fast) var(--ease-bounce),
                box-shadow var(--t-fast);
  }

  .nav-logo-mark svg {
    width: 18px;
    height: 18px;
    fill: #080810;
  }

  .nav-logo:hover .nav-logo-mark {
    transform: rotate(-8deg) scale(1.1);
    box-shadow: 0 0 20px rgba(184,255,53,0.7);
  }

  .nav-logo-text {
    display: flex;
    flex-direction: column;
    gap: 0px;
    line-height: 1;
  }

  .nav-logo-name {
    font-family: 'Unbounded', sans-serif;
    font-weight: 900;
    font-size: 1.05rem;
    letter-spacing: -0.04em;
    color: var(--text-primary);
    background: var(--grad-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }

  .nav-logo-tag {
    font-family: 'Syne', sans-serif;
    font-size: 0.52rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── CENTER LINKS ────────────────────────────────── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
  }

  .nav-links li a,
  .nav-links li button.nav-link-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 14px;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba(240,240,255,0.6);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: color var(--t-fast), background var(--t-fast);
    white-space: nowrap;
  }

  .nav-links li a:hover,
  .nav-links li button.nav-link-btn:hover {
    color: var(--text-primary);
    background: var(--bg-glass-mid);
  }

  .nav-links li a.active,
  .nav-links li button.nav-link-btn.active {
    color: var(--text-primary);
  }

  /* Active dot indicator */
  .nav-links li a.active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    background: var(--acid-green);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--acid-green);
  }

  /* Drops badge */
  .nav-drops-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 7px;
    border-radius: 999px;
    background: var(--hot-coral);
    font-family: 'Unbounded', sans-serif;
    font-size: 0.48rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1;
    animation: badge-pulse 2s ease-in-out infinite;
  }

  @keyframes badge-pulse {
    0%,100% { box-shadow: 0 0 6px rgba(255,69,87,0.4); }
    50%     { box-shadow: 0 0 14px rgba(255,69,87,0.8); }
  }

  /* ── DROPDOWN ────────────────────────────────────── */
  .nav-dropdown-wrap {
    position: relative;
  }

  .nav-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%) translateY(-8px);
    width: 220px;
    background: rgba(14,14,28,0.96);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 8px;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--t-fast) var(--ease-out),
                transform var(--t-fast) var(--ease-out);
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  }

  .nav-dropdown-wrap:hover .nav-dropdown,
  .nav-dropdown-wrap:focus-within .nav-dropdown {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }

  /* Arrow tip */
  .nav-dropdown::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px; height: 10px;
    background: rgba(14,14,28,0.96);
    border-left: 1px solid rgba(255,255,255,0.08);
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .nav-dropdown a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(240,240,255,0.65);
    text-decoration: none;
    transition: background var(--t-fast), color var(--t-fast);
  }

  .nav-dropdown a:hover {
    background: rgba(184,255,53,0.08);
    color: var(--acid-green);
  }

  .nav-dropdown-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .nav-dropdown-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 6px 4px;
  }

  /* ── RIGHT ACTIONS ───────────────────────────────── */
  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* Search pill */
  .nav-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    background: var(--bg-glass);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer;
    transition: background var(--t-fast), border-color var(--t-fast), width var(--t-mid) var(--ease-out);
  }

  .nav-search:hover {
    background: var(--bg-glass-mid);
    border-color: rgba(255,255,255,0.14);
  }

  .nav-search-text {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  /* Icon button base */
  .nav-btn-icon {
    position: relative;
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--bg-glass);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--t-fast), border-color var(--t-fast), transform var(--t-fast) var(--ease-bounce);
    color: var(--text-primary);
    font-size: 1rem;
  }

  .nav-btn-icon:hover {
    background: var(--bg-glass-mid);
    border-color: rgba(255,255,255,0.15);
    transform: scale(1.08);
  }

  .nav-btn-icon:active {
    transform: scale(0.94);
  }

  /* Cart count badge */
  .nav-cart-count {
    position: absolute;
    top: -4px; right: -4px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: var(--acid-green);
    color: #080810;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.5rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-main);
    line-height: 1;
  }

  /* Account avatar */
  .nav-avatar {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #b8ff35, #4df4ff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.65rem;
    font-weight: 900;
    color: #080810;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
    transition: transform var(--t-fast) var(--ease-bounce),
                box-shadow var(--t-fast);
  }

  .nav-avatar:hover {
    transform: scale(1.08);
    box-shadow: 0 0 18px rgba(184,255,53,0.55);
  }

  /* Logout */
  .nav-btn-logout {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 999px;
    background: rgba(255,69,87,0.1);
    border: 1px solid rgba(255,69,87,0.25);
    cursor: pointer;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--hot-coral);
    transition: background var(--t-fast), border-color var(--t-fast),
                box-shadow var(--t-fast), transform var(--t-fast) var(--ease-bounce);
  }

  .nav-btn-logout:hover {
    background: rgba(255,69,87,0.18);
    border-color: rgba(255,69,87,0.55);
    box-shadow: 0 0 20px rgba(255,69,87,0.3);
    transform: scale(1.04);
  }

  /* ── MOBILE TOGGLE ───────────────────────────────── */
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    width: 40px; height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--bg-glass);
    border: 1px solid rgba(255,255,255,0.07);
    cursor: pointer;
    transition: background var(--t-fast);
  }

  .nav-toggle:hover { background: var(--bg-glass-mid); }

  .nav-toggle-bar {
    width: 18px; height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transform-origin: center;
    transition: transform var(--t-mid) var(--ease-out),
                opacity var(--t-fast),
                width var(--t-mid) var(--ease-out);
  }

  .nav-toggle.is-open .nav-toggle-bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .nav-toggle.is-open .nav-toggle-bar:nth-child(2) {
    opacity: 0; width: 0;
  }
  .nav-toggle.is-open .nav-toggle-bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ── MOBILE MENU ─────────────────────────────────── */
  .nav-mobile {
    position: fixed;
    top: 68px;
    left: 0; right: 0;
    background: rgba(8,8,16,0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 16px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transform: translateY(-16px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--t-mid) var(--ease-out),
                transform var(--t-mid) var(--ease-out);
    z-index: 999;
  }

  .nav-mobile.is-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .nav-mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: rgba(240,240,255,0.7);
    text-decoration: none;
    border: 1px solid transparent;
    transition: background var(--t-fast), color var(--t-fast), border-color var(--t-fast);
  }

  .nav-mobile-link:hover {
    background: rgba(184,255,53,0.06);
    border-color: rgba(184,255,53,0.15);
    color: var(--text-primary);
  }

  .nav-mobile-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 8px 0;
  }

  .nav-mobile-footer {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .nav-mobile-footer button {
    flex: 1;
    padding: 13px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: opacity var(--t-fast), transform var(--t-fast) var(--ease-bounce);
  }

  .nav-mobile-footer button:hover { opacity: 0.85; transform: scale(1.02); }

  .nav-mobile-cart {
    background: rgba(77,244,255,0.12);
    color: var(--ice-blue);
    border: 1px solid rgba(77,244,255,0.2) !important;
  }

  .nav-mobile-logout {
    background: rgba(255,69,87,0.12);
    color: var(--hot-coral);
    border: 1px solid rgba(255,69,87,0.2) !important;
  }

  /* ── TICKER ──────────────────────────────────────── */
  .nav-ticker {
    position: fixed;
    top: 68px; left: 0; right: 0;
    z-index: 998;
    height: 30px;
    background: var(--acid-green);
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .nav-ticker-track {
    display: flex;
    gap: 0;
    animation: ticker 28s linear infinite;
    will-change: transform;
  }

  .nav-ticker-track:hover { animation-play-state: paused; }

  .nav-ticker-item {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 0 28px;
    font-family: 'Unbounded', sans-serif;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #080810;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .nav-ticker-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(8,8,16,0.35);
    flex-shrink: 0;
  }

  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── DEMO PAGE ───────────────────────────────────── */
  .demo-page {
    padding-top: 130px;
    padding-left: 5%;
    padding-right: 5%;
  }

  .demo-hero {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    max-width: 700px;
  }

  .demo-hero span {
    background: var(--grad-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .demo-sub {
    margin-top: 16px;
    font-size: 0.9rem;
    color: rgba(240,240,255,0.45);
    font-family: 'Syne', sans-serif;
    max-width: 360px;
    line-height: 1.6;
  }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .nav-search { display: none; }
    .nav-btn-logout { display: none; }
    .nav-toggle { display: flex; }
  }

  @media (max-width: 480px) {
    .nav { padding: 0 5%; }
    .nav-logo-tag { display: none; }
  }
`;

/* ─── SVG Logo Mark ───────────────────────────────────── */
const LogoMark = () => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    {/* Stylised "I" / fabric thread motif */}
    <rect x="3" y="2" width="14" height="2.5" rx="1.2" />
    <rect x="3" y="15.5" width="14" height="2.5" rx="1.2" />
    <rect x="8.75" y="5.5" width="2.5" height="9" rx="1.2" />
    <rect x="5.5" y="5.5" width="2.2" height="9" rx="1" opacity="0.55" />
    <rect x="12.3" y="5.5" width="2.2" height="9" rx="1" opacity="0.35" />
  </svg>
);

/* ─── Cart Icon ────────────────────────────────────────── */
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

/* ─── Wishlist Icon ───────────────────────────────────── */
const HeartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ─── Search Icon ─────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ─── Chevron ─────────────────────────────────────────── */
const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── Arrow right ────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ─── Ticker data ─────────────────────────────────────── */
const TICKER_ITEMS = [
  "Free Shipping on orders over $80",
  "New drop: The VOID collection",
  "Members get 20% off everything",
  "Limited stock on Oversized Hoodies",
  "Use code FILL15 for 15% off",
  "Next drop in 3 days",
];

/* ─── Shop Dropdown Data ─────────────────────────────── */
const SHOP_ITEMS = [
  { icon: "👕", label: "Tees & Tops", href: "/shop/tops" },
  { icon: "🧥", label: "Hoodies", href: "/shop/hoodies" },
  { icon: "👖", label: "Bottoms", href: "/shop/bottoms" },
  { icon: "🎒", label: "Accessories", href: "/shop/accessories" },
];

/* =========================================================
   NAVBAR COMPONENT
   ========================================================= */
const Navbar = ({ onLogout }) => {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [cartCount]               = useState(3);
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (path) => {
    setActivePath(path);
    setOpen(false);
  };

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop

  return (
    <>
      <style>{css}</style>

      {/* ── MAIN NAV ───────────────────────────────────── */}
      <nav className={`nav${scrolled ? " nav--scrolled" : ""}`}>

        {/* LOGO */}
        <a className="nav-logo" href="/" onClick={() => handleNav("/")}>
          <div className="nav-logo-mark">
            <LogoMark />
          </div>
          <div className="nav-logo-text">
            <span className="nav-logo-name">INFILLWEAR</span>
            <span className="nav-logo-tag">Streetwear · Est. 2024</span>
          </div>
        </a>

        {/* CENTER LINKS */}
        <ul className="nav-links">
          <li>
            <a
              href="/"
              className={activePath === "/" ? "active" : ""}
              onClick={() => handleNav("/")}
            >
              Home
            </a>
          </li>

          {/* Shop with dropdown */}
          <li className="nav-dropdown-wrap">
            <button
              className={`nav-link-btn${activePath.startsWith("/shop") ? " active" : ""}`}
              onClick={() => handleNav("/shop")}
            >
              Shop <ChevronIcon />
            </button>
            <div className="nav-dropdown">
              {SHOP_ITEMS.map((item) => (
                <a key={item.href} href={item.href}>
                  <span className="nav-dropdown-icon">{item.icon}</span>
                  {item.label}
                  <ArrowRight />
                </a>
              ))}
            </div>
          </li>

          <li>
            <a
              href="/drops"
              className={activePath === "/drops" ? "active" : ""}
              onClick={() => handleNav("/drops")}
            >
              Drops
              <span className="nav-drops-badge">LIVE</span>
            </a>
          </li>

          <li>
            <a
              href="/lookbook"
              className={activePath === "/lookbook" ? "active" : ""}
              onClick={() => handleNav("/lookbook")}
            >
              Lookbook
            </a>
          </li>

          <li>
            <a
              href="/about"
              className={activePath === "/about" ? "active" : ""}
              onClick={() => handleNav("/about")}
            >
              About
            </a>
          </li>
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">
          {/* Search */}
          <div className="nav-search" role="button" tabIndex={0}>
            <SearchIcon />
            <span className="nav-search-text">Search</span>
          </div>

          {/* Wishlist */}
          <button className="nav-btn-icon" aria-label="Wishlist">
            <HeartIcon />
          </button>

          {/* Cart */}
          <button className="nav-btn-icon" aria-label={`Cart — ${cartCount} items`}>
            <CartIcon />
            {cartCount > 0 && (
              <span className="nav-cart-count">{cartCount}</span>
            )}
          </button>

          {/* Avatar / Account */}
          <div className="nav-avatar" role="button" tabIndex={0} aria-label="Account">
            YO
          </div>

          {/* Logout (desktop) */}
          <button className="nav-btn-logout" onClick={onLogout}>
            Log out
          </button>

          {/* Mobile toggle */}
          <button
            className={`nav-toggle${open ? " is-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </nav>

      {/* ── TICKER STRIP ────────────────────────────────── */}
      <div className="nav-ticker" aria-hidden="true">
        <div className="nav-ticker-track">
          {tickerContent.map((item, i) => (
            <span className="nav-ticker-item" key={i}>
              {item}
              <span className="nav-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────────── */}
      <div className={`nav-mobile${open ? " is-open" : ""}`} aria-hidden={!open}>
        {[
          { href: "/", label: "Home", icon: "🏠" },
          { href: "/shop", label: "Shop", icon: "🛍" },
          { href: "/drops", label: "Drops", icon: "🔥", badge: "LIVE" },
          { href: "/lookbook", label: "Lookbook", icon: "📸" },
          { href: "/about", label: "About", icon: "✦" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-mobile-link"
            onClick={() => handleNav(item.href)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="nav-drops-badge">{item.badge}</span>
              )}
            </span>
            <ArrowRight />
          </a>
        ))}

        <div className="nav-mobile-divider" />

        <div className="nav-mobile-footer">
          <button className="nav-mobile-cart">
            🛒 Cart ({cartCount})
          </button>
          <button className="nav-mobile-logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Demo wrapper ─────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Navbar onLogout={() => alert("Logged out")} />
      {/* <div className="demo-page">
        <h1 className="demo-hero">
          Wear the<br /><span>void.</span>
        </h1>
        <p className="demo-sub">
          Scroll down to see the navbar glass effect activate. Resize to mobile to test the menu.
        </p>
      </div> */}
    </>
  );
}