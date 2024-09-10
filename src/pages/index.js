import Image from 'next/image';
import { Inter } from 'next/font/google';
import { Button } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import Avvvatars from 'avvvatars-react';
import Link from 'next/link';

const Home = () => {
  const data = useSession();

  return (
    <div className={`h-screen w-screen bg-white flex justify-center items-center `}>
      <div className="flex flex-col items-center ">
        <div className="text-primary space-y-4 text-center">
          <div className="w-full flex justify-center">
            <Avvvatars value={data.data.user.name} style="shape" size={100} border={true} borderSize={4} borderColor="#3C3C3C" />
          </div>
          <p className="text-3xl">Hello {data.data.user.name}!</p>
          <div className="space-x-2">
            <Link href="/docs">
              <Button size="sm" color="warning">
                Docs
              </Button>
            </Link>
            <Button className="" size="sm" color="primary" onClick={() => signOut()}>
              Signout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute(Home);
