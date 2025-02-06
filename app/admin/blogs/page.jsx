// app/admin/dashboard/page.js
import dynamic from 'next/dynamic'

const AdminBlogs = dynamic(
  
  
  () => import('./AdminBlogs'),
  { ssr: false }
)

export default AdminBlogs;
