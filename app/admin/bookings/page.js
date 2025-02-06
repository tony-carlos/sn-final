// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const BookingPage = dynamic(
  
  
  () => import('./BookingPage'),
  { ssr: false }
)

export default BookingPage;
