import { useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../componentStyles/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = true;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <Link to="/">MERN-ECOMMERCE</Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/">About us</Link></li>
            <li><Link to="/">Contact us</Link></li>
          </ul>
        </div>

        <div className="navbar-icons">
          <div className="search-container">
            <form className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
              />
              <button className="search-icon">
                <SearchIcon focusable="false" />
              </button>
            </form>
          </div>

          <div className="cart-container">
            <Link to="/cart" >
              <ShoppingCartIcon className="icon" />
              <span className="cart-badge">6</span>
            </Link>
          </div>

          {!isAuthenticated && <Link to="/register" className="register-link">
            <PersonAddIcon className="icon" />
          </Link>}

          <div className="navbar-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
          </div>
        </div>
      </div>
    </nav >
  )
};

export default Navbar;