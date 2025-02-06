// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'
export const runtime = "edge"; // <-- Add this at the top

const SafariguideAdmin = dynamic(
  () => import('./SafariguideAdmin'),
  { ssr: false }
)

export default SafariguideAdmin;
