'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Có lỗi xảy ra
        </h2>
        <p className="text-gray-600 mb-6">
          Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.
        </p>
        <Button
          onClick={reset}
          className="w-full"
        >
          Thử lại
        </Button>
      </div>
    </div>
  );
}
