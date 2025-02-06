// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const CreateAccommodationPage = dynamic(
  () => import('./CreateAccommodationPage'),
  { ssr: false }
)

export default CreateAccommodationPage;