import ThisAvatar from '@/components/atoms/ThisAvatar';
import GalleryModal from '@/components/organisms/GalleryModal';
import LayoutAdmin from '@/components/template/LayoutAdmin';

import ProtectedRoute from '@/middleware/ProtectedRoute';
import { Button, Card, Skeleton, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Camera, Edit, Lock } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

const GetData = ({ data, isPending }) => {
  return (
    <div className="mt-10 space-y-2">
      <div className="grid grid-cols-7 capitalize items-center">
        <div className="col-span-1 capitalize">First Name</div>
        <div className="col-span-5 flex items-center">: {isPending ? <Skeleton className="h-8 w-3/5 rounded-sm" /> : data?.firstName}</div>
      </div>
      <div className="grid grid-cols-7 capitalize items-center">
        <div className="col-span-1 capitalize">Last Name</div>
        <div className="col-span-5 flex items-center">: {isPending ? <Skeleton className="h-8 w-3/5 rounded-sm" /> : data?.lastName}</div>
      </div>
      <div className="grid grid-cols-7 capitalize items-center">
        <div className="col-span-1 capitalize">Email</div>
        <div className="col-span-5 flex items-center">: {isPending ? <Skeleton className="h-8 w-3/5 rounded-sm" /> : data?.email}</div>
      </div>
    </div>
  );
};

const GetProfile = () => {
  const fetchData = async () => {
    const { data } = await axios.get('/api/admin/profile');
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    // queryKey: [page],
    queryFn: async () => fetchData(),
  });

  console.log({ data });
  return (
    <LayoutAdmin>
      <Card className={'p-10'}>
        <div className="flex justify-start w-full ">
          <div className="relative rounded-full max-w-fit max-h-fit overflow-hidden">
            <ThisAvatar size={120} />
          </div>
        </div>
        <GetData data={data?.data} isPending={isPending} />
        <div className="mt-10 space-x-2">
          <Link href="/admin/profile/edit">
            <Button color="warning">
              <Edit size={16} />
              Edit
            </Button>
          </Link>
          <Button color="primary">
            <Lock size={16} />
            Change password
          </Button>
        </div>
      </Card>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(GetProfile);
