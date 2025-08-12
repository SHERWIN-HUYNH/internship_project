'use client'
import { AppointmentSchedule } from '@/test/interface'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { StatusBadge } from '../StatusBadge'
export const columns: ColumnDef<AppointmentSchedule>[] = [
  {
    header: 'STT',
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>
    },
  },
  {
    accessorKey: 'patient',
    header: 'Bệnh nhân',
    // enableColumnFilter: true,
    cell: ({ row }) => {
      const appointment = row.original
      return <p className="text-14-medium ">{appointment.profile.name}</p>
    },
    accessorFn: (row) => row.profile.name, // Extract the patient name for display and filtering
    filterFn: (row, columnId, filterValue) => {
      const patientName = row.getValue<string>(columnId)
      return patientName.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const appointment = row.original
      const status = appointment.status.toLowerCase()
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={status} />
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Ngày',
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <p className="text-14-regular min-w-[100px]">
          02/05/2003
        </p>
      )
    },
  },
  {
    accessorKey: 'timeSlot',
    header: 'Thời gian',
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <p className="text-14-regular min-w-[100px]">
          10:30
        </p>
      )
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Bác sĩ',
    // enableColumnFilter: true,
    cell: ({ row }) => {
      const appointment = row.original
      const doctor = appointment.doctorSchedule.doctor

      return (
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      )
    },
    accessorFn: (row) => row.doctorSchedule.doctor?.name || '', // Extract the doctor name
    filterFn: (row, columnId, filterValue) => {
      const doctorName = row.getValue<string>(columnId)
      return doctorName.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  // {
  //   id: 'actions',
  //   header: () => <div className="pl-4">Xem chi tiết</div>,
  //   cell: ({ row }) => {
  //     const appointment = row.original

  //     return (
  //       <div className="flex gap-1">
  //         <AppointmentModal
  //           patientId={appointment.profile.id}
  //           userId={appointment.profile.userId}
  //           appointment={appointment}
  //           type="Chi tiết"
  //           title="Schedule Appointment"
  //           description="Please confirm the following details to schedule."
  //         />
  //         {appointment.status == 'PENDING' && (
  //           <AppointmentModal
  //             patientId={appointment.profile.id}
  //             userId={appointment.profile.userId}
  //             appointment={appointment}
  //             type="Hủy"
  //             title="Cancel Appointment"
  //             stripeCustomerId={appointment.stripeCustomerId}
  //             description="Are you sure you want to cancel your appointment?"
  //           />
  //         )}
  //       </div>
  //     )
  //   },
  // },
]
