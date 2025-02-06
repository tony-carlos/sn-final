// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const BookingPage = dynamic(
  
  
  () => import('./BookingPage'),
  { ssr: false }
)

export default BookingPage;
