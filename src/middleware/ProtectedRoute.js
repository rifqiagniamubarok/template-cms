import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = (WrappedComponent) => {
  const WithAuth = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') {
        return;
      }
      if (!session) {
        router.push('/login');
      }
    }, [session, status, router]);

    if (session) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  // WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default ProtectedRoute;
