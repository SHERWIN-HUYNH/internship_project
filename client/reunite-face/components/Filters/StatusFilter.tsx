import React from 'react';

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2"
    >
      <option value="">Tất cả trạng thái</option>
      <option value="Active">Active</option>
      <option value="Disabled">Disabled</option>
    </select>
  );
}