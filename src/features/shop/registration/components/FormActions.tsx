"use client";

import React, { memo } from "react";
import { Store } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}
export const FormActions = memo<FormActionsProps>(({
  isLoading,
  onCancel
}) => <>
    <Separator />
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">
        Vui lòng kiểm tra kỹ thông tin trước khi đăng ký
      </p>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy bỏ
        </Button>
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Đang xử lý...
            </> : <>
              <Store className="mr-2 h-4 w-4" />
              Tạo cửa hàng
            </>}
        </Button>
      </div>
    </div>
  </>);
FormActions.displayName = "FormActions";