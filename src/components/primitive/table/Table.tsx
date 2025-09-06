"use client";

import { Icon } from "@iconify/react";
import * as React from "react";
import { Table as TableBootstrap } from "react-bootstrap";
import Pagination from "../pagination/Pagination";
import api from "@/api/api";

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
  data: T[];
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

  /** New: callback ketika sort berubah */
  onSortChange?: (args: { sortBy: keyof T | null; sortDir: SortDirection }) => void;

  /** New: callback ketika filter berubah (termasuk global search) */
  onFilterChange?: (args: {
    query: string;
    columnFilters: Record<string, string>;
  }) => void;
};

const DEFAULT_PER_PAGE = 10;

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
  // NEW callbacks
  onSortChange,
  onFilterChange,
}: TableProps<T>) {
  const [dataFetch, setDataFetch] = React.useState<T[]>( []);
  const [params, setParams] = React.useState({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    sort: "",
    order: "",
    search: "",
  });

  // Visible columns (yang show !== false)
  const visibleColumns = React.useMemo(
    () =>
      columns?
        .filter((col) => col.show !== false)
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

  // Sorting
  const [sortBy, setSortBy] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);

  // === onSort (NEW: panggil onSortChange) ===
  const onSort = (col: ColumnConfig<T>) => {
    if (col.sortable === false) return;
    const colKey = col.attribute;

    // hitung next state terlebih dahulu (avoid async setState race)
    let nextSortBy: keyof T | null = sortBy;
    let nextSortDir: SortDirection = sortDir;

    if (sortBy !== colKey) {
      nextSortBy = colKey;
      nextSortDir = "asc";
    } else {
      nextSortDir = sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc";
      // jika null, kita tetap pertahankan sortBy agar ikon tahu kolom aktif,
      // atau bisa juga reset ke null. Di sini biarkan sortBy tetap agar UI jelas.
    }
    setSortBy(nextSortBy);
    setSortDir(nextSortDir);

    // callback untuk parent
    onSortChange?.({ sortBy: nextSortBy, sortDir: nextSortDir });
  };

  // === onFilter (NEW: panggil onFilterChange) ===
  React.useEffect(() => {
    onFilterChange?.({ query, columnFilters: colFilters });
  }, [query, colFilters, onFilterChange]);

  const filteredData = React.useMemo(() => {
    let rows = [...dataFetch?.data || []];

    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((row) =>
        visibleColumns.some((c) => {
          const cell = c.value ? c.value(row) : (row as any)[c.attribute];
          const text = typeof cell === "string" ? cell : String(cell ?? "");
          return text.toLowerCase().includes(q);
        })
      );
    }

    if(visibleColumns){
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

    // Sorting
    if (sortBy && sortDir) {
      const col = visibleColumns.find((c) => c.attribute === sortBy);
      if (col) {
        const accessor = (r: T) =>
          col.sortAccessor ? col.sortAccessor(r) : ((r as any)[col.attribute] as any);

        rows.sort((a, b) => {
          const av = accessor(a);
          const bv = accessor(b);

          const parseVal = (v: any) => {
            if (v instanceof Date) return v.getTime();
            if (typeof v === "string") return v.toString().toLowerCase();
            if (typeof v === "boolean") return v ? 1 : 0;
            if (v == null) return -Infinity; // nulls last
            return v as any;
          };

          const A = parseVal(av);
          const B = parseVal(bv);
          if (A < B) return sortDir === "asc" ? -1 : 1;
          if (A > B) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }

    return rows;
  }, [ query, colFilters, sortBy, sortDir, visibleColumns]);

  const handleOnChangePagination = (p: number) => {
    console.log("Ganti halaman ke:", p);
  }

  React.useEffect(() => {
    setColFilters({});
    setQuery("");
    setSortBy(null);
    setSortDir(null);

    api.get(url || "/users", {
      params: {
        page: 1,
        per_page: DEFAULT_PER_PAGE,
      },
    }).then((res) => {
      console.log(res)
      setDataFetch(res.data);
    }).catch((err) => {
      console.error("Error fetching data:", err);
    });
  }, []);

  return (
    <div className={`table-responsive-${responsiveBreakpoint} min-vh-100 `}>
      {/* Global toolbar */}
        <TableBootstrap
          className="bordered-table mb-0 "
          responsive
          striped={striped}
          hover={hover}
          bordered={bordered}
          size={size}
        >
          {caption && <caption className="px-2">{caption}</caption>}
          <thead className={`${stickyHeader ? "sticky-top" : ""} bg-body-tertiary`}>
            <tr>
              {visibleColumns?.map((col, idx) => {
                const isSorted = sortBy === col.attribute && !!sortDir;
                const canSort = !!col.sortable || (col.sortable == undefined);
                return (
                  <th
                    key={idx}
                    scope="col"
                    className={`text-nowrap ${canSort ? "user-select-none" : ""}`}
                  >
                    <div
                      className={`d-flex align-items-center justify-content-between gap-2 ${canSort ? "cursor-pointer  text-primary " : ""}`}
                      role={canSort ? "button" : undefined}
                      onClick={() => onSort(col)}
                    >
                      <span>{col.header ? col.header() : col.label}</span>
                      {canSort && (
                        <Icon
                          icon={`${
                            !isSorted
                              ? "mdi:sort-ascending"
                              : sortDir === "asc"
                              ? "mdi:sort-ascending"
                              : "mdi:sort-descending"
                          }`}
                        />
                      )}
                    </div>
                    {/* Column filter UI */}
                    {col.filter && (
                      <div className="mt-2">
                        {col.filter === "text" && (
                          <input
                            className="form-control form-control-sm"
                            placeholder={col.filterPlaceholder ?? "Filter kolom"}
                            value={colFilters[String(col.attribute)] ?? ""}
                            onChange={(e) =>
                              setColFilters((s) => ({ ...s, [String(col.attribute)]: e.target.value }))
                            }
                          />
                        )}
                        {col.filter === "select" && (
                          <select
                            className="form-select form-select-sm"
                            value={colFilters[String(col.attribute)] ?? ""}
                            onChange={(e) =>
                              setColFilters((s) => ({ ...s, [String(col.attribute)]: e.target.value }))
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
        total={dataFetch?.total}
        perPage={DEFAULT_PER_PAGE}
        onPageChange={handleOnChangePagination}
        page={1}
      />

      <style jsx>{`
        /* Mobile-friendly label when stacking cells */
        @media (max-width: 576px) {
          td[data-label]::before {
            content: attr(data-label) ": ";
            font-weight: 600;
            display: inline-block;
            margin-right: .5rem;
            color: var(--bs-secondary-color);
          }
        }
      `}</style>
    </div>
  );
}
