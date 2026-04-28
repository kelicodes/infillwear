import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { toast } from "react-toastify";

const API = "https://inf-1-udgs.onrender.com";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        setItems([]);
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/cart/getcart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.log("Invalid JSON:", text);
        setItems([]);
        setLoading(false);
        return;
      }

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
    } catch (error) {
      console.log("Fetch cart error:", error);
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
    } catch (error) {
      console.log("Update cart error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="cart-page section">
      <div className="container">

        <div className="cart-header">
          <h1>YOUR CART</h1>

          {items.length > 0 && (
            <button
              className="clear-btn"
              onClick={() => updateCart("/cart/clear")}
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
                <div className="cart-card" key={item._id}>

                  <img
                    src={item.productId.images?.[0]}
                    alt={item.productId.name}
                  />

                  <div className="cart-info">
                    <h3>{item.productId.name}</h3>
                    <p>KES {item.productId.price}</p>

                    <div className="qty">
                      <button
                        onClick={() =>
                          updateCart("/cart/decrease", {
                            productId: item.productId._id,
                          })
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateCart("/cart/increase", {
                            productId: item.productId._id,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      updateCart("/cart/remove", {
                        productId: item.productId._id,
                      })
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
                className="checkout-btn"
                onClick={() => navigate("/check")}
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