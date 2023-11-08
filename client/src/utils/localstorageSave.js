const localStorageSave = (access_token, fullname, role) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("fullname", fullname);
  localStorage.setItem("role", role);
};

export default localStorageSave;
