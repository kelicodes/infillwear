import { useEffect, useState } from "react";
import "./Hero.css";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(1842);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 120);

    const live = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(live);
    };
  }, []);

  return (
    <section className={`neo-hero ${loaded ? "neo-hero--show" : ""}`}>
      {/* Background */}
      <div className="neo-hero__bg">
        <span className="neo-orb neo-orb--1" />
        <span className="neo-orb neo-orb--2" />
        <span className="neo-orb neo-orb--3" />
        <div className="neo-grid" />
      </div>

      <div className="neo-hero__wrap">
        {/* LEFT */}
        <div className="neo-hero__content">
          <div className="neo-badge fade fade-1">
            <span className="neo-badge__dot" />
            {count.toLocaleString()} people shopping now
          </div>

          <p className="neo-kicker fade fade-2">NEW STREETWEAR DROP</p>

          <h1 className="neo-title fade fade-3">
            Wear What
            <span> Moves You</span>
          </h1>

          <p className="neo-text fade fade-4">
            Built for bold people. Clean cuts, oversized comfort, premium
            texture and pieces made to stand out every day.
          </p>

          <div className="neo-actions fade fade-5">
            <a href="/shop" className="neo-btn neo-btn--main">
              Shop Now
            </a>

            <a href="/collection" className="neo-btn neo-btn--ghost">
              Explore
            </a>
          </div>

          <div className="neo-stats fade fade-6">
            <div>
              <strong>18K+</strong>
              <span>Orders</span>
            </div>

            <div>
              <strong>4.9★</strong>
              <span>Rated</span>
            </div>

            <div>
              <strong>48H</strong>
              <span>Delivery</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="neo-hero__visual fade-visual">
          <div className="neo-card">
            <span className="neo-sale">-30%</span>

            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
              alt="Streetwear"
            />

            <div className="neo-card__info">
              <h3>Oversized Tee</h3>
              <p>Premium Cotton</p>

              <div className="neo-price">
                <span>KSH39</span>
                <small>KSH56</small>
              </div>
            </div>
          </div>

          <div className="neo-floating neo-floating--left">
            🔥 Trending
          </div>

          <div className="neo-floating neo-floating--right">
            Only 7 left
          </div>
        </div>
      </div>

      {/* ticker */}
      <div className="neo-strip">
        <div className="neo-strip__track">
          {[
            "FREE SHIPPING",
            "NEW DROP LIVE",
            "LIMITED EDITION",
            "MEMBERS SAVE 20%",
            "PREMIUM QUALITY",
            "SHOP NOW",
            "FREE SHIPPING",
            "NEW DROP LIVE",
            "LIMITED EDITION",
            "MEMBERS SAVE 20%",
          ].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;