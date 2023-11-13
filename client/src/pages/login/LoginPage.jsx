import { Link } from "react-router-dom";
import style from "./LoginPage.module.css";
import { message } from "antd";
import { useState } from "react";
import request from "../../services/request";
import GoogleOAuth from "../../components/googleOAuth/GoogleOAuth";
import FacebookOAuth from "../../components/facebookOAuth/FacebookOAuth";
import localStorageSave from "../../utils/localstorageSave";
import errroHandler from "../../utils/errorHandler";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    if (validate()) return;
    try {
      const response = await request("post", "auth/", {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      localStorageSave(
        response.token,
        response.data.user.fullname,
        response.data.user.role,
        response.data.user.photo
      );
      // window.location.href = "/";
    } catch (error) {
      errroHandler(error);
    }
  };
  const validate = () => {
    if (!email) {
      message.error("All fields are required");
      return true;
    }
    if (!password) {
      message.error("All fields are required");
      return true;
    }
    return false;
  };
  return (
    <div className={style.container}>
      <div className={style.form_container}>
        <div className={style.left}>
          <img className={style.img} src="./images/login.jpg" alt="login" />
        </div>
        <div className={style.right}>
          <h2 className={style.from_heading}>Members Log in</h2>
          <input
            type="text"
            className={style.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className={style.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={style.btn} onClick={login}>
            Log In
          </button>
          <p className={style.text}>or</p>
          <GoogleOAuth />
          <FacebookOAuth />
          <p className={style.text}>
            New Here ? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
