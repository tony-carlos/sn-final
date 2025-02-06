// /app/admin/components/AdminNav.js
import Link from 'next/link';

const AdminNav = () => {
  return (
    <nav>
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/users">Manage Users</Link>
      <Link href="/admin/tours">Manage Tours</Link>
    </nav>
  );
};

export default AdminNav;
