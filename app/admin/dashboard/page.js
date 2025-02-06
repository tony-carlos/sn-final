// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(
  () => import('./AdminDashboardComponent'),
  { ssr: false }
)

export default AdminDashboard;