import axios from "axios";

const baseUrl = process.env.API_URI;

const makeAuthenticatedRequest = async (
  method,
  url,
  data = null,
  access_token = null
) => {
  let token = localStorage.getItem("access_token");

  if (access_token !== null) {
    token = access_token;
  }

  try {
    const response = await axios({
      method: method,
      url: "http://localhost:8080/api/v1/" + url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
      withCredentials: true, // Include this line to enable credentials
    });

    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return refreshToken(method, url, data)
        .then((newAccessToken) => {
          return makeAuthenticatedRequest(method, url, data, newAccessToken);
        })
        .catch((refreshError) => {
          throw refreshError;
        });
    } else {
      throw error;
    }
  }
};

const refreshToken = (method, url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/auth/refresh",
        {
          withCredentials: true, // Include this line to enable credentials
        }
      );
      console.log(response);

      const access_token = localStorage.setItem(
        "access_token",
        response.data.token
      );
      resolve(access_token);
    } catch (error) {
      reject(error);
    }
  });
};

export default makeAuthenticatedRequest;
