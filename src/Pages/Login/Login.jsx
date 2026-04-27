import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = "https://inf-1-udgs.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveToken = (token) => {
    localStorage.setItem("token", token);
  };

  const logout = async () => {
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
      });
    } catch (error) {}

    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.me);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url =
      mode === "login" ? `${API}/user/login` : `${API}/user/reg`;

    const payload =
      mode === "login"
        ? {
            email: form.email,
            password: form.password,
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (data.token) {
          saveToken(data.token);
          await fetchMe();
          navigate("/");
        }
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  if (user) {
    return (
      <section className="auth-page section">
        <div className="auth-box glass-elevated">
          <h2 className="text-gradient">Welcome</h2>
          <p>You are logged in as {user.name}</p>

          <div className="divider"></div>

          <button className="btn btn-primary auth-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page section">
      <div className="auth-box glass-elevated">
        <h2 className="text-gradient">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <p>
          {mode === "login"
            ? "Sign in to continue shopping."
            : "Join our store today."}
        </p>

        <form className="auth-form" onSubmit={submitHandler}>
          {mode === "register" && (
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={changeHandler}
              />
            </div>
          )}

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={changeHandler}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={changeHandler}
              required
            />
          </div>

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading
              ? "Please Wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <button
          className="switch-btn"
          onClick={() =>
            setMode(mode === "login" ? "register" : "login")
          }
        >
          {mode === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </section>
  );
}