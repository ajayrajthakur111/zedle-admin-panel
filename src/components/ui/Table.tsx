// src/components/ui/Table.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowClassName?: (row: T, index: number) => string;
  footer?: React.ReactNode;
  pagination?: PaginationProps;
  className?: string;
  renderRowIcon?: (row: T, rowIndex: number) => React.ReactNode | null;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end space-x-2 py-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 bg-surface rounded-md text-primary disabled:opacity-50"
      >
        &lt;
      </button>
      <span className="text-sm text-secondary">
        Page{" "}
        <span className="font-semibold text-primary">{currentPage}</span> of{" "}
        <span className="font-semibold text-primary">{totalPages}</span>
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-surface rounded-md text-primary disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  rowClassName,
  footer,
  pagination,
  className = "",
  renderRowIcon,
}: TableProps<T>) {
  return (
    // 1) Make the very outermost wrapper allow visible overflow:
    <div className={twMerge("relative overflow-visible", className)}>
      {/*
        2) **Remove** overflow-x-auto here. Instead, just let it be visible.
           If you absolutely need horizontal scroll later, wrap the table 
           in a separate container. For now, we need negative-left icons 
           to show up, so this must be overflow-visible.
      */}
      <div className="w-full overflow-visible ">
        <table className="min-w-full border-separate border-spacing-y-1">
          {/* HEADER */}
          <thead>
            <tr>
              <td colSpan={columns.length} className="p-0">
              <div className="rounded-lg bg-[#FFF9FFB5] flex w-full h-12 items-center">
                {columns.map((col, idx) => (
                <div
                  key={idx}
                  className={twMerge(
                  "flex-1 text-primary text-sm font-semibold text-left py-2 px-3",
                  col.width ?? "",
                  col.className ?? ""
                  )}
                >
                  {col.header}
                </div>
                ))}
              </div>
              </td>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-muted text-base"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const extraRowClass = rowClassName
                  ? rowClassName(row, rowIdx)
                  : "";

                return (
                  // Mark each <tr> as relative, so its children’s absolute icons use it as a containing block:
                  <tr key={rowIdx} className="relative">
                    <td colSpan={columns.length} className="p-0">
                      <div
                        className={twMerge(
                          // 3) The inner row container MUST be overflow-visible, not hidden:
                          "bg-[#FFFFFF42] rounded-md overflow-visible items-center h-12",
                          "flex w-full relative",
                          "shadow-sm",
                          extraRowClass
                        )}
                      >
                        {/*
                          4) Now your icon can sit at -left-8 without being clipped.
                        */}
                        {renderRowIcon && (
                          <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
                            {renderRowIcon(row, rowIdx)}
                          </div>
                        )}

                        {columns.map((col, colIdx) => (
                          <div
                            key={colIdx}
                            className={twMerge(
                              "flex-1 py-3 px-4 text-sm  text-primary",
                              col.className
                            )}
                          >
                            {col.cell
                              ? col.cell(row)
                              : row[col.accessor as keyof T]}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER (e.g. Totals) */}
      {footer && <div className="mt-4 ml-30 flex justify-start">{footer}</div>}

      {/* PAGINATION */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
