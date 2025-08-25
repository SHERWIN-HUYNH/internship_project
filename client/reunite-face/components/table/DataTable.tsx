'use client'

import {
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'
import { Input } from '../ui/input'
import { MoveLeft, MoveRight } from 'lucide-react'
import { NOT_FOUND } from '@/validation/messageCode/commonMessageCode'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  return (
    <div className="data-table">
      <div className="table-header flex items-center justify-between mb-3">
        <div className="">
          <Input
            placeholder="Missing people name..."
            value={table.getColumn('name')?.getFilterValue() as string}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded-2xl"
          />
        </div>
        <div className="flex gap-3">
          <div>
            <Input
              placeholder="Search by posters..."
              value={table.getColumn('poster')?.getFilterValue() as string}
              onChange={(event) => {
                console.log(
                  table.getColumn('poster')?.setFilterValue(event.target.value),
                )
                table.getColumn('poster')?.setFilterValue(event.target.value)
              }}
              className="max-w-sm rounded-2xl"
              
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="mr-2">
              Status:
            </label>
            <select
              id="status-filter"
              value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('status')?.setFilterValue(event.target.value)
              }
              className="p-2 border rounded-2xl"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="finding">Finding</option>
              <option value="found">Found</option>
              <option value="disable">Disable</option>
              
            </select>
          </div>
        </div>
      </div>

      <Table className="shad-table">
        <TableHeader className=" bg-dark-200 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header ">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className=" font-medium text-base"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                className="shad-table-row text-black"
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
                {NOT_FOUND}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          <MoveLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          <MoveRight />
        </Button>
      </div>
    </div>
  )
}
