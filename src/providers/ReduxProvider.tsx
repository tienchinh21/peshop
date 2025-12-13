"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { hydrateAuth } from "@/lib/store/slices/authSlice";
interface ReduxProviderProps {
  children: React.ReactNode;
}
export function ReduxProvider({
  children
}: ReduxProviderProps) {
  return <Provider store={store}>
      <AuthHydration />
      {children}
    </Provider>;
}
function AuthHydration() {
  useEffect(() => {
    store.dispatch(hydrateAuth());
  }, []);
  return null;
}
export default ReduxProvider;