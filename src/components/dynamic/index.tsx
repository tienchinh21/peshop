import dynamic from "next/dynamic";

const ModalSkeleton = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const EditorSkeleton = () => (
  <div className="w-full h-64 border rounded-lg p-4">
    <div className="animate-pulse space-y-3">
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="w-full h-80 border rounded-lg p-4">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  </div>
);

export const QuickViewModal = dynamic(
  () => import("@/shared/components/layout/QuickViewModal"),
  { loading: () => <ModalSkeleton />, ssr: false }
);

export const AddressSelectModal = dynamic(
  () =>
    import("@/shared/components/layout/AddressSelectModal").then(
      (mod) => mod.AddressSelectModal
    ),
  { loading: () => <ModalSkeleton />, ssr: false }
);

export const CategorySelectionModal = dynamic(
  () =>
    import("@/shared/components/layout/CategorySelectionModal").then(
      (mod) => mod.CategorySelectionModal
    ),
  { loading: () => <ModalSkeleton />, ssr: false }
);

export const RichTextEditor = dynamic(
  () =>
    import("@/shared/components/layout/RichTextEditor").then(
      (mod) => mod.RichTextEditor
    ),
  { loading: () => <EditorSkeleton />, ssr: false }
);

export const DashboardCharts = dynamic(
  () =>
    import("@/features/shop/dashboard/components/DashboardCharts").then(
      (mod) => mod.DashboardCharts
    ),
  { loading: () => <ChartSkeleton />, ssr: false }
);

export const VoucherDashboardCharts = dynamic(
  () =>
    import(
      "@/features/shop/campaigns/vouchers/components/dashboard/VoucherDashboardCharts"
    ).then((mod) => mod.VoucherDashboardCharts),
  { loading: () => <ChartSkeleton />, ssr: false }
);
