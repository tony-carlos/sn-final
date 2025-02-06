// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const CreateAccommodationPage = dynamic(
  () => import('./CreateAccommodationPage'),
  { ssr: false }
)

export default CreateAccommodationPage;