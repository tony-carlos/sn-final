// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const SubscribersPage = dynamic(
  () => import('./SubscribersPage'),
  { ssr: false }
)

export default SubscribersPage;
