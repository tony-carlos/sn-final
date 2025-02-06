// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'
export const runtime = "edge"; // <-- Add this at the top

const CreateTemplatePage = dynamic(
  () => import('./CreateTemplatePage'),
  { ssr: false }
)

export default CreateTemplatePage;
