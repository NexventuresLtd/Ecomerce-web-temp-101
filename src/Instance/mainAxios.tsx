import axios from "axios";
import CryptoJS from "crypto-js";
import { refreshToken, token } from "../app/Localstorage";

// Create Axios instance
const mainAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag to avoid multiple refresh calls at once
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper function to decrypt response
export const decryptData = (encrypted: string): string | null => {
  try {
    const [ivBase64, ciphertextBase64] = encrypted.split(":");
    if (!ivBase64 || !ciphertextBase64) {
      throw new Error("Invalid encrypted format: expected 'iv:ciphertext'");
    }

    // 👇 key must be same as SECRET_KEY_DATA (before Python pads)
    let keyStr = import.meta.env.VITE_SECRET_KEY_DATA as string;
    if (!keyStr) { throw new Error("VITE_SECRET_KEY_DATA missing") };

    // Manually pad/truncate like Python did
    const keyBytes = new Uint8Array(16);
    for (let i = 0; i < Math.min(keyStr.length, 16); i++) {
      keyBytes[i] = keyStr.charCodeAt(i);
    }
    const key = CryptoJS.lib.WordArray.create(keyBytes as any);

    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const out = decrypted.toString(CryptoJS.enc.Utf8);
    if (!out) {throw new Error("Empty result after decryption")};

    return JSON.parse(out);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};

// RESPONSE INTERCEPTOR
mainAxios.interceptors.response.use(
  response => {
    // Decrypt encrypted_data if present
    if (response.data?.encrypted_data) {
      const decrypted = decryptData(response.data.encrypted_data);
      // console.log(decrypted)
      response.data.decrypted_data = decrypted;
      delete response.data.encrypted_data;
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Skip token refresh for login endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (!originalRequest.url?.includes("auth/") &&
        !originalRequest.url?.includes("login/"))
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return mainAxios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}login/refresh/?refresh_token=${refreshToken}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("authToken", newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return mainAxios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.setItem("redirectPath", window.location.pathname);
        // Optionally redirect to login
        // window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// REQUEST INTERCEPTOR
mainAxios.interceptors.request.use(
  config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default mainAxios;
