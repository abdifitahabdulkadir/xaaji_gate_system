'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import TableSearchInput from '../shared/TableSearchInput'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function UsersTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      pagination,
    },
  })

  return (
    <div className="overflow-hidden ">
      <div className="my-3 px-2">
        <p>Search Results:{table.getRowCount()}</p>
        <TableSearchInput
          filters={[
            {
              label: 'Name',
              columnId: 'name',
            },
            {
              label: 'Email',
              columnId: 'email',
            },
          ]}
          table={table}
        />
      </div>
      <Table className="border rounded-4xl">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full mt-5  border px-3 py-2 flex mx-auto gap-4 items-center justify-center">
        <p className="font-medium text-foreground">
          Current Page: {table.getState().pagination.pageIndex + 1}
        </p>
        <Button
          className="h-10"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage() || !data.length}
        >
          First Page
        </Button>
        <Button
          className="h-10"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || !data.length}
        >
          Previous
        </Button>
        <Button
          className="h-10"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || !data.length}
        >
          Next
        </Button>
        <Button
          className="h-10"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage() || !data.length}
        >
          Last Page
        </Button>
        <Input
          disabled={!data.length}
          className="focus-visible:border-primary text-lg w-70 placeholder:text-sm border-primary/40 h-10"
          placeholder="Enter The page number to jump in"
          defaultValue={table.getState().pagination.pageIndex}
          onChange={(e) => {
            const pageIndex = Number(e.target.value)
            if (!isNaN(pageIndex) && pageIndex >= 1) {
              table.setPageIndex(pageIndex - 1)
            }
          }}
        />
        <p className="font-medium text-foreground">
          Total Number of Pages: {table.getPageCount()}
        </p>
      </div>
    </div>
  )
}
