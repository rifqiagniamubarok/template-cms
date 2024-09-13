import ThisImage from '@/components/atoms/ThisImage';
import ImageDropzone from '@/components/molecules/ImageDropzone';
import UploadImage from '@/components/organisms/UploadImage';
import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { Button, Card, Modal, ModalBody, ModalContent, Pagination, Skeleton, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const GetData = ({ data, isPending, onOpenView }) => {
  const handleClick = (link, id) => {
    onOpenView(link, id);
  };
  if (isPending) {
    return (
      <div className="grid grid-cols-7 gap-4">
        {[...Array(21)].map((_, index) => (
          <div className="w-full aspect-square relative  overflow-hidden  rounded-md  cursor-pointer" key={index}>
            <Skeleton />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-7 gap-2">
      {!isPending &&
        data.map(({ id, slug, link }, index) => (
          <div className="w-full aspect-square relative bg-black overflow-hidden rounded-md  cursor-pointer " key={id} onClick={() => handleClick(link, id)}>
            <ThisImage src={link} fill alt={slug} className={'object-contain'} />
          </div>
        ))}
    </div>
  );
};

const GetGallery = () => {
  const queryClient = useQueryClient();
  const { isOpen: isOpenView, onOpen: onOpenView, onOpenChange: onOpenChangeView, onClose: onCloseView } = useDisclosure();
  const { isOpen: isOpenUploadImage, onOpen: onOpenUploadImage, onOpenChange: onOpenChangeUploadImage, onClose: onCloseUploadImage } = useDisclosure();
  const [page, setPage] = useState(1);
  const [viewPictSrc, setViewPictSrc] = useState('');

  const fetchData = async (params) => {
    params.pageSize = 21;
    const { data } = await axios.get('/api/admin/image', { params });
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: [page],
    queryFn: async () => fetchData({ page }),
  });

  const mutationDel = useMutation({
    mutationFn: (id) => {
      return axios.delete(`/api/admin/image/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      onCloseView();
    },
  });

  const handleViewPhoto = (src, id) => {
    setViewPictSrc({ src, id });
    onOpenView();
  };

  const handleSuccessUpload = () => {
    queryClient.invalidateQueries();
  };

  return (
    <LayoutAdmin>
      <Card className={'p-4 space-y-4'}>
        <Button className="w-fit" color="primary" onClick={onOpenUploadImage}>
          <Plus />
          Upload Image
        </Button>
        <UploadImage isOpen={isOpenUploadImage} onOpenChange={onOpenChangeUploadImage} onClose={onCloseUploadImage} onSucces={handleSuccessUpload} />
        <div className=""></div>
        {!isError && <GetData isPending={isPending} data={data?.data} onOpenView={handleViewPhoto} />}
        <div className="w-full flex justify-center">
          {!isPending && data.pagination.totalPages != 1 && (
            <Pagination showControls total={data?.pagination?.totalPages || 1} color="primary" page={page || 11} onChange={(pg) => setPage(pg)} />
          )}
        </div>
      </Card>
      <>
        <Modal isOpen={isOpenView} onOpenChange={onOpenChangeView}>
          <ModalContent>
            {(onClose) => (
              <>
                <div className="w-full aspect-square relative bg-black overflow-hidden rounded-md cursor-pointer">
                  <ThisImage src={viewPictSrc.src} fill alt={'hospital'} className={'object-contain'} />
                  <div className="bottom-2 right-2 absolute">
                    <Button
                      size="sm"
                      color="danger"
                      isLoading={mutationDel.isPending}
                      onClick={() => {
                        mutationDel.mutate(viewPictSrc.id);
                      }}
                    >
                      <Trash size={18} />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(GetGallery);
