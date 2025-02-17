import { useState, useEffect } from "react";
import "./Navbar.css";
import { UserOutlined, StarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { MdOutlineExplore, MdStore, MdAnnouncement } from "react-icons/md";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <nav className="vertical-navbar">
      <div className="navbar-logo">
        <a href="/">
          <img src="logo.png" alt="Logo" className="logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li className={`navbar-item ${activeLink === "/rutas" ? "active" : ""}`}>
          <a href="/rutas" onClick={() => handleLinkClick("/rutas")}>
            <MdOutlineExplore style={{ color: "#a7301b", fontSize: "29px" }} />
            <span className="link-text">Rutas</span>
          </a>
        </li>
        <li className={`navbar-item ${activeLink === "/mercado" ? "active" : ""}`}>
          <a href="/mercado" onClick={() => handleLinkClick("/mercado")}>
            <MdStore style={{ color: "#a7301b", fontSize: "29px" }} />
            <span className="link-text">Mercado</span>
          </a>
        </li>
        <li className={`navbar-item ${activeLink === "/noticias" ? "active" : ""}`}>
          <a href="/noticias" onClick={() => handleLinkClick("/noticias")}>
            <MdAnnouncement style={{ color: "#a7301b", fontSize: "29px" }} />
            <span className="link-text">Noticias</span>
          </a>
        </li>
      </ul>
      <div className="navbar-buttons">
        <button className="fav-button">
          <a href="/favs">
            <StarOutlined style={{ color: "white", fontSize: "18px" }} />
          </a>
        </button>
        <button className="cart-button">
          <a href="/carrito">
            <ShoppingCartOutlined style={{ color: "white", fontSize: "18px" }} />
          </a>
        </button>
        <button className="user-button">
          <a href="/login">
            <UserOutlined style={{ color: "white", fontSize: "18px" }} />
          </a>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
