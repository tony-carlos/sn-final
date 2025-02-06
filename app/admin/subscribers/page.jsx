// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'
export const runtime = "edge"; // <-- Add this at the top

const SubscribersPage = dynamic(
  () => import('./SubscribersPage'),
  { ssr: false }
)

export default SubscribersPage;
