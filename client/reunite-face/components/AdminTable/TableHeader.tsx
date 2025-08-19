import React from 'react';
import { flexRender, useReactTable } from '@tanstack/react-table';

interface TableHeaderProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function TableHeader<T>({ table }: TableHeaderProps<T>) {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-primary text-white">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="px-4 py-2 text-left cursor-pointer"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
                asc: ' 🔼',
                desc: ' 🔽',
              }[header.column.getIsSorted() as string] ?? null}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}