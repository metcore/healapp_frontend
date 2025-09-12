"use client";

import { Icon } from "@iconify/react";
import * as React from "react";
import { Table as TableBootstrap } from "react-bootstrap";
import Pagination from "../pagination/Pagination";
import api from "@/api/api";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../input/Input";

export type SortDirection = "asc" | "desc" | null;

export type ColumnConfig<T> = {
  attribute: keyof T;
  label?: string;
  header?: () => React.ReactNode;
  value?: (data: T) => React.ReactNode;
  show?: boolean;
  // Sorting & Filtering
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number | Date | boolean | null | undefined;
  filter?: "text" | "select" | null;
  filterOptions?: Array<{ label: string; value: string }>;
  filterPlaceholder?: string;
};

export type TableProps<T extends object> = {
  columns: ColumnConfig<T>[];
  renderRow?: (row: T) => React.ReactNode;
  emptyText?: string;
  responsiveBreakpoint?: "sm" | "md" | "lg" | "xl" | "xxl";
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  size?: "sm" | undefined;
  caption?: string;
  url?: string;
  // Search / Filter / Sort
  searchable?: boolean;
  searchPlaceholder?: string;
  stickyHeader?: boolean;
  enableColumnFiltersByDefault?: boolean;

  /** Callback ketika sort berubah */
  onSortChange?: (args: { sortBy: keyof T | null; sortDir: SortDirection }) => void;

  /** Callback ketika filter berubah (termasuk global search) */
  onFilterChange?: (args: {
    query: string;
    columnFilters: Record<string, string>;
  }) => void;
};

const DEFAULT_PER_PAGE = 10;

