import React from "react";
import { Link } from "react-router-dom"; // <-- Import Link
import "./nav-bar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top transparent-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Naheel
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fa-solid fa-house"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/About">
                <i className="fa-solid fa-circle-info"></i> About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Projects">
                <i className="fa-solid fa-briefcase"></i> Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Skills">
                <i className="fa-solid fa-cogs"></i> Skills
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Contact">
                <i className="fa-solid fa-user"></i> Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
