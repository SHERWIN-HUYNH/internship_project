import React from 'react'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void // Type for the function that handles page changes
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = []

    // Luôn hiển thị trang đầu
    if (currentPage > 3) {
      pages.push(
        <Button
          key={1}
          onClick={() => onPageChange(1)}
          className={clsx('px-3 py-3 w-8 h-8 rounded-md text-xs font-semibold', {
            'bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] text-white': currentPage === 1,
            'bg-slate-100 text-primary': currentPage !== 1,
          })}
        >
          1
        </Button>,
      )

      // Thêm dấu ...
      if (currentPage > 4) {
        pages.push(
          <span key="ellipsis1" className="px-3 w-8 h-8">
            ...
          </span>,
        )
      }
    }

    // Hiển thị các trang xung quanh trang hiện tại
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          className={clsx('px-3 py-3 w-8 h-8 rounded-sm', {
            'bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] text-white': currentPage === i,
            'bg-slate-100 text-primary': currentPage !== i,
          })}
        >
          {i}
        </Button>,
      )
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={clsx('px-3 py-3 w-8 h-8 rounded-sm', {
            'bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] text-white':
              currentPage === totalPages,
            'bg-slate-100 text-primary': currentPage !== totalPages,
          })}
        >
          {totalPages}
        </Button>,
      )
    }

    return pages
  }

  return (
    <div className="p-4 flex items-center justify-center gap-2 relative min-w-[300px]">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={clsx(
          'absolute left-0 py-3 px-3 w-8 h-8 rounded-md bg-slate-100 text-primary text-sm font-semibold',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        &lt;
      </Button>

      <div className="flex items-center gap-2 mx-12">{renderPageNumbers()}</div>
      <div className="text-sm text-slate-500">
        Trang {currentPage} của {totalPages} trang
      </div>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={clsx(
          'absolute right-0 py-3 px-3 w-8 h-8 rounded-md bg-slate-100 text-primary text-sm font-semibold',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        &gt;
      </Button>
    </div>
  )
}

export default Pagination
