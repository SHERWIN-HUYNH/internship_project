'use client'
import { ApexOptions } from 'apexcharts'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '../ui/button'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface AppointmentData {
  year: number
  month: number
  price: number
}

const chartTypeLine = 'line' as const

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#6577F3'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: chartTypeLine,
    dropShadow: {
      enabled: true,
      color: '#6577F3',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#6577F3'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
    labels: {
      formatter: (value) => value.toLocaleString('vi-VN'),
    },
  },
}

const ChartOne: React.FC = () => {
  const [viewBy, setViewBy] = useState<'month' | 'year'>('month')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const years = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index,
  ).sort((a, b) => a - b)
  const [appointmentsData, setAppointmentsData] = useState<AppointmentData[]>([])

  const fetchAppointmentsData = async () => {
    try {
      const response = await fetch(`/api/chart/chart2`)
      const data: Array<{ year: number; month: number; totalAmount: number }> =
        await response.json()

      const formattedData: AppointmentData[] = data.map((item) => ({
        year: item.year,
        month: item.month,
        price: item.totalAmount,
      }))

      setAppointmentsData(formattedData)
    } catch (error) {
      console.error('Error fetching appointment data:', error)
    }
  }

  useEffect(() => {
    fetchAppointmentsData()
  }, [])

  const monthData = {
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
    series: [
      {
        name: `Doanh thu Năm ${selectedYear}`,
        data: Array.from({ length: 12 }, (_, i) => {
          const month = i + 1
          const data = appointmentsData.find(
            (a) => a.year === selectedYear && a.month === month,
          )
          return data ? data.price : 0
        }),
      },
    ],
    chartType: chartTypeLine,
    yMax: Math.max(100, ...appointmentsData.map((a) => a.price)),
  }

  const yearData = {
    categories: years.map((year) => year.toString()),
    series: [
      {
        name: 'Thống kê tỉ lệ tìm kiếm',
        data: years.map((year) => {
          const yearlyData = appointmentsData.filter((a) => a.year === year)
          return yearlyData.reduce((total, item) => total + item.price, 0)
        }),
      },
    ],
    chartType: chartTypeLine,
    yMax: Math.max(100, ...appointmentsData.map((a) => a.price)),
  }

  const currentData = viewBy === 'month' ? monthData : yearData

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-[#6577F3]">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#6577F3]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#6577F3]">Tìm kiếm</p>
              <p className="text-sm font-medium">
                {viewBy === 'month' ? `Năm ${selectedYear}` : 'Theo năm'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center border-slate-400 rounded-md bg-white p-1.5 gap-2">
            <Button
              onClick={() => setViewBy('month')}
              className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-slate-400 hover:shadow-card  ${viewBy === 'month' ? 'bg-slate-400 text-white' : ''}`}
            >
              Tháng
              {viewBy === 'month' && (
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="ml-2 py-1 text-xs font-medium text-white bg-slate-400 "
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              )}
            </Button>

            <Button
              onClick={() => setViewBy('year')}
              className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-slate-400 hover:shadow-card ${viewBy === 'year' ? 'bg-slate-400 text-white' : ''}`}
            >
              Năm
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              chart: { ...options.chart, type: currentData.chartType },
              xaxis: { ...options.xaxis, categories: currentData.categories },
              yaxis: { ...options.yaxis, max: currentData.yMax },
              tooltip: {
                y: {
                  formatter: (val) => val.toLocaleString('vi-VN'),
                },
              },
            }}
            series={currentData.series}
            type={currentData.chartType}
            height={350}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}

export default ChartOne
