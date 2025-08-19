'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import SearchFilter from './Filters/SearchFilter';
import GenderFilter from './Filters/GenderFilter';
import DateRangeFilter from './Filters/DateRangeFilter';
import ImageFilter from './Filters/ImageFilter';
import Table from './AdminTable/Table';
import ActionButtons from './ActionButtons';
import PageHeader from './PageHeader';
import { format } from 'date-fns';
import Pagination from './Pagination';

type MissingPerson = {
  id: number;
  name: string;
  gender: string;
  missingDate: string;
  location: string;
  image: string | null;
  description: string;
};

const data: MissingPerson[] = [
  {
    id: 1,
    name: 'Thái Văn Sơn',
    gender: 'Nam',
    missingDate: '2023-05-10',
    location: 'Hà Nội',
    image: '/assets/images/missing_people/person1.png',
    description: 'Mất tích khi đi du lịch miền núi...',
  },
  {
    id: 2,
    name: 'Đỗ Quang Huy',
    gender: 'Nam',
    missingDate: '2024-01-15',
    location: 'TP. Hồ Chí Minh',
    image: '/assets/images/missing_people/person5.png',
    description: 'Mất tích sau tai nạn giao thông...',
  },
  {
    id: 3,
    name: 'Đinh Kiều Linh',
    gender: 'Nữ',
    missingDate: '2023-05-10',
    location: 'Hà Nội',
    image: '/assets/images/missing_people/person2.png',
    description: 'Mất tích khi đi du lịch miền núi...',
  },
  {
    id: 4,
    name: 'Thái Thị Mỹ Lệ',
    gender: 'Nữ',
    missingDate: '2023-05-10',
    location: 'Hà Nội',
    image: '/assets/images/missing_people/person3.png',
    description: 'Mất tích khi đi du lịch miền núi...',
  },
  {
    id: 5,
    name: 'Đinh Tài Phúng',
    gender: 'Nam',
    missingDate: '2023-05-10',
    location: 'Hà Nội',
    image: '/assets/images/missing_people/person4.png',
    description: 'Mất tích khi đi du lịch miền núi...',
  },
];

export default function MissingPersonsTable() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [genderFilter, setGenderFilter] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((person) => {
      let matches = true;

      if (genderFilter && person.gender !== genderFilter) matches = false;
      if (hasImage && !person.image) matches = false;
      const missingDate = new Date(person.missingDate);
      if (startDate && missingDate < startDate) matches = false;
      if (endDate && missingDate > endDate) matches = false;

      return matches;
    });
  }, [startDate, endDate, hasImage, genderFilter]);

  const columns = useMemo<ColumnDef<MissingPerson>[]>(
    () => [
      { accessorKey: 'id', header: 'STT', cell: ({ row }) => row.index + 1 },
      { accessorKey: 'name', header: 'Tên' },
      { accessorKey: 'gender', header: 'Giới tính' },
      {
        accessorKey: 'missingDate',
        header: 'Thời gian mất tích',
        cell: ({ row }) => format(new Date(row.original.missingDate), 'dd/MM/yyyy'),
      },
      { accessorKey: 'location', header: 'Vị trí' },
      {
        accessorKey: 'image',
        header: 'Hình ảnh',
        cell: ({ row }) =>
          row.original.image ? (
            <img src={row.original.image} alt="Person" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            'Không có'
          ),
      },
      { accessorKey: 'description', header: 'Mô tả' },
      { id: 'actions', header: 'Thao tác', cell: () => <ActionButtons /> },
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
    getPaginationRowModel: getPaginationRowModel(), // Thêm phân trang
    initialState: {
      pagination: {
        pageSize: 5, // Số mục trên mỗi trang
      },
    },
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <PageHeader title="Quản lý bài đăng người mất tích" />
        <div className="flex flex-wrap gap-4 mb-4">
          <SearchFilter value={globalFilter} onChange={setGlobalFilter} />
          <GenderFilter value={genderFilter} onChange={setGenderFilter} />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <ImageFilter value={hasImage} onChange={setHasImage} />
          <div className="ml-auto text-gray-600">Hiện có {filteredData.length} dữ liệu bài đăng.</div>
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