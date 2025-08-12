import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { StatusIcon } from '@/constants'

export const StatusBadge = ({ status }: any) => {
  return (
    <div
      className={clsx('status-badge', {
        'bg-[#fff9db]': status === 'scheduled',
        'bg-[#e0f7fc]': status === 'pending',
        'bg-[#fdecea]': status === 'cancelled',
      })}
    >
      <Image
        src={StatusIcon['scheduled']}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx('text-12-semibold capitalize', {
          'text-green-600': status === 'scheduled',
          'text-blue-600': status === 'pending',
          'text-red-600': status === 'cancelled',
        })}
      >
        {status}
      </p>
    </div>
  )
}
