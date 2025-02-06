// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const AccommodationsList = dynamic(
  () => import('./AccommodationsList'),
  { ssr: false }
)

export default AccommodationsList;