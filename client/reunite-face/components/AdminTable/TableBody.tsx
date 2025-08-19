import React from 'react';
import { flexRender, useReactTable } from '@tanstack/react-table';

interface TableBodyProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function TableBody<T>({ table }: TableBodyProps<T>) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="border-b hover:bg-gray-100">
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}