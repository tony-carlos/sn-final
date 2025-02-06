// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const QuoteListPage = dynamic(
  () => import('./QuoteListPage'),
  { ssr: false }
)

export default QuoteListPage;
