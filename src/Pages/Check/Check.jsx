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

  // ── Fetch cart ──────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API}/cart/getcart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = total > 5000 ? 0 : 300;
  const grandTotal = total + shipping;

  // ── Field change ────────────────────────────────────────
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  // ── Validation per step ──────────────────────────────────
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
      if (form.paymentMethod === "mpesa" && !form.mpesaNumber.trim())
        newErrors.mpesaNumber = "Enter M-Pesa number";
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
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // ── Place order ──────────────────────────────────────────
  const placeOrder = async () => {
    setPlacing(true);
    try {
      await fetch(`${API}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, items, total: grandTotal }),
      });
      setSuccess(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // ── Success Screen ───────────────────────────────────────
  if (success) {
    return (
      <div className="checkout-page section">
        <div className="container">
          <div className="checkout-success">
            <div className="success-icon">✓</div>
            <h1>ORDER PLACED</h1>
            <p>
              Thank you, {form.firstName}. Your order is confirmed and will be
              delivered to {form.city}.
            </p>
            <div className="success-total">KES {grandTotal.toLocaleString()}</div>
            <a href="/" className="btn-back-home">
              CONTINUE SHOPPING
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section">
      <div className="container">

        {/* ── Step Progress ── */}
        <div className="checkout-progress">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`progress-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            >
              <div className="step-dot">
                {i < step ? "✓" : <span>{i + 1}</span>}
              </div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* ── Main layout ── */}
        <div className="checkout-layout">

          {/* ── LEFT: Form panel ── */}
          <div className="checkout-form-panel">

            {/* STEP 0: Delivery */}
            {step === 0 && (
              <div className="form-section animate-fade-up">
                <h2 className="form-section-title">Delivery Details</h2>

                <div className="form-row two-col">
                  <div className="field-group">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={errors.firstName ? "input-error" : ""}
                    />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>
                  <div className="field-group">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={errors.lastName ? "input-error" : ""}
                    />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className="field-group">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="field-group">
                    <label>Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="07XX XXX XXX"
                      className={errors.phone ? "input-error" : ""}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label>Street Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Kimathi St, Apt 4B"
                    className={errors.address ? "input-error" : ""}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="form-row three-col">
                  <div className="field-group">
                    <label>City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Nairobi"
                      className={errors.city ? "input-error" : ""}
                    />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="field-group">
                    <label>County</label>
                    <input
                      name="county"
                      value={form.county}
                      onChange={handleChange}
                      placeholder="Nairobi County"
                      className={errors.county ? "input-error" : ""}
                    />
                    {errors.county && <span className="field-error">{errors.county}</span>}
                  </div>
                  <div className="field-group">
                    <label>Postal Code</label>
                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="00100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="form-section animate-fade-up">
                <h2 className="form-section-title">Payment Method</h2>

                <div className="payment-options">
                  <label
                    className={`payment-option ${form.paymentMethod === "mpesa" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={form.paymentMethod === "mpesa"}
                      onChange={handleChange}
                    />
                    <div className="payment-option-inner">
                      <span className="payment-icon">📱</span>
                      <div>
                        <strong>M-Pesa</strong>
                        <p>Pay via Safaricom M-Pesa STK push</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${form.paymentMethod === "card" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={handleChange}
                    />
                    <div className="payment-option-inner">
                      <span className="payment-icon">💳</span>
                      <div>
                        <strong>Card</strong>
                        <p>Visa / Mastercard</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${form.paymentMethod === "cod" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={handleChange}
                    />
                    <div className="payment-option-inner">
                      <span className="payment-icon">🏠</span>
                      <div>
                        <strong>Pay on Delivery</strong>
                        <p>Cash or card at your door</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* M-Pesa fields */}
                {form.paymentMethod === "mpesa" && (
                  <div className="payment-fields animate-fade-up">
                    <div className="field-group">
                      <label>M-Pesa Number</label>
                      <input
                        name="mpesaNumber"
                        value={form.mpesaNumber}
                        onChange={handleChange}
                        placeholder="07XX XXX XXX"
                        className={errors.mpesaNumber ? "input-error" : ""}
                      />
                      {errors.mpesaNumber && (
                        <span className="field-error">{errors.mpesaNumber}</span>
                      )}
                      <span className="field-hint">
                        You'll receive an STK push prompt to confirm payment.
                      </span>
                    </div>
                  </div>
                )}

                {/* Card fields */}
                {form.paymentMethod === "card" && (
                  <div className="payment-fields animate-fade-up">
                    <div className="field-group">
                      <label>Card Number</label>
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={errors.cardNumber ? "input-error" : ""}
                      />
                      {errors.cardNumber && (
                        <span className="field-error">{errors.cardNumber}</span>
                      )}
                    </div>
                    <div className="form-row two-col">
                      <div className="field-group">
                        <label>Expiry</label>
                        <input
                          name="cardExpiry"
                          value={form.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM / YY"
                          maxLength={7}
                          className={errors.cardExpiry ? "input-error" : ""}
                        />
                        {errors.cardExpiry && (
                          <span className="field-error">{errors.cardExpiry}</span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>CVV</label>
                        <input
                          name="cardCvv"
                          value={form.cardCvv}
                          onChange={handleChange}
                          placeholder="•••"
                          maxLength={4}
                          className={errors.cardCvv ? "input-error" : ""}
                        />
                        {errors.cardCvv && (
                          <span className="field-error">{errors.cardCvv}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Confirm */}
            {step === 2 && (
              <div className="form-section animate-fade-up">
                <h2 className="form-section-title">Review Your Order</h2>

                <div className="confirm-block">
                  <h3 className="confirm-block-title">Delivering to</h3>
                  <p className="confirm-value">
                    {form.firstName} {form.lastName}
                  </p>
                  <p className="confirm-value">{form.address}</p>
                  <p className="confirm-value">
                    {form.city}, {form.county}
                  </p>
                  <p className="confirm-value">{form.phone}</p>
                </div>

                <div className="confirm-block">
                  <h3 className="confirm-block-title">Payment</h3>
                  <p className="confirm-value confirm-value--accent">
                    {form.paymentMethod === "mpesa"
                      ? `M-Pesa — ${form.mpesaNumber}`
                      : form.paymentMethod === "card"
                      ? `Card ending ••${form.cardNumber.slice(-4)}`
                      : "Pay on Delivery"}
                  </p>
                </div>

                <div className="confirm-items">
                  <h3 className="confirm-block-title">Items ({items.length})</h3>
                  {items.map((item) => (
                    <div className="confirm-item" key={item.productId}>
                      <img src={item.image} alt={item.name} />
                      <div className="confirm-item-info">
                        <span>{item.name}</span>
                        <span>×{item.quantity}</span>
                      </div>
                      <span className="confirm-item-price">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="checkout-nav">
              {step > 0 && (
                <button className="btn-back" onClick={prevStep}>
                  ← BACK
                </button>
              )}

              {step < 2 ? (
                <button className="btn-next" onClick={nextStep}>
                  {step === 0 ? "PAYMENT →" : "REVIEW ORDER →"}
                </button>
              ) : (
                <button
                  className="btn-place-order"
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <span className="spinner" />
                  ) : (
                    `PLACE ORDER — KES ${grandTotal.toLocaleString()}`
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <aside className="checkout-summary">
            <h2 className="summary-title">ORDER SUMMARY</h2>

            {loading ? (
              <div className="skeleton" style={{ height: 120, borderRadius: 8 }} />
            ) : (
              <div className="summary-items">
                {items.map((item) => (
                  <div className="summary-item" key={item.productId}>
                    <div className="summary-item-img-wrap">
                      <img src={item.image} alt={item.name} />
                      <span className="summary-item-qty">{item.quantity}</span>
                    </div>
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-price">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>KES {total.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "free-shipping" : ""}>
                {shipping === 0 ? "FREE" : `KES ${shipping}`}
              </span>
            </div>

            {shipping === 0 && (
              <div className="free-shipping-badge">
                🎉 Free delivery on orders above KES 5,000
              </div>
            )}

            <div className="divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>KES {grandTotal.toLocaleString()}</span>
            </div>

            <div className="summary-secure">
              <span>🔒</span>
              <span>Secured checkout — BEO Apparel</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;