// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const SafariguideAdmin = dynamic(
  () => import('./SafariguideAdmin'),
  { ssr: false }
)

export default SafariguideAdmin;
