"use client";

import React, { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

// Import React Quill dynamically để tránh SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] bg-gray-50 animate-pulse rounded" />
  ),
});

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  maxLength,
}: RichTextEditorProps) {
  // Polyfill for React 19 compatibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ReactDOM = require("react-dom");
      if (!ReactDOM.findDOMNode) {
        ReactDOM.findDOMNode = (node: any) => {
          if (node == null) return null;
          if (node instanceof HTMLElement) return node;
          return node;
        };
      }
    }
  }, []);

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link"],
        ["clean"],
        ["image"],
      ],
    }),
    []
  );

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
  ];

  const handleChange = (content: string) => {
    if (maxLength) {
      // Remove HTML tags to count plain text length
      const plainText = content.replace(/<[^>]*>/g, "");
      if (plainText.length <= maxLength) {
        onChange(content);
      }
    } else {
      onChange(content);
    }
  };

  // Get plain text length for character count
  const getPlainTextLength = () => {
    const plainText = value.replace(/<[^>]*>/g, "");
    return plainText.length;
  };

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      {maxLength && (
        <span className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2 py-1 rounded z-10">
          {getPlainTextLength()}/{maxLength}
        </span>
      )}
    </div>
  );
}
