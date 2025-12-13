"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { getAuthTokenCookie } from "@/lib/utils/cookies.utils";
import { getCurrentUserFromAPI } from "@/features/customer/auth/services";

export function GlobalAuthSync() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sync = async () => {
      const token = getAuthTokenCookie();
      if (!token) return;
      const user = await getCurrentUserFromAPI();
      if (user) {
        dispatch(
          setCredentials({
            user,
            token,
          })
        );
      }
    };
    sync();
  }, [pathname, dispatch]);

  return null;
}

export default GlobalAuthSync;
