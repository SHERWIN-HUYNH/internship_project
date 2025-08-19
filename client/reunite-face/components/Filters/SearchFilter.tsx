import React from 'react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <input
      type="text"
      placeholder="Tìm kiếm theo tên"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2 w-64"
    />
  );
}