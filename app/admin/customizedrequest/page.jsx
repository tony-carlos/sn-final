// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const CustomizedRequestPage = dynamic(
  
  
  () => import('./CustomizedRequestPage'),
  { ssr: false }
)

export default CustomizedRequestPage;
