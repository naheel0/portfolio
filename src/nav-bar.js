import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#home">Naheel</a>
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
              <a className="nav-link" href="#home">
                <i className="fa-solid fa-house"></i> Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                <i className="fa-solid fa-circle-info"></i> About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#projects">
                <i className="fa-solid fa-briefcase"></i> Projects
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#skills">
                <i className="fa-solid fa-cogs"></i> Skills
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                <i className="fa-solid fa-user"></i> Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
