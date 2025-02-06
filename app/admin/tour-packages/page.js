// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const TourPackagesPage = dynamic(
  () => import('./TourPackagesList'),
  { ssr: false }
)

export default TourPackagesPage;
