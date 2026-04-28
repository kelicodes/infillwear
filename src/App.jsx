import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import ProductPage from "./Pages/Productpage/Productpage";
import ScrollToTop from "./Components/scroll/scroll";
import Collection from "./Pages/Ourcollection/Ourcollection";
import Login from "./Pages/Login/Login";

import { Routes, Route, useLocation } from "react-router-dom";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Check/Check";


function App() {
  const location = useLocation();

  const hideLayout = location.pathname === "/gin";

  return (
    <>
      {!hideLayout && <Navbar />}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/gin" element={<Login />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/check" element={<Checkout/>}/>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;