// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const CreateQuotePage = dynamic(
  
  () => import('./CreateQuotePage'),
  { ssr: false }
)

export default CreateQuotePage;