type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export default function Table<T extends object>({
  columns,
  renderRow,
  emptyText = "Data belum ada yang dipilih",
  responsiveBreakpoint = "md",
  striped = true,
  hover = true,
  bordered = true,
  size,
  caption,
  searchable = true,
  searchPlaceholder = "Cari...",
  stickyHeader = true,
  enableColumnFiltersByDefault = true,
  url,
  onSortChange,
  onFilterChange,
}: TableProps<T>) {
  const [dataFetch, setDataFetch] = React.useState<PaginatedResponse<T>>({
    data: [],
    total: 0,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [params, setParams] = React.useState({
    page: Number(searchParams.get("page")) || 1,
    per_page: Number(searchParams.get("per_page")) || DEFAULT_PER_PAGE,
    sort: searchParams.get("sort") || "",
    order: searchParams.get("order") || "",
    search: searchParams.get("search") || "",
    searchFields: {}, 

  });

  const visibleColumns = React.useMemo(
    () =>
      columns
        ?.filter((col) => col.show !== false)
        .map((c) => ({
          ...c,
          filter: c.filter ?? (enableColumnFiltersByDefault ? "text" : null),
        })),
    [columns, enableColumnFiltersByDefault]
  );

  // Global search
  const [query, setQuery] = React.useState("");

  // Per-column filters
  const [colFilters, setColFilters] = React.useState<Record<string, string>>({});

  const [sortBy, setSortBy] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);

  const onSort = (col: ColumnConfig<T>) => {
    if (col.sortable === false) return;

    const colKey = col.attribute;
    let nextSortBy: keyof T | null = sortBy;
    let nextSortDir: SortDirection = sortDir;

    if (sortBy !== colKey) {
      nextSortBy = colKey;
      nextSortDir = "asc";
    } else {
      nextSortDir = sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc";
    }

    setSortBy(nextSortBy);
    setSortDir(nextSortDir);

    setParams((prev) => ({
      ...prev,
      sort: nextSortBy ? String(nextSortBy) : "",
      order: nextSortDir ?? "",
    }));

    onSortChange?.({ sortBy: nextSortBy, sortDir: nextSortDir });
  };

  React.useEffect(() => {
    onFilterChange?.({ query, columnFilters: colFilters });
  }, [query, colFilters, onFilterChange]);

  const filteredData = React.useMemo(() => {
    let rows = [...(dataFetch.data || [])];

    // if (query.trim()) {
    //   const q = query.toLowerCase();
    //   rows = rows.filter((row) =>
    //     visibleColumns.some((c) => {
    //       const cell = c.value ? c.value(row) : (row as any)[c.attribute];
    //       const text = typeof cell === "string" ? cell : String(cell ?? "");
    //       return text.toLowerCase().includes(q);
    //     })
    //   );
    // }

    if (visibleColumns) {
      for (const c of visibleColumns) {
        const val = colFilters[String(c.attribute)];
        if (val && c.filter) {
          rows = rows.filter((row) => {
            const raw = c.value ? c.value(row) : (row as any)[c.attribute];
            const text = typeof raw === "string" ? raw : String(raw ?? "");
            return text.toLowerCase().includes(val.toLowerCase());
          });
        }
      }
    }
    return rows;
  }, [dataFetch.data, query, colFilters, visibleColumns]);

  const handleOnChangePagination = (p: number) => {
    setParams((prev) => ({
      ...prev,
      page: p,
    }));
  };

  
  React.useEffect(() => {
    if (url) {
      api
        .get<PaginatedResponse<T>>(url, {
          params: {
            page: 1,
            per_page: DEFAULT_PER_PAGE,
          },
        })
        .then((res) => {
          setDataFetch(res.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [url]);

  React.useEffect(() => {
    setParams((prev: any) => ({
      ...prev,
      searchFields: colFilters, // map langsung colFilters
      search: query, // global search
    }));
  }, [colFilters, query]);
  React.useEffect(() => {
    if (url) {
      const reqParams: any = {
        page: params.page,
        per_page: params.per_page,
        sort: params.sort,
        order: params.order,
      };

      // global search
      if (params.search) reqParams.search = params.search;

      // search array
      if (params.searchFields) {
        Object.entries(params.searchFields).forEach(([key, value]) => {
          if (value) {
            reqParams[`search[${key}]`] = value;
          }
        });
      }

      api
        .get<PaginatedResponse<T>>(url, { params: reqParams })
        .then((res) => setDataFetch(res.data))
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [url, params]);


  React.useEffect(() => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.per_page) query.set("per_page", String(params.per_page));
    if (params.sort) query.set("sort", params.sort);
    if (params.order) query.set("order", params.order);

    // global search
    if (params.search) query.set("search", params.search);

    // search array (colFilters)
    if (params.searchFields) {
      Object.entries(params.searchFields).forEach(([key, value]) => {
        if (value) {
          query.set(`search[${key}]`, value);
        }
      });
    }

    router.replace(`?${query.toString()}`);
  }, [params, router]);


  
  return (
    <div className={`table-responsive-${responsiveBreakpoint} min-vh-100`}>
      <TableBootstrap
        className="bordered-table mb-0"
        responsive
        striped={striped}
        hover={hover}
        bordered={bordered}
        size={size}
      >
        {caption && <caption className="px-2">{caption}</caption>}
        <thead className={`${stickyHeader ? "" : ""} bg-body-tertiary`}>
          <tr>
            {visibleColumns?.map((col, idx) => {
              const isSorted = sortBy === col.attribute && !!sortDir;
              const canSort = !!col.sortable || col.sortable === undefined;
              return (
                <th
                  key={idx}
                  scope="col"
                  className={` ${canSort ? "user-select-none" : ""}`}
                >
                  <div
                    className={`d-flex align-items-center justify-content-between gap-2 ${
                      canSort ? "cursor-pointer text-primary" : ""
                    }`}
                    role={canSort ? "button" : undefined}
                    onClick={() => onSort(col)}
                  >
                    <span>{col.header ? col.header() : col.label}</span>
                    {canSort && (
                      <Icon
                        icon={
                          !isSorted
                            ? "mdi:sort-ascending"
                            : sortDir === "asc"
                            ? "mdi:sort-ascending"
                            : "mdi:sort-descending"
                        }
                      />
                    )}
                  </div>
                  {/* Column filter UI */}
                  {col.filter && (
                    <div className="mt-2">
                      {col.filter === "text" && (
                        <Input 
                          placeholder={col.filterPlaceholder ?? "Filter kolom"}
                          value={colFilters[String(col.attribute)] ?? ""}
                          onChange={(e) =>
                            setColFilters((s) => ({
                              ...s,
                              [String(col.attribute)]: e.target.value,
                            }))
                          }
                        />
                      )}
                      {col.filter === "select" && (
                        <select
                          className="form-select form-select-sm"
                          value={colFilters[String(col.attribute)] ?? ""}
                          onChange={(e) =>
                            setColFilters((s) => ({
                              ...s,
                              [String(col.attribute)]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Semua</option>
                          {(col.filterOptions ?? []).map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, idx) =>
              renderRow ? (
                <React.Fragment key={idx}>{renderRow(row)}</React.Fragment>
              ) : (
                <tr key={idx}>
                  {visibleColumns?.map((col, i) => (
                    <td key={i} data-label={col.label}>
                      {col.value ? col.value(row) : String((row as any)[col.attribute] ?? "")}
                    </td>
                  ))}
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={visibleColumns.length} className="p-4 text-center text-secondary">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </TableBootstrap>

      <Pagination
        total={dataFetch.total}
        perPage={DEFAULT_PER_PAGE}
        onPageChange={handleOnChangePagination}
        page={params.page}
      />

      <style jsx>{`
        @media (max-width: 576px) {
          td[data-label]::before {
            content: attr(data-label) ": ";
            font-weight: 600;
            display: inline-block;
            margin-right: 0.5rem;
            color: var(--bs-secondary-color);
          }
        }
      `}</style>
    </div>
  );
}
