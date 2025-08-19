export interface AppointmentReport {
  facultyId: string
  facultyName: string
  sumAppointmentsFaculty: number
  revenue: number
  scheduledAppointments: number
  completionRate: number
}

export const fetchAppointmentData = async (): Promise<AppointmentReport[]> => {
  try {
    const response = await fetch('/api/chart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Lỗi khi lấy dữ liệu báo cáo')
    }

    const responseData = await response.json()
    return Array.isArray(responseData) ? responseData : []
  } catch (error) {
    console.error('Error fetching appointment data:', error)
    return []
  }
}
