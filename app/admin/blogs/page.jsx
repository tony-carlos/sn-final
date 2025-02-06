// app/admin/dashboard/page.js
export const runtime = "edge"; // <-- Add this at the top


import dynamic from 'next/dynamic'

const AdminBlogs = dynamic(
  
  
  () => import('./AdminBlogs'),
  { ssr: false }
)

export default AdminBlogs;
