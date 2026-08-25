export const logout = (redirect: string = "/login") => {
  // Remove tokens and user info from both storages
  localStorage.removeItem("authToken");
  localStorage.removeItem("refresh");
  localStorage.removeItem("userInfo");

  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("refresh");
  sessionStorage.removeItem("userInfo");

  // Optional: redirect user to login or home page
  if (redirect) {
    window.location.href = redirect;
  }
};