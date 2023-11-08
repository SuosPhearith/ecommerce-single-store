import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { message } from "antd";
import { useState } from "react";
import request from "../../services/request";
import localStorageSave from "../../utils/localstorageSave";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleAuth = () => {
    window.open(`http://localhost:8080/api/v1/auth/google`, "_self");
  };
  const facebookAuth = () => {
    window.open(`http://localhost:8080/api/v1/auth/facebook`, "_self");
  };
  const login = async () => {
    try {
      await request("post", "auth/", {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      message.success("success");
      window.location.href = "/";
    } catch (error) {
      message.error("error");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/login.jpg" alt="login" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Members Log in</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.btn} onClick={login}>
            Log In
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sign in with Google</span>
          </button>
          <button className={styles.google_btn} onClick={facebookAuth}>
            <img src="./images/facebook.jpg" alt="google icon" />
            <span>Sign in with Facebook</span>
          </button>
          <p className={styles.text}>
            New Here ? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
