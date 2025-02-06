// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const AdminLogin = dynamic(
  () => import('./AdminLogin'),
  { ssr: false }
)

export default AdminLogin;