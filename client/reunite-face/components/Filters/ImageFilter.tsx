import React from 'react';

interface ImageFilterProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ImageFilter({ value, onChange }: ImageFilterProps) {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
      />
      Có ảnh người mất tích
    </label>
  );
}