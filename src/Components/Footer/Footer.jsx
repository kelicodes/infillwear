import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">INFILLWEAR</h2>

          <p className="footer-tagline">
            Built for the culture. Minimal fits, loud energy.
            This isn’t fashion — it’s identity.
          </p>

          {/* NEWSLETTER */}
          <div className="footer-newsletter">
            <input type="email" placeholder="Enter email" />
            <button>JOIN</button>
          </div>

          {/* SOCIALS */}
          <div className="footer-socials">
            <div className="footer-social">𝕏</div>
            <div className="footer-social">IG</div>
            <div className="footer-social">TT</div>
          </div>
        </div>

        {/* SHOP */}
        <div className="footer-col">
          <h4 className="footer-title">Shop</h4>
          <a href="#">New Drops</a>
          <a href="#">Hoodies</a>
          <a href="#">T-Shirts</a>
          <a href="#">Accessories</a>
        </div>

        {/* COMPANY */}
        <div className="footer-col">
          <h4 className="footer-title">Company</h4>
          <a href="#">About</a>
          <a href="#">Lookbook</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h4 className="footer-title">Support</h4>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">FAQs</a>
          <a href="#">Privacy</a>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 INFILLWEAR</p>
        <p>Designed for the <span>next generation</span></p>
      </div>
    </footer>
  );
};

export default Footer;