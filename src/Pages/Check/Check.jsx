import { useEffect, useState } from "react";
import "./Check.css";

const API = "https://inf-1-udgs.onrender.com";
const STEPS = ["DELIVERY", "PAYMENT", "CONFIRM"];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
    paymentMethod: "mpesa",
    mpesaNumber: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API}/cart/getcart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setItems(data?.items || []);
      } catch (error) {
        console.log(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const total = items.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const shipping = total > 5000 ? 0 : 300;
  const grandTotal = total + shipping;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      if (!form.firstName.trim()) newErrors.firstName = "Required";
      if (!form.lastName.trim()) newErrors.lastName = "Required";
      if (!form.email.trim()) newErrors.email = "Required";
      if (!form.phone.trim()) newErrors.phone = "Required";
      if (!form.address.trim()) newErrors.address = "Required";
      if (!form.city.trim()) newErrors.city = "Required";
      if (!form.county.trim()) newErrors.county = "Required";
    }

    if (step === 1) {
      if (form.paymentMethod === "mpesa" && !form.mpesaNumber.trim()) {
        newErrors.mpesaNumber = "Required";
      }

      if (form.paymentMethod === "card") {
        if (!form.cardNumber.trim()) newErrors.cardNumber = "Required";
        if (!form.cardExpiry.trim()) newErrors.cardExpiry = "Required";
        if (!form.cardCvv.trim()) newErrors.cardCvv = "Required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const placeOrder = async () => {
  setPlacing(true);

  try {
    const payload = {
      paymentMethod: form.paymentMethod,
      shippingAddress: {
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        apartment: form.address,
        doorNumber: form.postalCode || "N/A",
      },
    };

    const res = await fetch(`${API}/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to place order");
      return;
    }

    // CLEAR CART AFTER SUCCESSFUL ORDER
    await fetch(`${API}/cart/clear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setItems([]);
    setSuccess(true);

  } catch (error) {
    console.log(error);
    alert("Failed to place order");
  } finally {
    setPlacing(false);
  }
};
  if (success) {
    return (
      <div className="checkout-page section">
        <div className="container">
          <div className="checkout-success">
            <div className="success-icon">✓</div>
            <h1>ORDER PLACED</h1>
            <p>Thank you {form.firstName}, your order was successful.</p>
            <p className="success-total">
              KES {grandTotal.toLocaleString()}
            </p>
            <a href="/" className="btn-back-home">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section">
      <div className="container">

        <div className="checkout-progress">
          {STEPS.map((label, index) => (
            <div
              key={label}
              className={`progress-step ${
                step === index ? "active" : ""
              } ${index < step ? "done" : ""}`}
            >
              <div className="step-dot">
                {index < step ? "✓" : index + 1}
              </div>

              <span className="step-label">{label}</span>

              {index < STEPS.length - 1 && (
                <div className="step-line"></div>
              )}
            </div>
          ))}
        </div>

        <div className="checkout-layout">

          <div className="checkout-form-panel">

            {step === 0 && (
              <div className="form-section">
                <h2 className="form-section-title">
                  Delivery Details
                </h2>

                <div className="form-row two-col">
                  <div className="field-group">
                    <input
                      name="firstName"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "input-error" : ""}
                    />
                  </div>

                  <div className="field-group">
                    <input
                      name="lastName"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "input-error" : ""}
                    />
                  </div>
                </div>

                <div className="form-row two-col">
                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={errors.phone ? "input-error" : ""}
                  />
                </div>

                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className={errors.address ? "input-error" : ""}
                />

                <div className="form-row two-col">
                  <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className={errors.city ? "input-error" : ""}
                  />

                  <input
                    name="county"
                    placeholder="County"
                    value={form.county}
                    onChange={handleChange}
                    className={errors.county ? "input-error" : ""}
                  />
                </div>

                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            )}

            {step === 1 && (
              <div className="form-section">
                <h2 className="form-section-title">
                  Payment Method
                </h2>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="card">Card</option>
                  <option value="cod">Pay on Delivery</option>
                </select>

                {form.paymentMethod === "mpesa" && (
                  <input
                    name="mpesaNumber"
                    placeholder="M-Pesa Number"
                    value={form.mpesaNumber}
                    onChange={handleChange}
                    className={errors.mpesaNumber ? "input-error" : ""}
                  />
                )}

                {form.paymentMethod === "card" && (
                  <>
                    <input
                      name="cardNumber"
                      placeholder="Card Number"
                      value={form.cardNumber}
                      onChange={handleChange}
                      className={errors.cardNumber ? "input-error" : ""}
                    />

                    <input
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={form.cardExpiry}
                      onChange={handleChange}
                      className={errors.cardExpiry ? "input-error" : ""}
                    />

                    <input
                      name="cardCvv"
                      placeholder="CVV"
                      value={form.cardCvv}
                      onChange={handleChange}
                      className={errors.cardCvv ? "input-error" : ""}
                    />
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h2 className="form-section-title">
                  Confirm Order
                </h2>

                {items.map((item) => (
                  <div className="confirm-item" key={item._id}>
                    <img
                      src={item.productId.images?.[0]}
                      alt={item.productId.name}
                    />

                    <div className="confirm-item-info">
                      <span>{item.productId.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>

                    <span className="confirm-item-price">
                      KES{" "}
                      {(
                        item.productId.price * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="checkout-nav">
              {step > 0 && (
                <button className="btn-back" onClick={prevStep}>
                  Back
                </button>
              )}

              {step < 2 ? (
                <button className="btn-next" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button
                  className="btn-place-order"
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing
                    ? "Placing..."
                    : `Place Order - KES ${grandTotal.toLocaleString()}`}
                </button>
              )}
            </div>
          </div>

          <aside className="checkout-summary">
            <h2 className="summary-title">Order Summary</h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="summary-items">
                {items.map((item) => (
                  <div className="summary-item" key={item._id}>
                    <div className="summary-item-img-wrap">
                      <img
                        src={item.productId.images?.[0]}
                        alt={item.productId.name}
                      />
                      <span className="summary-item-qty">
                        {item.quantity}
                      </span>
                    </div>

                    <span className="summary-item-name">
                      {item.productId.name}
                    </span>

                    <span className="summary-item-price">
                      KES{" "}
                      {(
                        item.productId.price * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>KES {total.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "FREE"
                  : `KES ${shipping.toLocaleString()}`}
              </span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>KES {grandTotal.toLocaleString()}</span>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;