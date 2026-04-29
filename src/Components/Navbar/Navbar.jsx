import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiArrowRight,
} from "react-icons/fi";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const navigate=useNavigate()

const Logout = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ FIX HERE

    await fetch("https://inf-1-udgs.onrender.com/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token"); // remove FIRST or AFTER request (both ok)

    navigate("/gin");

  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

  const getCartCount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return 0;

    const res = await fetch("https://inf-1-udgs.onrender.com/cart/getcart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.items) return 0;

    const totalCount = data.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return totalCount;
  } catch (error) {
    console.error("Failed to get cart count:", error);
    return 0;
  }
};

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    useEffect(() => {
  const loadCartCount = async () => {
    const count = await getCartCount();
    setTotalCount(count);
  };

  loadCartCount();
}, []);


  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className={`beo-nav ${scrolled ? "beo-nav--scrolled" : ""}`}>
        {/* LOGO */}
        <a href="/" className="beo-logo">
          <div className="beo-logo-badge">
            <svg viewBox="0 0 24 24">
              <path d="M13 2L4 14h6l-1 8 11-14h-6l-1-6z" />
            </svg>
          </div>

          <div className="beo-logo-text">
            <span className="beo-logo-name">BEO</span>
            <span className="beo-logo-sub">APPAREL & ACCESSORIES</span>
          </div>
        </a>

        {/* CENTER LINKS */}
        <ul className="beo-nav-links">
          <li>
            <a href="/" className="active">
              Home
            </a>
          </li>

          <li className="beo-dropdown-wrap">
            <button className="beo-nav-btn">
              Shop <FiChevronDown />
            </button>

            <div className="beo-dropdown">
              <a href="/tees">
                <span className="beo-dropdown-icon">👕</span>
                Tees
                <FiArrowRight className="beo-dropdown-arrow" />
              </a>

              <a href="/hoodies">
                <span className="beo-dropdown-icon">🧥</span>
                Hoodies
                <FiArrowRight className="beo-dropdown-arrow" />
              </a>

              <a href="/bottoms">
                <span className="beo-dropdown-icon">👖</span>
                Bottoms
                <FiArrowRight className="beo-dropdown-arrow" />
              </a>

              <div className="beo-dropdown-divider"></div>

              <a href="/new">
                <span className="beo-dropdown-icon">🔥</span>
                New Drop
                <FiArrowRight className="beo-dropdown-arrow" />
              </a>
            </div>
          </li>

          <li>
            <a onClick={()=>navigate("/rders")}>orders</a>
          </li>

          <li>
            <a href="/contact">Contact</a>
          </li>

          <li>
            <a href="/drops">
              Drops
              <span className="beo-live-badge">
                <span className="beo-live-dot"></span>
                Live
              </span>
            </a>
          </li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="beo-nav-actions">
          <button className="beo-search">
            <FiSearch />
            <span className="beo-search-text">Search</span>
          </button>

          <button onClick={()=>navigate("/cart")}  className="beo-icon-btn">
            <FiShoppingCart />
            <span className="beo-cart-count">{totalCount}</span>
          </button>

          <div onClick={()=>navigate("/rders")} className="beo-avatar">B</div>

          <button className="beo-cta-btn">Shop Now</button>

          {/* MOBILE BUTTON */}
          <button
            className={`beo-toggle ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{color:"white"}}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* TICKER */}
      <div className="beo-ticker">
        <div className="beo-ticker-track">
          <div className="beo-ticker-item">
          BEO EXCLUSIVE
            <span className="beo-ticker-sep"></span>
            NEW DROP LIVE NOW
            <span className="beo-ticker-sep"></span>
            PREMIUM STREETWEAR
            <span className="beo-ticker-sep"></span>
            
             FREE SHIPPING AROUND KOMAROCK
          </div>

          <div className="beo-ticker-item">
            FREE SHIPPING OVER ksh500
            <span className="beo-ticker-sep"></span>
            NEW DROP LIVE NOW
            <span className="beo-ticker-sep"></span>
            PREMIUM STREETWEAR
            <span className="beo-ticker-sep"></span>
            
             FREE SHIPPING AROUND KOMAROCK
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
     <div className={`beo-mobile-menu ${menuOpen ? "is-open" : ""}`}>

  <Link to="/" className="beo-mobile-link" onClick={closeMenu}>
    <span className="beo-mobile-link-left">
      <span className="beo-mobile-icon"></span>
      Home
    </span>
  </Link>

  <Link to="/collection" className="beo-mobile-link" onClick={closeMenu}>
    <span className="beo-mobile-link-left">
      <span className="beo-mobile-icon"></span>
      Shop
    </span>
  </Link>

  <Link to="/rders" className="beo-mobile-link" onClick={closeMenu}>
    <span className="beo-mobile-link-left">
      <span className="beo-mobile-icon"></span>
      orders
    </span>
  </Link>

 <Link to="/#location" className="beo-mobile-link" onClick={closeMenu}>
 <span className="beo-mobile-link-left">
      <span className="beo-mobile-icon"></span>
  Location
  </span>
</Link>

  <div className="beo-mobile-divider"></div>

  <div className="beo-mobile-footer">
   

    <button onClick={Logout}  className="beo-mobile-logout-btn">
      Logout
    </button>
  </div>

</div>
    </>
  );
}