"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Search } from "lucide-react";
export interface DateRangeFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}
export function DateRangeFilter({
  onFilter,
  defaultStartDate = "",
  defaultEndDate = ""
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [error, setError] = useState<string | null>(null);
  const validateDateRange = (): boolean => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return false;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      setError("Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }
    setError(null);
    return true;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDateRange()) {
      onFilter(startDate, endDate);
    }
  };
  const isDisabled = !startDate || !endDate;
  return <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Từ ngày</Label>
          <Input id="startDate" type="date" value={startDate} onChange={e => {
          setStartDate(e.target.value);
          setError(null);
        }} className="w-[180px]" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">Đến ngày</Label>
          <Input id="endDate" type="date" value={endDate} onChange={e => {
          setEndDate(e.target.value);
          setError(null);
        }} className="w-[180px]" />
        </div>
        <Button type="submit" disabled={isDisabled}>
          <Search className="size-4" />
          Tìm kiếm
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>;
}