import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const API = "https://inf-1-udgs.onrender.com";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/cart/getcart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ⚠️ safe parse (prevents HTML crash)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Server returned non-JSON:", text);
        setItems([]);
        setLoading(false);
        return;
      }

      // ❌ invalid token / auth error → logout user
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        console.log("Cart error:", data);
        setItems([]);
        return;
      }

      setItems(data?.items || []);
    } catch (err) {
      console.log("Cart fetch error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (url, body = {}) => {
    try {
      await fetch(`${API}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      fetchCart();
    } catch (err) {
      console.log("Cart update error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page section">
      <div className="container">

        <div className="cart-header">
          <h1>YOUR CART</h1>

          {items.length > 0 && (
            <button
              onClick={() => updateCart("/cart/clear")}
              className="clear-btn"
            >
              CLEAR CART
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add products to continue shopping</p>
          </div>
        ) : (
          <>
            <div className="cart-grid">

              {items.map((item) => (
                <div className="cart-card" key={item.productId}>

                  <img src={item.image} alt={item.name} />

                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>KES {item.price}</p>

                    <div className="qty">
                      <button onClick={() =>
                        updateCart("/cart/decrease", { productId: item.productId })
                      }>
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() =>
                        updateCart("/cart/increase", { productId: item.productId })
                      }>
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      updateCart("/cart/remove", { productId: item.productId })
                    }
                  >
                    REMOVE
                  </button>

                </div>
              ))}

            </div>

            <div className="cart-summary">
              <h2>ORDER SUMMARY</h2>

              <div className="row">
                <span>Total Items</span>
                <span>{items.length}</span>
              </div>

              <div className="row">
                <span>Total Price</span>
                <span>KES {total}</span>
              </div>

              <button
                onClick={() => navigate("/check")}
                className="checkout-btn"
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Cart;