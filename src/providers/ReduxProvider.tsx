"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { hydrateAuth } from "@/lib/store/slices/authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * ReduxProvider - Wrap app với Redux Provider
 * Hydrate auth state từ localStorage khi app khởi động
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthHydration />
      {children}
    </Provider>
  );
}

/**
 * AuthHydration - Component để hydrate auth state từ localStorage
 * Chạy 1 lần khi app khởi động
 */
function AuthHydration() {
  useEffect(() => {
    // Hydrate auth state từ localStorage
    store.dispatch(hydrateAuth());
  }, []);

  return null;
}

export default ReduxProvider;
