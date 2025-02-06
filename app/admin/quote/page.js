// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top

import dynamic from 'next/dynamic'

const QuoteListPage = dynamic(
  () => import('./QuoteListPage'),
  { ssr: false }
)

export default QuoteListPage;
