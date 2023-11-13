import request from "../services/request";
import localstorageClear from "./localstorageClear";
import errorHandler from "./errorHandler";
const logout = async () => {
  try {
    await request("GET", "auth/logout");
    localstorageClear();
    window.location.href = "/";
  } catch (error) {
    errorHandler(error);
  }
};

export default logout;
