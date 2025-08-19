'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import SearchFilter from './Filters/SearchFilter';
import DateRangeFilter from './Filters/DateRangeFilter';
import StatusFilter from './Filters/StatusFilter';
import Table from './AdminTable/Table';
import AccountActions from './AccountActions';
import PageHeader from './PageHeader';
import Pagination from './Pagination';
import { format } from 'date-fns';

type Account = {
  id: number;
  ownerName: string;
  postsCreated: number;
  postsFound: number;
  createdDate: string; // YYYY-MM-DD
  lastLogin: string;
  status: 'Active' | 'Disabled';
};

// Dữ liệu mẫu (hardcoded, thay bằng API sau)
const data: Account[] = [
  {
    id: 1,
    ownerName: 'Nguyễn Văn A',
    postsCreated: 15,
    postsFound: 5,
    createdDate: '2023-01-10',
    status: 'Active',
    lastLogin: '2023-02-15',
  },
  {
    id: 2,
    ownerName: 'Trần Thị B',
    postsCreated: 8,
    postsFound: 2,
    createdDate: '2024-02-15',
    status: 'Disabled',
    lastLogin: '2023-02-15',

  },
  {
    id: 3,
    ownerName: 'Lê Văn C',
    postsCreated: 20,
    postsFound: 10,
    createdDate: '2023-11-20',
    status: 'Active',
    lastLogin: '2023-02-15',

  },
  {
    id: 4,
    ownerName: 'Phạm Thị D',
    postsCreated: 3,
    postsFound: 0,
    createdDate: '2024-03-05',
    status: 'Active',
    lastLogin: '2023-02-15',

  },
  {
    id: 5,
    ownerName: 'Hoàng Văn E',
    postsCreated: 12,
    postsFound: 4,
    createdDate: '2023-08-12',
    status: 'Disabled',
    lastLogin: '2023-02-15',

  },
  {
    id: 6,
    ownerName: 'Lý Lệ Hà',
    postsCreated: 12,
    postsFound: 4,
    createdDate: '2023-08-12',
    status: 'Disabled',
    lastLogin: '2023-02-15',

  },
];

export default function AccountManagerTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((account) => {
      let matches = true;

      if (statusFilter && account.status !== statusFilter) matches = false;
      const createdDate = new Date(account.createdDate);
      if (startDate && createdDate < startDate) matches = false;
      if (endDate && createdDate > endDate) matches = false;

      return matches;
    });
  }, [startDate, endDate, statusFilter]);

  const columns = useMemo<ColumnDef<Account>[]>(
    () => [
      { accessorKey: 'id', header: 'STT', cell: ({ row }) => row.index + 1 },
      { accessorKey: 'ownerName', header: 'Tên chủ tài khoản' },
      { accessorKey: 'postsCreated', header: 'Số bài posts đã đăng' },
      { accessorKey: 'postsFound', header: 'Số bài post tìm được' },
      {
        accessorKey: 'createdDate',
        header: 'Ngày tạo',
        cell: ({ row }) => format(new Date(row.original.createdDate), 'dd/MM/yyyy'),
      },
      { accessorKey: 'lastLogin', header: 'Lần đăng nhập cuối', cell: ({ row }) => row.original.lastLogin || 'Chưa đăng nhập' },
      { accessorKey: 'status', header: 'Trạng thái' },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => <AccountActions isDisabled={row.original.status === 'Disabled'} />,
      },
      
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, columnFilters, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Số mục trên mỗi trang
      },
    },
    globalFilterFn: 'includesString',
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <PageHeader title="Quản lý tài khoản" />
        <div className="flex flex-wrap gap-4 mb-4">
          <SearchFilter value={globalFilter} onChange={setGlobalFilter} />
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <div className="ml-auto text-gray-600">Hiện có {filteredData.length} tài khoản.</div>
        </div>
        <Table table={table} />
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </div>
  );
}