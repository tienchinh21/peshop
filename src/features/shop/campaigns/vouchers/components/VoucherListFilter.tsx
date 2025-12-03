"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import {
  VoucherStatus,
  VoucherStatusLabels,
  VoucherType,
  VoucherTypeLabels,
  VoucherSortField,
  SortOrder,
} from "@/lib/utils/enums/eVouchers";
import type { VoucherListFilters } from "../types";
import _ from "lodash";

interface VoucherListFilterProps {
  filters: VoucherListFilters;
  onFiltersChange: (filters: VoucherListFilters) => void;
  onReset: () => void;
}

export function VoucherListFilter({
  filters,
  onFiltersChange,
  onReset,
}: VoucherListFilterProps) {
  const [searchInput, setSearchInput] = useState(_.get(filters, "search", ""));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!_.isEqual(searchInput, _.get(filters, "search"))) {
        onFiltersChange(
          _.assign({}, filters, { search: searchInput, page: 1 })
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (status: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        status: status === "all" ? undefined : _.toNumber(status),
        page: 1,
      })
    );
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        type: type === "all" ? undefined : _.toNumber(type),
        page: 1,
      })
    );
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        sortBy: sortBy === "none" ? undefined : sortBy,
        page: 1,
      })
    );
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange(
      _.assign({}, filters, {
        sortOrder: sortOrder as "asc" | "desc",
        page: 1,
      })
    );
  };

  const hasActiveFilters = _.some([
    _.get(filters, "search"),
    !_.isUndefined(_.get(filters, "status")),
    !_.isUndefined(_.get(filters, "type")),
    _.get(filters, "sortBy"),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã code..."
            value={searchInput}
            onChange={(e) => setSearchInput(_.get(e, "target.value", ""))}
            className="pl-10"
          />
          {!_.isEmpty(searchInput) && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearchInput("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc:</span>
        </div>

        <Select
          value={
            !_.isUndefined(_.get(filters, "status"))
              ? _.toString(_.get(filters, "status"))
              : "all"
          }
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={VoucherStatus.ACTIVE.toString()}>
              {VoucherStatusLabels[VoucherStatus.ACTIVE]}
            </SelectItem>
            <SelectItem value={VoucherStatus.INACTIVE.toString()}>
              {VoucherStatusLabels[VoucherStatus.INACTIVE]}
            </SelectItem>
            <SelectItem value={VoucherStatus.EXPIRED.toString()}>
              {VoucherStatusLabels[VoucherStatus.EXPIRED]}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            !_.isUndefined(_.get(filters, "type"))
              ? _.toString(_.get(filters, "type"))
              : "all"
          }
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value={VoucherType.FIXED_AMOUNT.toString()}>
              {VoucherTypeLabels[VoucherType.FIXED_AMOUNT]}
            </SelectItem>
            <SelectItem value={VoucherType.PERCENTAGE.toString()}>
              {VoucherTypeLabels[VoucherType.PERCENTAGE]}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={_.get(filters, "sortBy", "none")}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Không sắp xếp</SelectItem>
            <SelectItem value={VoucherSortField.NAME}>Tên</SelectItem>
            <SelectItem value={VoucherSortField.CODE}>Mã code</SelectItem>
            <SelectItem value={VoucherSortField.DISCOUNT_VALUE}>
              Giá trị giảm
            </SelectItem>
            <SelectItem value={VoucherSortField.START_TIME}>
              Ngày bắt đầu
            </SelectItem>
            <SelectItem value={VoucherSortField.END_TIME}>
              Ngày kết thúc
            </SelectItem>
            <SelectItem value={VoucherSortField.CREATED_AT}>
              Ngày tạo
            </SelectItem>
          </SelectContent>
        </Select>

        {!_.isNil(_.get(filters, "sortBy")) && (
          <Select
            value={_.get(filters, "sortOrder", SortOrder.ASC)}
            onValueChange={handleSortOrderChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortOrder.ASC}>Tăng dần</SelectItem>
              <SelectItem value={SortOrder.DESC}>Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
