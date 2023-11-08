import React from "react";
import { BsCart4 } from "react-icons/bs";
import style from "./AdminLayout.module.css";

const AdminLayout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container my-navbar">
          <div className="navbar-brand" href="#">
            PHEARITH
          </div>
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
            <ul className="navbar-nav m-auto">
              <li className={style.nav_link}>MEN</li>
              <li className={style.nav_link}>WOMEN</li>
              <li className={style.nav_link}>PROMOTION</li>
            </ul>
          </div>
          <div className={style.cart}>
            <BsCart4 />
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </>
  );
};

export default AdminLayout;
