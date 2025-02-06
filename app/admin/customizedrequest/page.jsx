// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const CustomizedRequestPage = dynamic(
  
  
  () => import('./CustomizedRequestPage'),
  { ssr: false }
)

export default CustomizedRequestPage;
