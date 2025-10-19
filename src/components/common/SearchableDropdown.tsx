"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = "Vui lòng chọn",
  label,
  required = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setShowAddCustom(false);
        setCustomValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
    setShowAddCustom(false);
    setCustomValue("");
  };

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setIsOpen(false);
      setSearchTerm("");
      setShowAddCustom(false);
      setCustomValue("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowAddCustom(
      term.length > 0 &&
        !filteredOptions.some((opt) => opt.toLowerCase() === term.toLowerCase())
    );
  };

  return (
    <div className="space-y-2 flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {value || placeholder}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Vui lòng nhập tối thiểu 1 ký tự"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                  >
                    {option}
                  </button>
                ))
              ) : searchTerm ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Không tìm thấy kết quả
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nhập để tìm kiếm...
                </div>
              )}
            </div>

            {/* Add Custom Option */}
            {showAddCustom && (
              <div className="border-t border-gray-200 p-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Nhập giá trị mới"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="flex-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCustom();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCustom}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-1 text-xs text-blue-600 flex items-center">
                  <Plus className="w-3 h-3 mr-1" />
                  Thêm thuộc tính mới
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
