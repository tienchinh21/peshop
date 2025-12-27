"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { viewProduct } from "../services/product.service";
import { getAuthTokenCookie } from "@/lib/utils/cookies.utils";

const VIEW_KEY_PREFIX = "pv_";

export const useTrackProductView = () => {
  const mutation = useMutation({
    mutationFn: viewProduct,
    retry: false,
  });

  const trackView = useCallback(
    (productId: string) => {
      if (!productId) return;
      
      // Chỉ track view khi user đã đăng nhập
      const token = getAuthTokenCookie();
      if (!token) return;

      const viewedKey = `${VIEW_KEY_PREFIX}${productId}`;

      // Chỉ gọi API nếu chưa xem trong session này
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, "1");
        mutation.mutate(productId);
      }
    },
    [mutation]
  );

  return { trackView, isTracking: mutation.isPending };
};
