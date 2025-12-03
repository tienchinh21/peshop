const SuggestionsPanel = () => {
  return (
    <div className="w-80 sticky top-30 h-fit">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <h3 className="text-base font-medium text-gray-800 text-center">
            Gợi ý điền Thông tin
          </h3>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Thêm ít nhất 3 hình ảnh
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Thêm video sản phẩm</span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Tên sản phẩm có ít nhất 25~100 kí tự
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Thêm ít nhất 100 kí tự hoặc 1 hình ảnh trong mô tả sản phẩm
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Thêm thương hiệu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPanel;
