import React from "react";
import style from "./FacebookOAuth.module.css";

const FacebookOAuth = () => {
  const facebookAuth = async () => {
    alert("hello");
  };
  return (
    <button className={style.facebook_btn} onClick={facebookAuth}>
      <img src="./images/facebook.jpg" alt="google icon" />
      <span>Sign in with Facebook</span>
    </button>
  );
};

export default FacebookOAuth;
