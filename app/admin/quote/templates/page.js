// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const ManageTemplatesPage = dynamic(
  () => import('./ManageTemplatesPage'),
  { ssr: false }
)

export default ManageTemplatesPage;
