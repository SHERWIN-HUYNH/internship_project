import React from 'react';
import { useReactTable } from '@tanstack/react-table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

interface TableProps<T> {
  table: ReturnType<typeof useReactTable<T>>;
}

export default function Table<T>({ table }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <TableHeader table={table} />
        <TableBody table={table} />
      </table>
    </div>
  );
}