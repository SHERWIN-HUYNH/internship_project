import AdminPage from '@/components/admin/Adminpage'
import AdminLayout from '@/components/Layouts/adminLayout'
import MissingLayout from '@/components/Layouts/missingFormLayout'
import React from 'react'

const TestAdmin = () => {
  return (
    <AdminLayout>
        <AdminPage />
    </AdminLayout>
  )
}

export default TestAdmin
