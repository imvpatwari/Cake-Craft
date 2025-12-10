import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext({ loading: false, setLoading: () => {} });

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="loader-overlay">
          <div className="loader-box">Loading...</div>
        </div>
      )}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}