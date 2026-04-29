// Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { useNavigate } from "react-router-dom";

const STEPS = ["Pending", "Paid", "Packaged", "Out for Delivery", "Delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [imageCache, setImageCache] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ───── GET ORDERS ─────────────────────────
  const getOrders = async () => {
    try {
      const res = await axios.get(
        "https://inf-1-udgs.onrender.com/orders/userorders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ───── FETCH PRODUCT IMAGE ────────────────
  const fetchProductImage = async (productId) => {
    try {
      if (imageCache[productId]) return imageCache[productId];

      const res = await axios.get(
        `https://inf-1-udgs.onrender.com/products/fetch/${productId}`
      );

      if (res.data.success) {
        const img = res.data.theproduct?.images?.[0] || null;

        setImageCache((prev) => ({
          ...prev,
          [productId]: img,
        }));

        return img;
      }
    } catch (err) {
      console.log("Image fetch error:", err);
      return null;
    }
  };

  // ───── LOAD ORDERS ───────────────────────
  useEffect(() => {
    getOrders();
  }, []);

  // ───── PRELOAD ALL PRODUCT IMAGES ────────
  useEffect(() => {
    const loadImages = async () => {
      const allItems = orders.flatMap((o) => o.items);

      for (const item of allItems) {
        if (!imageCache[item.productId]) {
          await fetchProductImage(item.productId);
        }
      }
    };

    if (orders.length > 0) {
      loadImages();
    }
  }, [orders]);

  // ───── STATUS HELPER ─────────────────────
  const getStepClass = (current, step) => {
    const currentIndex = STEPS.indexOf(current);
    const stepIndex = STEPS.indexOf(step);

    if (stepIndex < currentIndex) return "done";
    if (stepIndex === currentIndex) return "active";
    return "";
  };

  return (
    <div className="myorders-page">

      {/* HEADER */}
      <div className="myorders-head">
        <h1>My Orders</h1>
        <p>Track all your purchases</p>
      </div>

      {/* LOADING */}
      {loading && <p className="loading">Loading orders...</p>}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="empty-orders">
          <h2>No Orders Yet</h2>
          <button onClick={() => navigate("/")}>Shop Now</button>
        </div>
      )}

      {/* ORDERS */}
      {!loading &&
        orders.map((order) => (
          <div className="order-card" key={order._id}>

            {/* TOP */}
            <div className="order-top">
              <div>
                <p className="order-id">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="order-right">
                <span className="price">
                  KES {Number(order.totalAmount).toLocaleString()}
                </span>

                <span
                  className={`status ${order.status.replace(/ /g, "-")}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* PROGRESS */}
            {order.status !== "Cancelled" && (
              <div className="progress-wrap">
                {STEPS.map((step, i) => (
                  <div className="progress-item" key={i}>
                    <div
                      className={`dot ${getStepClass(order.status, step)}`}
                    />
                    <small>{step}</small>
                  </div>
                ))}
              </div>
            )}

            {/* CANCELLED */}
            {order.status === "Cancelled" && (
              <div className="cancelled-box">
                ❌ This order was cancelled
              </div>
            )}

            {/* ITEMS */}
            <div className="items-box">
              {order.items.map((item, i) => {
                const img = imageCache[item.productId];

                return (
                  <div className="item-row" key={i}>

                    {/* ONLY render image if exists */}
                    {img && (
                      <img
                        src={img}
                        alt={item.name}
                        className="order-img"
                      />
                    )}

                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                      <span>KES {item.price}</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
    </div>
  );
}