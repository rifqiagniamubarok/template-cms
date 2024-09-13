import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { useSession } from 'next-auth/react';

const AdminDashboard = () => {
  const { data } = useSession();

  return <LayoutAdmin>Hi, {data.user.name}</LayoutAdmin>;
};

export default ProtectedRoute(AdminDashboard);
