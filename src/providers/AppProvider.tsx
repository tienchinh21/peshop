"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { LayoutProvider } from "./LayoutProvider";
import { GlobalAuthSync } from "./GlobalAuthSync";
import { PendingPaymentButton } from "@/shared/components/layout/PendingPaymentButton";
interface AppProviderProps {
  children: React.ReactNode;
}
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <LayoutProvider>{children}</LayoutProvider>
        <GlobalAuthSync />
        <PendingPaymentButton />
      </QueryProvider>
    </ReduxProvider>
  );
}
