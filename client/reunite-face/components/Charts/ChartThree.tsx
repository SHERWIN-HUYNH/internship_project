import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { fetchAppointmentData } from '@/helper/chart'
import { REPORT_NOT_FOUND } from '@/validation/messageCode/apiMessageCode/chart'

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
    labels: [],
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)}%`,
      },
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAppointmentData()
        if (data.length === 0) {
          console.warn(REPORT_NOT_FOUND)
          return
        }

        const sortedData = data.sort((a, b) => b.completionRate - a.completionRate)
        const topThree = sortedData.slice(0, 3)
        const topThreeTotal = topThree.reduce((acc, item) => acc + item.completionRate, 0)
        const othersPercentage = 100 - topThreeTotal

        const updatedLabels = [...topThree.map((item) => item.facultyName), 'Khác']
        const updatedSeries = [
          ...topThree.map((item) => item.completionRate),
          othersPercentage,
        ]

        setLabels(updatedLabels)
        setSeries(updatedSeries)
        setOptions((prevOptions) => ({
          ...prevOptions,
          labels: updatedLabels,
        }))
      } catch (error) {
        console.error('Error fetching appointment data:', error)
      }
    }

    loadData() 
  }, [])

  return (
    <div className="col-span-12 rounded-sm border border-white bg-white px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xs font-semibold text-black dark:text-white">
            Thống Kê tỉ lệ tìm kiếm thành công/thất bại
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-12 flex flex-wrap items-center justify-center gap-y-3">
        {labels.map((label, index) => (
          <div key={index} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className={`mr-2 block h-3 w-full max-w-3 rounded-full`}
                style={{
                  backgroundColor: options.colors?.[index % options.colors.length],
                }}
              ></span>
              <p className="flex w-full justify-start text-xs font-medium text-black dark:text-white">
                <span>{label}</span>
                <span className="ml-1">{series[index].toFixed(2)}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChartThree
