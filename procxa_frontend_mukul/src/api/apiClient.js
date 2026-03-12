// import axios from "axios";
// import endpoints from "./endPoints";
// // Create an Axios Instance
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_APP_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   if (config.data instanceof FormData) {
//     delete config.headers["Content-Type"];
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });
// let isRefreshing = false; 
// let requestQueue = []; 

// // Request Interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor
// apiClient.interceptors.response.use(
//   (response) => response, 
//   async (error) => {
//     const originalRequest = error.config;

//     // If token is expired
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           const refreshToken = localStorage.getItem("refresh_token");
//           const response = await axios.post(
//             import.meta.env.VITE_APP_API_BASE_URL + endpoints.refreshToken,
//             {},
//             {
//               headers: { "X-Refresh-Token": refreshToken },
//             }
//           );

//           const newAccessToken = response.data.access_token;
//           localStorage.setItem("authToken", newAccessToken);

//           // Resolve all queued requests with the new token
//           requestQueue.forEach((callback) => callback(newAccessToken));
//           requestQueue = []; // Clear the queue
//           isRefreshing = false;

//           // Retry the original request with the new token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           isRefreshing = false;
//           console.error("Session expired. Please log in again.");
//           localStorage.removeItem("authToken");
//           localStorage.removeItem("refresh_token");
//           // window.location.href = "/";
//           return Promise.reject(refreshError);
//         }
//       }

//       // Queue the request if a token refresh is in progress
//       return new Promise((resolve) => {
//         requestQueue.push((newToken) => {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           resolve(apiClient(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error); // Reject other errors
//   }
// );


// export default apiClient;



import axios from "axios";
import endpoints from "./endPoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

let isRefreshing = false;
let requestQueue = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refresh_token");

          const res = await axios.post(
            import.meta.env.VITE_APP_API_BASE_URL + "/refresh_token",
            {},
            {
              headers: {
                "X-Refresh-Token": refreshToken,
              },
            }
          );

          const newToken = res.data.access_token;
          localStorage.setItem("authToken", newToken);

          requestQueue.forEach((cb) => cb(newToken));
          requestQueue = [];
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = "/";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        requestQueue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
