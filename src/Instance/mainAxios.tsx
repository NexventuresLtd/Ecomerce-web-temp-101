import axios from "axios";
import { refreshToken, clearAuthData } from "../app/Localstorage";

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

// Helper function to logout user
const logoutUser = (redirectToLogin = true) => {
  // Clear auth data from storage
  clearAuthData();
  
  // Clear any ongoing refresh attempts
  isRefreshing = false;
  failedQueue = [];
  
  // Redirect to login page if needed
  if (redirectToLogin && typeof window !== 'undefined') {
    // Store current path for redirect after login
    localStorage.setItem("redirectPath", window.location.pathname);
    
    // Option 1: Redirect to login page
    window.location.href = '/authentication'; // Adjust path as needed
    
    // Option 2: If using React Router, you could use:
    // router.navigate('/authentication');
    
    // Option 3: Reload the page to clear any application state
    // window.location.reload();
  }
};

/* 
// 🔒 Helper function to decrypt response
// Disabled for now
export const decryptData = (encrypted: string): string | null => {
  try {
    const [ivBase64, ciphertextBase64] = encrypted.split(":");
    if (!ivBase64 || !ciphertextBase64) {
      throw new Error("Invalid encrypted format: expected 'iv:ciphertext'");
    }

    let keyStr = import.meta.env.VITE_SECRET_KEY_DATA as string;
    if (!keyStr) { throw new Error("VITE_SECRET_KEY_DATA missing") };

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
    if (!out) { throw new Error("Empty result after decryption") };

    return JSON.parse(out);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};
*/

// RESPONSE INTERCEPTOR
mainAxios.interceptors.response.use(
  response => {
    console.log("Response:", response);
    // 🔒 Decryption disabled for now
    /*
    if (response.data?.encrypted_data) {
      const decrypted = decryptData(response.data.encrypted_data);
      response.data.decrypted_data = decrypted;
      delete response.data.encrypted_data;
    }
    */
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized (session expired)
    if (error.response?.status === 401) {
      const isAuthEndpoint = originalRequest.url?.includes("auth/") || 
                           originalRequest.url?.includes("login/");
      
      // If it's a non-auth endpoint and we haven't retried yet, try to refresh
      if (!isAuthEndpoint && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("Attempting token refresh...");

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return mainAxios(originalRequest);
            })
            .catch(err => {
              logoutUser();
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
          // Check if we have a refresh token
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}login/refresh/`,
            { refresh: refreshToken }, // Send as body (standard JWT refresh flow)
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          const newAccessToken = response.data.access;
          // Update the stored token
          localStorage.setItem("authToken", newAccessToken);
          
          // If a new refresh token is provided, update it too
          if (response.data.refresh) {
            localStorage.setItem("refreshToken", response.data.refresh);
          }
          
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return mainAxios(originalRequest);
        } catch (err) {
          // Refresh failed - logout user
          console.error("Token refresh failed, logging out:", err);
          processQueue(err, null);
          logoutUser();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else if (!isAuthEndpoint) {
        // Already tried to refresh or it's an auth endpoint - logout
        console.log("Authentication failed, logging out");
        logoutUser();
      }
    }
    
    // Handle other specific error cases
    if (error.response?.status === 403) {
      console.error("Forbidden - insufficient permissions");
      // Optionally handle 403 errors differently
    }
    
    return Promise.reject(error);
  }
);

// REQUEST INTERCEPTOR
mainAxios.interceptors.request.use(
  config => {
    // Get fresh token from storage for each request
    const currentToken = localStorage.getItem("authToken");
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default mainAxios;