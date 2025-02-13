// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const AccommodationsList = dynamic(
  () => import('./AccommodationsList'),
  { ssr: false }
)

export default AccommodationsList;