"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  CircleX,
  GripVertical,
  LayoutList,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DataTableRowStatus = "done" | "in-process" | "cancelled" | "pending";

export interface DataTableRow {
  id: string;
  header: string;
  avatarSrc?: string;
  sectionType: string;
  status: DataTableRowStatus;
  target: number;
  limit: number;
  reviewer: string | null;
}

export interface DataTableColumnLabels {
  header?: string;
  sectionType?: string;
  target?: string;
  limit?: string;
  reviewer?: string;
  filterPlaceholder?: string;
  assignPlaceholder?: string;
}

export interface DataTableProps {
  rows: DataTableRow[];
  title?: string;
  description?: string;
  columnLabels?: DataTableColumnLabels;
  rowsPerPageOptions?: number[];
}

// ─── Faceted filter ───────────────────────────────────────────────────────────

function FacetFilter({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string; icon?: React.ElementType; iconClassName?: string }[];
  selected: string[];
  onSelect: (values: string[]) => void;
}) {
  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onSelect(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <CirclePlus className="size-3.5" />
          {label}
          {selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <span className="rounded-sm bg-primary/10 px-1 py-0.5 text-xs font-medium text-primary">
                {selected.length}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={selected.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            >
              {Icon && <Icon className={`mr-1 size-3.5 ${opt.iconClassName ?? ""}`} />}
              {opt.label}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-center text-xs"
              onSelect={() => onSelect([])}
            >
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Status cell ──────────────────────────────────────────────────────────────

function StatusCell({ status }: { status: DataTableRowStatus }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3.5" />
        Done
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
        <CircleX className="size-3.5" />
        Cancelled
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-amber-500 dark:text-amber-400">
        <AlertTriangle className="size-3.5" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Loader2 className="size-3.5 animate-spin" />
      In Process
    </span>
  );
}

// ─── Reviewer cell ────────────────────────────────────────────────────────────

function ReviewerCell({
  reviewer,
  assignPlaceholder = "Assign coach",
  onChange,
}: {
  reviewer: string | null;
  assignPlaceholder?: string;
  onChange?: (value: string) => void;
}) {
  if (reviewer) {return <span className="text-sm">{reviewer}</span>;}
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="h-7 w-35 text-xs">
        <SelectValue placeholder={assignPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="blardone">M. Blardone</SelectItem>
        <SelectItem value="krug">H. Krug</SelectItem>
        <SelectItem value="day">M. Day</SelectItem>
        <SelectItem value="pravda">C. Pravda</SelectItem>
      </SelectContent>
    </Select>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

function DataTable({
  rows,
  title = "Welcome back!",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  columnLabels = {},
  rowsPerPageOptions = [10, 20, 50],
}: DataTableProps) {
  const labels = {
    assignPlaceholder: columnLabels.assignPlaceholder ?? "Assign coach",
    filterPlaceholder: columnLabels.filterPlaceholder ?? "Filter athletes...",
    header: columnLabels.header ?? "Athlete",
    limit: columnLabels.limit ?? "Sessions",
    reviewer: columnLabels.reviewer ?? "Coach",
    sectionType: columnLabels.sectionType ?? "Discipline",
    target: columnLabels.target ?? "Goal",
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sectionTypeFilter, setSectionTypeFilter] = useState<string[]>([]);
  const [headerFilter, setHeaderFilter] = useState("");

  const sectionTypes = [...new Set(rows.map((r) => r.sectionType))];

  const columns: ColumnDef<DataTableRow>[] = [
    {
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      id: "select",
    },
    {
      cell: () => <GripVertical className="size-4 cursor-grab text-muted-foreground" />,
      enableHiding: false,
      enableSorting: false,
      header: () => null,
      id: "drag",
    },
    {
      accessorKey: "header",
      cell: ({ row }) => {
        const name: string = row.getValue("header");
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7 shrink-0">
              {row.original.avatarSrc && <AvatarImage src={row.original.avatarSrc} alt={name} />}
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate font-medium">{name}</span>
          </div>
        );
      },
      filterFn: (row, _id, value: string) =>
        row.original.header.toLowerCase().includes(value.toLowerCase()),
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {labels.header}
          <ChevronsUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
    },
    {
      accessorKey: "sectionType",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal">
          {row.getValue("sectionType")}
        </Badge>
      ),
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      header: () => labels.sectionType,
    },
    {
      accessorKey: "status",
      cell: ({ row }) => <StatusCell status={row.getValue("status")} />,
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ChevronsUpDown className="ml-1.5 size-3.5" />
        </Button>
      ),
    },
    {
      accessorKey: "target",
      cell: ({ row }) => <div className="text-right text-sm">{row.getValue("target")}</div>,
      header: () => <div className="text-right">{labels.target}</div>,
    },
    {
      accessorKey: "limit",
      cell: ({ row }) => <div className="text-right text-sm">{row.getValue("limit")}</div>,
      header: () => <div className="text-right">{labels.limit}</div>,
    },
    {
      accessorKey: "reviewer",
      cell: ({ row }) => (
        <ReviewerCell
          reviewer={row.getValue("reviewer")}
          assignPlaceholder={labels.assignPlaceholder}
        />
      ),
      enableSorting: false,
      header: () => labels.reviewer,
    },
    {
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View section</DropdownMenuItem>
            <DropdownMenuItem>Edit section</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete section</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableHiding: false,
      id: "actions",
    },
  ];

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { columnFilters, columnVisibility, rowSelection, sorting },
  });

  const handleHeaderFilter = (value: string) => {
    setHeaderFilter(value);
    table.getColumn("header")?.setFilterValue(value);
  };

  const handleStatusFilter = (values: string[]) => {
    setStatusFilter(values);
    table.getColumn("status")?.setFilterValue(values.length ? values : undefined);
  };

  const handleSectionTypeFilter = (values: string[]) => {
    setSectionTypeFilter(values);
    table.getColumn("sectionType")?.setFilterValue(values.length ? values : undefined);
  };

  const handlePageSize = (value: string) => {
    const size = Number(value);
    setPageSize(size);
    table.setPageSize(size);
  };

  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <Card data-slot="data-table" className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-6 pb-4">
          <Input
            placeholder={labels.filterPlaceholder}
            value={headerFilter}
            onChange={(e) => handleHeaderFilter(e.target.value)}
            className="h-8 max-w-50"
          />
          <FacetFilter
            label="Status"
            options={[
              {
                icon: CheckCircle2,
                iconClassName: "text-emerald-600 dark:text-emerald-400",
                label: "Done",
                value: "done",
              },
              {
                icon: Loader2,
                iconClassName: "text-muted-foreground animate-spin",
                label: "In Process",
                value: "in-process",
              },
              {
                icon: AlertTriangle,
                iconClassName: "text-amber-500 dark:text-amber-400",
                label: "Pending",
                value: "pending",
              },
              {
                icon: CircleX,
                iconClassName: "text-destructive",
                label: "Cancelled",
                value: "cancelled",
              },
            ]}
            selected={statusFilter}
            onSelect={handleStatusFilter}
          />
          <FacetFilter
            label={labels.sectionType}
            options={sectionTypes.map((t) => ({ label: t, value: t }))}
            selected={sectionTypeFilter}
            onSelect={handleSectionTypeFilter}
          />
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <LayoutList className="size-3.5" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize"
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="px-6">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.id === "select" || header.column.id === "actions"
                          ? "w-10 px-3"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "select" || cell.column.id === "actions"
                            ? "w-10 px-3"
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-3">
          <p className="text-sm text-muted-foreground">
            {selectedRows} of {totalRows} row(s) selected.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={String(pageSize)} onValueChange={handlePageSize}>
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label="First page"
              >
                <ChevronsLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Next page"
              >
                <ChevronRight className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label="Last page"
              >
                <ChevronsRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { DataTable };
export default DataTable;
