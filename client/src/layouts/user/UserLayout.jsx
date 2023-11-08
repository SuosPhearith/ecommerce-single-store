import React from "react";
import { Link } from "react-router-dom";
import style from "./UserLayout.module.css";
const UserLayout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container my-navbar">
          <Link className="navbar-brand" to="/">
            PHEARITH
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav ms-auto">
              <li className={style.nav_link}>MEN</li>
              <li className={style.nav_link}>WOMEN</li>
              <li className={style.nav_link}>PROMOTION</li>
              <li className={style.nav_link}>
                <Link to="/login" className={style.login}>
                  LOGIN
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default UserLayout;
