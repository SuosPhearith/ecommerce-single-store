import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";
import { useState } from "react";
import { message } from "antd";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleAuth = () => {
    window.open(`http://localhost:8080/api/v1/auth/google`, "_self");
  };
  const facebookAuth = () => {
    window.open(`http://localhost:8080/api/v1/auth/facebook`, "_self");
  };
  const createUser = async () => {
    try {
      const newUser = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          fullname,
          email,
          password,
        },
        { withCredentials: true }
      );
      setEmail("");
      setFullname("");
      setPassword("");
      message.success("success");
    } catch (error) {
      message.error("error");
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign up Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/signup.jpg" alt="signup" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Create Account</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
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
          <button className={styles.btn} onClick={createUser}>
            Sign Up
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sing up with Google</span>
          </button>
          <button className={styles.google_btn} onClick={facebookAuth}>
            <img src="./images/facebook.jpg" alt="google icon" />
            <span>Sing up with Facebook</span>
          </button>
          <p className={styles.text}>
            Already Have Account ? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
