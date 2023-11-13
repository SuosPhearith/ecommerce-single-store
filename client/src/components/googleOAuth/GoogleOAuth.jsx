import React from "react";
import style from "./GoogleOAuth.module.css";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import request from "../../services/request";
import localStorageSave from "../../utils/localstorageSave";

const GoogleOAuth = () => {
  const googleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await request("POST", "auth/google", {
        fullname: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
      localStorageSave(
        response.access_token,
        response.data.user.fullname,
        response.data.user.role,
        response.data.user.photo
      );
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className={style.google_btn} onClick={googleAuth}>
      <img src="./images/google.png" alt="google icon" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleOAuth;
