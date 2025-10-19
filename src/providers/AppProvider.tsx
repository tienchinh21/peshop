"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { LayoutProvider } from "./LayoutProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider - Combined provider for the entire application
 * Wraps all providers in the correct order
 * Order: Redux → QueryProvider → LayoutProvider
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
