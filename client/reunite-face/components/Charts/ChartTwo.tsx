'use client'

import { ApexOptions } from 'apexcharts'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface AppointmentData {
  year: number
  month: number
  totalAppointments: number
  totalAmount: number
}

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: { size: 5 },
  },
  fill: { opacity: 1 },
}

const ChartTwo: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const [selectedYear, setSelectedYear] = useState<number | string>(currentYear)
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[]>([])

  const fetchAppointmentsData = async () => {
    try {
      const response = await fetch(`/api/chart/chart2`)
      const data: AppointmentData[] = await response.json()
      setAppointmentsData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching appointment data:', error)
    }
  }

  useEffect(() => {
    fetchAppointmentsData()
  }, [])

  const filteredData = appointmentsData.filter(
    (data) => data.year === Number(selectedYear),
  )

  const monthlyAppointments = Array(12).fill(0)
  filteredData.forEach((data) => {
    monthlyAppointments[data.month - 1] += data.totalAppointments
  })

  const series = [
    {
      name: `Số lịch hẹn`,
      data: monthlyAppointments,
    },
  ]

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value)
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Thống kê lịch hẹn theo tháng
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="year"
              id="year"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {years.map((year) => (
                <option key={year} value={year} className="dark:bg-boxdark">
                  {year}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}

export default ChartTwo
