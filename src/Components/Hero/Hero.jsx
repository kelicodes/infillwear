import { useEffect, useState, useRef } from "react";
import "./Hero.css";

/* ─── Animated SVG Illustration ──────────────────────────── */
const HeroIllustration = () => (
  <svg
    className="hero-illustration"
    viewBox="0 0 480 580"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="tshirt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b8ff35" />
        <stop offset="100%" stopColor="#4df4ff" />
      </linearGradient>
      <linearGradient id="hoodie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0e0e1c" />
        <stop offset="100%" stopColor="#141428" />
      </linearGradient>
      <linearGradient id="sleeve-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4df4ff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#b8ff35" stopOpacity="0.6" />
      </linearGradient>
      <filter id="glow-green">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-coral">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="soft-shadow">
        <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="#000" floodOpacity="0.5" />
      </filter>
      <clipPath id="card-clip">
        <rect x="60" y="60" width="360" height="460" rx="24" />
      </clipPath>
    </defs>

    {/* ── BACKGROUND CARD ──────────────────────────────── */}
    <rect
      className="illus-card"
      x="60" y="60" width="360" height="460" rx="24"
      fill="#0e0e1c"
      stroke="rgba(255,255,255,0.08)"
      strokeWidth="1"
      filter="url(#soft-shadow)"
    />

    {/* ── AMBIENT BG CIRCLES ───────────────────────────── */}
    <circle
      className="illus-orb illus-orb--1"
      cx="240" cy="200" r="130"
      fill="rgba(184,255,53,0.06)"
    />
    <circle
      className="illus-orb illus-orb--2"
      cx="320" cy="350" r="80"
      fill="rgba(77,244,255,0.05)"
    />

    {/* ── OVERSIZED HOODIE SILHOUETTE ───────────────────── */}
    <g className="illus-garment" filter="url(#soft-shadow)">
      {/* Main body */}
      <path
        d="M 155 185 L 155 420 Q 155 435 170 435 L 310 435 Q 325 435 325 420 L 325 185 Z"
        fill="url(#hoodie-grad)"
        stroke="rgba(184,255,53,0.18)"
        strokeWidth="1.5"
      />
      {/* Left sleeve */}
      <path
        d="M 155 185 L 100 175 Q 82 173 80 195 L 88 280 Q 90 295 108 297 L 155 290 Z"
        fill="#0e0e1c"
        stroke="rgba(184,255,53,0.15)"
        strokeWidth="1.5"
      />
      {/* Right sleeve */}
      <path
        d="M 325 185 L 380 175 Q 398 173 400 195 L 392 280 Q 390 295 372 297 L 325 290 Z"
        fill="#0e0e1c"
        stroke="rgba(184,255,53,0.15)"
        strokeWidth="1.5"
      />
      {/* Hood */}
      <path
        d="M 185 185 Q 185 140 240 135 Q 295 140 295 185"
        fill="#141428"
        stroke="rgba(184,255,53,0.2)"
        strokeWidth="2"
      />
      {/* Hood inner shadow */}
      <path
        d="M 200 185 Q 200 155 240 150 Q 280 155 280 185"
        fill="rgba(0,0,0,0.4)"
      />
      {/* Front pocket */}
      <path
        d="M 195 330 Q 195 360 240 360 Q 285 360 285 330 L 285 310 L 195 310 Z"
        fill="rgba(184,255,53,0.05)"
        stroke="rgba(184,255,53,0.2)"
        strokeWidth="1"
      />
    </g>

    {/* ── CHEST GRAPHIC ────────────────────────────────── */}
    <g className="illus-chest-logo" filter="url(#glow-green)">
      {/* Outer ring */}
      <circle cx="240" cy="260" r="38" fill="none" stroke="url(#tshirt-grad)" strokeWidth="1.5" />
      {/* Inner ring */}
      <circle cx="240" cy="260" r="30" fill="none" stroke="rgba(184,255,53,0.3)" strokeWidth="0.8" />
      {/* INFILL wordmark center */}
      <text
        x="240" y="255"
        textAnchor="middle"
        fontFamily="Unbounded, sans-serif"
        fontWeight="900"
        fontSize="8.5"
        fill="url(#tshirt-grad)"
        letterSpacing="2"
      >
        INFILL
      </text>
      <text
        x="240" y="268"
        textAnchor="middle"
        fontFamily="Unbounded, sans-serif"
        fontWeight="400"
        fontSize="6"
        fill="rgba(184,255,53,0.6)"
        letterSpacing="4"
      >
        WEAR
      </text>
      {/* Small dots on ring */}
      <circle cx="240" cy="222" r="2.5" fill="#b8ff35" />
      <circle cx="278" cy="260" r="2.5" fill="#4df4ff" />
      <circle cx="240" cy="298" r="2.5" fill="#b8ff35" />
      <circle cx="202" cy="260" r="2.5" fill="#4df4ff" />
    </g>

    {/* ── FLOATING ACCENT SHAPES ───────────────────────── */}
    {/* Top-right corner accent */}
    <g className="illus-accent illus-accent--tr">
      <rect x="360" y="80" width="40" height="40" rx="8"
        fill="none" stroke="rgba(77,244,255,0.4)" strokeWidth="1.5"
        transform="rotate(15 380 100)"
      />
      <rect x="368" y="88" width="24" height="24" rx="5"
        fill="rgba(77,244,255,0.08)"
        transform="rotate(15 380 100)"
      />
    </g>

    {/* Bottom-left star */}
    <g className="illus-accent illus-accent--bl">
      <circle cx="95" cy="450" r="18" fill="none" stroke="rgba(255,69,87,0.5)" strokeWidth="1.5" />
      <circle cx="95" cy="450" r="8" fill="rgba(255,69,87,0.12)" />
      <line x1="95" y1="432" x2="95" y2="432" stroke="#ff4557" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Dot grid top-left */}
    <g className="illus-dots" opacity="0.35">
      {[0,1,2,3].map(row =>
        [0,1,2,3].map(col => (
          <circle
            key={`${row}-${col}`}
            cx={75 + col * 10}
            cy={80 + row * 10}
            r="1.5"
            fill="#b8ff35"
          />
        ))
      )}
    </g>

    {/* ── FLOATING TAGS ────────────────────────────────── */}
    {/* Trending tag */}
    <g className="illus-tag illus-tag--fire" filter="url(#glow-coral)">
      <rect x="290" y="100" width="105" height="32" rx="16"
        fill="#ff4557"
      />
      <text x="343" y="121" textAnchor="middle"
        fontFamily="Unbounded, sans-serif" fontWeight="700" fontSize="8"
        fill="white" letterSpacing="1"
      >
        🔥 TRENDING NOW
      </text>
    </g>

    {/* New drop tag */}
    <g className="illus-tag illus-tag--green">
      <rect x="68" y="120" width="88" height="26" rx="13"
        fill="rgba(184,255,53,0.12)"
        stroke="rgba(184,255,53,0.4)"
        strokeWidth="1"
      />
      <text x="112" y="137" textAnchor="middle"
        fontFamily="Unbounded, sans-serif" fontWeight="700" fontSize="7"
        fill="#b8ff35" letterSpacing="0.5"
      >
        ✦ NEW DROP
      </text>
    </g>

    {/* ── BOTTOM PRICE STRIP ───────────────────────────── */}
    <g className="illus-price-strip">
      <rect x="80" y="452" width="320" height="52" rx="14"
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
      <text x="108" y="472" textAnchor="start"
        fontFamily="Unbounded, sans-serif" fontWeight="900" fontSize="14"
        fill="white"
      >
        $89
      </text>
      <text x="135" y="471" textAnchor="start"
        fontFamily="Unbounded, sans-serif" fontWeight="400" fontSize="9"
        fill="rgba(255,255,255,0.3)"
        style={{ textDecoration: "line-through" }}
      >
        $130
      </text>
      <text x="108" y="489" textAnchor="start"
        fontFamily="Syne, sans-serif" fontWeight="600" fontSize="8"
        fill="rgba(255,255,255,0.4)"
      >
        Oversized Infill Hoodie
      </text>
      {/* Add to cart mini button */}
      <rect x="310" y="460" width="76" height="30" rx="15"
        fill="#b8ff35"
      />
      <text x="348" y="479" textAnchor="middle"
        fontFamily="Unbounded, sans-serif" fontWeight="700" fontSize="7"
        fill="#080810" letterSpacing="0.5"
      >
        ADD TO BAG
      </text>
    </g>

    {/* ── COLOUR SWATCHES ──────────────────────────────── */}
    <g className="illus-swatches">
      {[
        { cx: 165, color: "#080810", stroke: "#b8ff35" },
        { cx: 183, color: "#1a1a2e", stroke: "rgba(255,255,255,0.2)" },
        { cx: 201, color: "#ff4557", stroke: "rgba(255,255,255,0.2)" },
        { cx: 219, color: "#b8ff35", stroke: "rgba(255,255,255,0.2)" },
      ].map((s, i) => (
        <circle key={i} cx={s.cx} cy={443} r="6"
          fill={s.color}
          stroke={s.stroke}
          strokeWidth="1.5"
        />
      ))}
    </g>

    {/* ── WATCHERS PILL ────────────────────────────────── */}
    <g className="illus-watchers">
      <rect x="68" y="434" width="82" height="20" rx="10"
        fill="rgba(8,8,16,0.8)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <circle cx="79" cy="444" r="4" fill="#ff4557" />
      <text x="87" y="448.5" textAnchor="start"
        fontFamily="Syne, sans-serif" fontWeight="600" fontSize="7"
        fill="rgba(255,255,255,0.7)"
      >
        2.4k watching
      </text>
    </g>
  </svg>
);

