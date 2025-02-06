// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'
export const runtime = "edge"; // <-- Add this at the top

const CreateTourPackagePage = dynamic(
  () => import('./CreateTourPackagePage'),
  { ssr: false }
)

export default CreateTourPackagePage;
