// Check if the user is logged in and retrieve user info from localStorage or sessionStorage

export const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
export const refreshToken = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
export const isLoggedIn = !!token;

const user = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
export const getUserInfo = user ? JSON.parse(user) : null;
