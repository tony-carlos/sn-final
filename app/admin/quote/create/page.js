// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const CreateQuotePage = dynamic(
  
  () => import('./CreateQuotePage'),
  { ssr: false }
)

export default CreateQuotePage;
