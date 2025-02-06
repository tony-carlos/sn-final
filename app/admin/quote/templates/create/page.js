// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const CreateTemplatePage = dynamic(
  () => import('./CreateTemplatePage'),
  { ssr: false }
)

export default CreateTemplatePage;
