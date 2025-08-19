import React from 'react';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
      <button className="bg-primary text-white px-4 py-2 rounded-md">Thêm Bài Đăng</button>
    </div>
  );
}