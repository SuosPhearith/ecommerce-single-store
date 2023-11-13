import { Link } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import GoogleOAuth from "../../components/googleOAuth/GoogleOAuth";
import FacebookOAuth from "../../components/facebookOAuth/FacebookOAuth";
import { useState } from "react";
import request from "../../services/request";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import errroHandler from "../../utils/errorHandler";

function Signup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const createUser = async () => {
    if (validate()) return;
    try {
      await request("POST", "auth/register", {
        fullname,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      errroHandler(error);
    }
  };
  const validate = () => {
    if (!fullname) {
      message.error("All fields are required");
      return true;
    }
    if (fullname.length < 3) {
      message.error("Fullname at least 3 letters");
      return true;
    }
    if (!email) {
      message.error("All fields are required");
      return true;
    }
    if (!password) {
      message.error("All fields are required");
      return true;
    }
    if (password.length < 6) {
      message.error("Password at least 6 letters");
      return true;
    }
    return false;
  };
  return (
    <div className={styles.container}>
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
          <GoogleOAuth />
          <FacebookOAuth />
          <p className={styles.text}>
            Already Have Account ? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
