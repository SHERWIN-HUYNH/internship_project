import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ChartOne from '@/components/Charts/ChartOne'
import ChartTwo from '@/components/Charts/ChartTwo'
import { AppointmentReport, fetchAppointmentData } from '@/helper/chart'
import dynamic from 'next/dynamic'
import * as XLSX from 'xlsx'
import { REPORT_NOT_FOUND } from '@/validation/messageCode/apiMessageCode/chart'

interface AppointmentData {
  year: number
  month: number
  totalAppointments: number
  totalAmount: number
  appointments: {
    id: string;
    date: string;
    price: number;
    serviceName: string;
    facultyName: string;
  }[];  
}

const ChartThree = dynamic(() => import('@/components/Charts/ChartThree'), {
  ssr: false,
})

const Chart: React.FC = () => {
  const [statistics, setStatistics] = useState<AppointmentReport[]>([])
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[]>([])
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(new Date().getMonth() + 1)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAppointmentData()
      if (data.length === 0) {
        console.warn(REPORT_NOT_FOUND)
      }
      setStatistics(data)
    }

    loadData()
  }, [])

  useEffect(() => {
    const fetchAppointmentsData = async () => {
      try {
        const response = await fetch(`/api/chart/chart2`)
        const data = await response.json()
        setAppointmentsData(data)
      } catch (error) {
        console.error('Error fetching appointment data:', error)
      }
    }

    fetchAppointmentsData()
  }, [])

  const handleExportReport = () => {
    const filteredData = appointmentsData.filter(
      (data) =>
        (selectedYear === 'all' || data.year === selectedYear) &&
        (selectedMonth === 'all' || data.month === selectedMonth)
    )

    const groupedData = filteredData.reduce(
      (acc, curr) => {
        const yearKey = `${curr.year}`

        if (!acc[yearKey]) {
          acc[yearKey] = {
            year: curr.year,
            totalAppointments: 0,
            totalAmount: 0,
            months: {},
          }
        }

        acc[yearKey].totalAppointments += curr.totalAppointments
        acc[yearKey].totalAmount += curr.totalAmount
        const monthKey = curr.month

        if (!acc[yearKey].months[monthKey]) {
          acc[yearKey].months[monthKey] = {
            totalAppointments: 0,
            totalAmount: 0,
            faculties: {},
          }
        }

        acc[yearKey].months[monthKey].totalAppointments += curr.totalAppointments
        acc[yearKey].months[monthKey].totalAmount += curr.totalAmount

        curr.appointments.forEach((appointment) => {
          const facultyName = appointment.facultyName || 'Không xác định'
          const serviceName = appointment.serviceName || 'Không xác định'

          if (!acc[yearKey].months[monthKey].faculties[facultyName]) {
            acc[yearKey].months[monthKey].faculties[facultyName] = {}
          }

          if (!acc[yearKey].months[monthKey].faculties[facultyName][serviceName]) {
            acc[yearKey].months[monthKey].faculties[facultyName][serviceName] = {
              totalAppointments: 0,
              totalAmount: 0,
            }
          }

          acc[yearKey].months[monthKey].faculties[facultyName][
            serviceName
          ].totalAppointments += 1
          acc[yearKey].months[monthKey].faculties[facultyName][serviceName].totalAmount +=
            appointment.price || 0
        })

        return acc
      },
      {} as Record<
        string,
        {
          year: number
          totalAppointments: number
          totalAmount: number
          months: Record<
            number,
            {
              totalAppointments: number
              totalAmount: number
              faculties: Record<
                string,
                Record<
                  string,
                  {
                    totalAppointments: number
                    totalAmount: number
                  }
                >
              >
            }
          >
        }
      >
    );

    let reportData: any[] = [];
    Object.values(groupedData).forEach((group) => {
      const { year, months } = group
      reportData.push({
        Nam: year,
        Thang: '',
        ChuyenKhoa: '',
        DichVu: '',
        SoCuocHen: group.totalAppointments,
        DoanhThu: group.totalAmount.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }),
      });

      Object.entries(months).forEach(([month, monthData]) => {
        reportData.push({
          Nam: '',
          Thang: month,
          ChuyenKhoa: '',
          DichVu: '',
          SoCuocHen: monthData.totalAppointments,
          DoanhThu: monthData.totalAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }),
        })
        Object.entries(monthData.faculties).forEach(([facultyName, services]) => {
          Object.entries(services).forEach(([serviceName, stats]) => {
            reportData.push({
              Nam: '',
              Thang: '',
              ChuyenKhoa: facultyName,
              DichVu: serviceName,
              SoCuocHen: stats.totalAppointments,
              DoanhThu: stats.totalAmount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }),
            });
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Báo Cáo");
    XLSX.writeFile(workbook, "bao_cao.xlsx");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb pageName={[['Thống kê', '/admin/chart']]} />
        <div className="flex space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tất cả</option>
            {[2020, 2021, 2022, 2023, 2024].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tất cả</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <option key={month} value={month}>
                {month < 10 ? `0${month}` : month}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
          >
            Xuất Báo Cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-8">
          <div className="h-full bg-white rounded-lg shadow">
            <ChartOne />
          </div>
        </div>
        <div className="col-span-4 bg-white show border-stroke shadow-default">
          <div className="h-full rounded-sm shadow">
            <ChartThree />
          </div>
        </div>

        <div className="col-span-7">
          <ChartTwo />
        </div>

        <div className="col-span-5">
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="w-12 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Năm
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Tháng
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Số Cuộc Hẹn
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Doanh Thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {appointmentsData
                  .filter(
                    (data) =>
                      (selectedYear === 'all' || data.year === selectedYear) &&
                      (selectedMonth === 'all' || data.month === selectedMonth)
                  )
                  .map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-900 sm:pl-6">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.year}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.month}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.totalAppointments}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{item.totalAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chart
