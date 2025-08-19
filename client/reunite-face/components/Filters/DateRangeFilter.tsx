import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex gap-2">
      <DatePicker
        selected={startDate}
        onChange={onStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Từ ngày"
        className="border border-gray-300 rounded-md px-4 py-2"
      />
      <DatePicker
        selected={endDate}
        onChange={onEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate ?? undefined}
        placeholderText="Đến ngày"
        className="border border-gray-300 rounded-md px-4 py-2"
      />
    </div>
  );
}