'use client'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import { Checkbox } from '../ui/checkbox'
import { StatusSelect } from '../StatusSelect'
import { PostAdmin } from '@/test/interface'
import { formatDate } from '@/helper/formatDate'
import Link from 'next/link'
export const columns: ColumnDef<PostAdmin>[] = [
  {
    header: 'STT',
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>
    },
  },
  {
    accessorKey: 'name',
    header: 'Missing person name',
    cell: ({ row }) => {
      const posts = row.original
      return <p className="text-14-medium ">{posts.name}</p>
    },
    accessorFn: (row) => row.name, 
    filterFn: (row, columnId, filterValue) => {
      const patientName = row.getValue<string>(columnId)
      return patientName.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const post = row.original
      const status = post.status.toLowerCase()
      return (
        <div className="min-w-[115px]">
          <StatusSelect value={status} postId={post.post_id} onStatusChange={(newStatus: string) => {
           
            console.log('New status selected:', newStatus);
          }} />
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const status = row.getValue<string>(columnId);
      console.log('FILTERING WORKING', status, filterValue)
      return status.toLowerCase() === filterValue.toLowerCase();
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date created',
    cell: ({ row }) => {
      const post = row.original
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDate(post.create_at)}
        </p>
      )
    },
  },
  {
    accessorKey: 'missing_since',
    header: 'Missing since',
    cell: ({ row }) => {
      const post = row.original
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDate(post.missing_since) }
        </p>
      )
    },
  },
  {
    accessorKey: 'poster',
    header: 'Poster name',
    cell: ({ row }) => {
      const posts = row.original
      

      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">{posts.author_name}</p>
        </div>
      )
    },
    accessorFn: (row) => row.author_name, 
    filterFn: (row, columnId, filterValue) => {
      const authorName = row.getValue<string>(columnId)
      return authorName.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    id: 'actions',
    header: () => <div className="pl-4">Action</div>,
    cell: ({ row }) => {
      const post = row.original

      return (
        <Link className="flex gap-1 text-red-500" href={`/missingInfor/${post.post_id}`}>
            Details
        </Link>
      )
    },
  },
]
