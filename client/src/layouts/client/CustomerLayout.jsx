import React, { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import style from "./CustomerLayout.module.css";
import { Link } from "react-router-dom";
import { Modal, Spin } from "antd";
import logout from "../../utils/logout";

const CustomerLayout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fullname = localStorage.getItem("fullname");
  const photo = localStorage.getItem("photo");
  const [isLoading, setIsloading] = useState(false);
  const handleOk = () => {
    setIsloading(true);
    logout();
    setIsloading(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Spin spinning={isLoading}>
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
              <li className={style.nav_link} style={{ fontSize: "25px" }}>
                <BsCart4 />
                <span style={{ fontSize: "12px", marginBottom: "15px" }}>
                  2
                </span>
              </li>
              <li
                className={style.nav_link}
                onClick={() => setIsModalOpen(true)}
              >
                <img className={style.profile} src={photo} alt="img"></img>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        width="250px"
      >
        <div className={style.wrapper}>
          <img className={style.profile_image} src={photo} alt="img"></img>
          <div className={style.profile_fullname}>{fullname}</div>
          <Link to="/user" onClick={() => setIsModalOpen(false)}>
            <button className={style.profile_detail}>Detail</button>
          </Link>
          <button className={style.profile_detail} onClick={() => handleOk()}>
            Logout
          </button>
        </div>
      </Modal>
      {children}
    </Spin>
  );
};

export default CustomerLayout;
