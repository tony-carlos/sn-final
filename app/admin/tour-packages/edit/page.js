// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const CreateTourPackagePage = dynamic(
  () => import('./CreateTourPackagePage'),
  { ssr: false }
)

export default CreateTourPackagePage;
