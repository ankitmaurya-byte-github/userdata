import React, { useEffect } from "react";
import "./menu.scss"; // Import the CSS for styling
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Menu";
  }, []);
  return (
    <div className="menu-container">
      <h1>Welcome to Our Tech Site</h1>
      <div className="button-container">
        <button className="menu-button" onClick={() => navigate("/home")}>
          Home
        </button>
        <button className="menu-button" onClick={() => navigate("/about-us")}>
          About Us
        </button>
        <button className="menu-button" onClick={() => navigate("/services")}>
          Services
        </button>
        <button className="menu-button" onClick={() => navigate("/audit")}>
          Audit
        </button>{" "}
      </div>
    </div>
  );
};

export default Menu;
