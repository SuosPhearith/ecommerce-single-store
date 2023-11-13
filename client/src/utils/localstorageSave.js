const localStorageSave = (access_token, fullname, role, photo) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("fullname", fullname);
  localStorage.setItem("role", role);
  localStorage.setItem("photo", photo);
};

export default localStorageSave;
