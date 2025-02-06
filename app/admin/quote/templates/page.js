// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'
export const runtime = "edge"; // <-- Add this at the top

const ManageTemplatesPage = dynamic(
  () => import('./ManageTemplatesPage'),
  { ssr: false }
)

export default ManageTemplatesPage;
