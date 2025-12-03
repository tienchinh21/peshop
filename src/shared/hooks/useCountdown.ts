"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseCountdownReturn {
  countdown: number;
  isActive: boolean;
  start: (seconds: number) => void;
  reset: () => void;
}

export const useCountdown = (): UseCountdownReturn => {
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback((seconds: number) => {
    setCountdown(seconds);
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setCountdown(0);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && countdown > 0) {
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, countdown]);

  return {
    countdown,
    isActive,
    start,
    reset,
  };
};
