// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(
  () => import('./AdminDashboardComponent'),
  { ssr: false }
)

export default AdminDashboard;