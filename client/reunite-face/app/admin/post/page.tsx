import AdminLayout from '@/components/Layouts/adminLayout';
import MissingPersonsTable from '@/components/MissingPersonsTable';

export default function Home() {
  return (
    <AdminLayout >
        <MissingPersonsTable />
  </AdminLayout>
  )
}