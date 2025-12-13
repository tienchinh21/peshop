interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}
export default function LoadingOverlay({
  isVisible,
  message = "Đang tải sản phẩm...",
  subMessage = "Vui lòng chờ trong giây lát"
}: LoadingOverlayProps) {
  if (!isVisible) return null;
  return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-lg font-semibold text-gray-900">{message}</div>
        <div className="text-sm text-gray-600">{subMessage}</div>
      </div>
    </div>;
}