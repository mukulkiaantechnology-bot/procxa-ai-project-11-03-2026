import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (endpoint, method = "GET", data = null, config = null) => {
      setLoading(true);
      setError(null);

      try {
        let response;
        console.log(`API Call: ${method} ${endpoint}`);

        switch (method) {
          case "GET":
            response = await apiClient.get(endpoint, config);
            break;
          case "POST":
            response = await apiClient.post(endpoint, data, config);
            break;
          case "PATCH":
            response = await apiClient.patch(endpoint, data, config);
            break;
          case "PUT":
            response = await apiClient.put(endpoint, data, config);
            break;
          case "DELETE":
            response = await apiClient.delete(endpoint, config);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setLoading(false);
        return {
          status: response.data?.status ?? true,
          data: response.data?.data ?? response.data,
          message: response.data?.message,
          pagination: response.data?.pagination,
          ...response.data, 
        };
      } catch (err) {
        setLoading(false);
        console.error("API Error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Something went wrong.";
        setError(errorMessage);
        
        return {
          status: false,
          data: null,
          message: errorMessage,
          error: err.response?.data || err.message,
        };
      }
    },
    []
  );

  return {
    get: (endpoint, config) => fetchData(endpoint, "GET", null, config),
    post: (endpoint, data, config) => fetchData(endpoint, "POST", data, config),
    patch: (endpoint, data, config) => fetchData(endpoint, "PATCH", data, config),
    put: (endpoint, data, config) => fetchData(endpoint, "PUT", data, config),
    del: (endpoint, config) => fetchData(endpoint, "DELETE", null, config),
    loading,
    error,
  };
};

export default useApi;