/* ─── HERO COMPONENT ──────────────────────────────────────── */
const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(2841);
  const heroRef = useRef(null);

  useEffect(() => {
    // Staggered load trigger
    const t = setTimeout(() => setLoaded(true), 80);

    // Live viewer count flicker (social proof psychology)
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3 - 1));
    }, 2800);

    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className={`hero ${loaded ? "hero--in" : ""}`} ref={heroRef}>

      {/* ── AMBIENT BACKGROUND ORBS ────────────────────── */}
      <div className="hero__orbs" aria-hidden="true">
        <div className="hero__orb hero__orb--a" />
        <div className="hero__orb hero__orb--b" />
        <div className="hero__orb hero__orb--c" />
      </div>

      {/* ── GRID LINES (streetwear editorial texture) ─── */}
      <div className="hero__grid" aria-hidden="true" />

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="hero__inner">

        {/* LEFT — COPY ──────────────────────────────────── */}
        <div className="hero__copy">

          {/* Live badge */}
          <div className="hero__live-badge hero__anim hero__anim--1">
            <span className="hero__live-dot" />
            <span>{count.toLocaleString()} people shopping right now</span>
          </div>

          {/* Eyebrow */}
          <p className="hero__eyebrow hero__anim hero__anim--2">
            The New Drop Is Here
          </p>

          {/* Main headline — UNFORGETTABLE */}
          <h1 className="hero__headline hero__anim hero__anim--3">
            Dress like
            <br />
            <span className="hero__headline-accent">nobody's</span>
            <br />
            watching.
          </h1>

          {/* Supporting copy — authentic, Gen Z native */}
          <p className="hero__body hero__anim hero__anim--4">
            INFILLWEAR is built for the ones who don't follow trends —
            they start them. Oversized fits, raw textures, and pieces
            that actually last. No filler. Just fill.
          </p>

          {/* CTA row */}
          <div className="hero__ctas hero__anim hero__anim--5">
            <a href="/collection" className="hero__cta-primary">
              Shop The Drop
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="/lookbook" className="hero__cta-ghost">
              See Lookbook
            </a>
          </div>

          {/* Social proof numbers */}
          <div className="hero__proof hero__anim hero__anim--6">
            <div className="hero__proof-item">
              <span className="hero__proof-num">18K+</span>
              <span className="hero__proof-label">Orders This Month</span>
            </div>
            <div className="hero__proof-sep" />
            <div className="hero__proof-item">
              <span className="hero__proof-num">4.9★</span>
              <span className="hero__proof-label">Average Rating</span>
            </div>
            <div className="hero__proof-sep" />
            <div className="hero__proof-item">
              <span className="hero__proof-num">48H</span>
              <span className="hero__proof-label">Free Shipping</span>
            </div>
          </div>
        </div>

        {/* RIGHT — ILLUSTRATION ─────────────────────────── */}
        <div className="hero__visual hero__anim hero__anim--vis">
          {/* Glow halo behind illustration */}
          <div className="hero__halo" aria-hidden="true" />

          {/* Floating urgency pill */}
          <div className="hero__urgency">
            <span className="hero__urgency-fire">🔥</span>
            <div>
              <span className="hero__urgency-top">Only 7 left</span>
              <span className="hero__urgency-sub">in your size</span>
            </div>
          </div>

          {/* The SVG illustration */}
          <HeroIllustration />

          {/* Floating discount chip */}
          <div className="hero__discount">
            <span className="hero__discount-pct">−31%</span>
            <span className="hero__discount-label">TODAY ONLY</span>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BRAND TICKER ─────────────────────────── */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {[
            "FREE SHIPPING OVER $80",
            "✦ NEW DROP: THE VOID COLLECTION",
            "MEMBERS SAVE 20%",
            "4.9★ RATED BY 12K CUSTOMERS",
            "OVERSIZED. AUTHENTIC. YOURS.",
            "USE CODE FILL15 FOR 15% OFF",
          ].concat([
            "FREE SHIPPING OVER $80",
            "✦ NEW DROP: THE VOID COLLECTION",
            "MEMBERS SAVE 20%",
            "4.9★ RATED BY 12K CUSTOMERS",
            "OVERSIZED. AUTHENTIC. YOURS.",
            "USE CODE FILL15 FOR 15% OFF",
          ]).map((item, i) => (
            <span key={i} className="hero__ticker-item">
              {item}
              <span className="hero__ticker-dot" />
            </span>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;