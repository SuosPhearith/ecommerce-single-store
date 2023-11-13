import { message } from "antd";
import logout from "./logout";
const errroHandler = (error = null) => {
  if (error === null) {
    return;
  }
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    message.error("សូមចូលគណនីម្តងទៀត!");
    return logout();
  }
  if (error.response && error.response.data && error.response.data.message) {
    message.error(error.response.data.message, 2);
  } else {
    message.error("Fail connect to API!.", 2);
  }
};

export default errroHandler;
