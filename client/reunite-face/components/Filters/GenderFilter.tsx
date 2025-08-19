import React from 'react';

interface GenderFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2"
    >
      <option value="">Tất cả giới tính</option>
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
      <option value="Khác">Khác</option>
    </select>
  );
}