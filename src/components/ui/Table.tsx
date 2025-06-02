/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/Table.tsx
import React from "react";
import { twMerge } from "tailwind-merge";

export interface Column<T> {
  /** Text to display in the header cell */
  header: string;
  /**
   * A simple key to read from each row object (e.g. "agentId"),
   * OR any string if you plan to use `cell` instead.
   */
  accessor?: keyof T | string;
  /**
   * If you need custom rendering (colored text, icons, buttons, etc.),
   * supply a function here. It receives the entire row object.
   */
  cell?: (row: T) => React.ReactNode;
  /** Tailwind width (e.g. "w-24") or leave undefined for auto. */
  width?: string;
  /** Additional classes for this column's cells. */
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Array of row objects */
  data: T[];
  /**
   * Optional function to add a class on each <tr>.
   * (row, index) => string of Tailwind classes.
   */
  rowClassName?: (row: T, index: number) => string;
  /**
   * If you want a footer (e.g. “Total Units: … / Total Amount: …”),
   * pass any React node here. It will float at the bottom right.
   */
  footer?: React.ReactNode;
  /**
   * If you need pagination controls, supply these props.
   * A simple “Page <current> of <total>” with arrows.
   */
  pagination?: PaginationProps;
  /**
   * Extra classes for the outermost table container, if desired.
   */
  className?: string;
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
        Page <span className="font-semibold text-primary">{currentPage}</span>{" "}
        of <span className="font-semibold text-primary">{totalPages}</span>
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

/**
  Generic, reusable Table component.
  
  USAGE EXAMPLE (TypeScript):
  
  interface AgentRow {
    agentId: string;
    name: string;
    mobileNumber: string;
    deliveryTime: string;
    ratings: number;
    earnings: number;
  }
  
  const agentColumns: Column<AgentRow>[] = [
    { header: 'Agent ID', accessor: 'agentId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Mobile Number', accessor: 'mobileNumber' },
    {
      header: 'Delivery Time',
      cell: (row) => {
        const colorCls =
          row.deliveryTime === 'On Time'
            ? 'text-success'
            : row.deliveryTime === 'Delayed'
            ? 'text-amber-500'
            : 'text-destructive';
        return <span className={colorCls}>{row.deliveryTime}</span>;
      },
    },
    {
      header: 'Ratings (out of 5)',
      cell: (row) => (
        <span className="flex items-center">
          {'★'.repeat(row.ratings) + '☆'.repeat(5 - row.ratings)}
        </span>
      ),
    },
    {
      header: 'Earnings (In Rs)',
      accessor: 'earnings',
      cell: (row) => <span>{row.earnings.toLocaleString()},-/</span>,
    },
    {
      header: 'Info',
      cell: () => <a href="#" className="text-primary underline">View Details</a>,
    },
  ];
  
  function MyAgentTable() {
    const [page, setPage] = useState(1);
    // rows would come from API or mock
    const rows: AgentRow[] = [ / ... / ];
    return (
      <Table
        columns={agentColumns}
        data={rows}
        rowClassName={(row, idx) =>
          row.deliveryTime === 'Highly Delayed' ? 'bg-red-50' : idx % 2 === 1 ? 'bg-surface' : 'bg-white'
        }
        footer={
          <div className="text-right text-secondary font-medium">
            Total Amount Collected: <span className="text-primary font-semibold">18,894/-</span>
          </div>
        }
        pagination={{
          currentPage: page,
          totalPages: 6,
          onPageChange: (p) => setPage(p),
        }}
      />
    );
  }
 */
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  rowClassName,
  footer,
  pagination,
  className = "",
}: TableProps<T>) {
  return (
    <div className={twMerge("w-full overflow-x-auto", className)}>
      <table className="min-w-full border-separate border-spacing-y-1">
        {/* HEADER */}
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={twMerge(
                  "bg-card text-secondary text-sm font-semibold py-2 px-3 text-left ",
                  col.width ?? "",
                  col.className ?? ""
                )}
              >
                {col.header}
              </th>
            ))}
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
                <tr key={rowIdx}>
                  <td colSpan={columns.length} className="p-0">
                    <div
                      className={twMerge(
                        "bg-[#ece8ec] rounded-md overflow-hidden",
                        "flex w-full",
                        "shadow-sm", // optional: slight shadow per row
                        extraRowClass
                      )}
                    >
                      {columns.map((col, colIdx) => (
                        <div
                          key={colIdx}
                          className={twMerge(
                            "flex-1 py-3 px-4 text-sm text-primary",
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
