import ThisImage from '@/components/atoms/ThisImage';

import { Button, Card, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Skeleton, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import classNames from 'classnames';
import { ImageUp, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import UploadImage from './UploadImage';

const GetData = ({ data, isPending, onOpenView }) => {
  const [imageSelect, setImageSelect] = useState(null);
  const handleClick = (link, id, slug) => {
    onOpenView(link, id, slug);
    setImageSelect(id);
  };
  if (isPending) {
    return (
      <div className="grid grid-cols-7 ">
        {[...Array(21)].map((_, index) => (
          <div className="w-full aspect-square relative  overflow-hidden  cursor-pointer" key={index}>
            <Skeleton />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-7 ">
      {!isPending &&
        data.map(({ id, slug, link }, index) => (
          <div
            className={classNames('w-full aspect-square relative bg-black overflow-hidden  cursor-pointer', id == imageSelect && 'border-2 border-sky-600')}
            key={id}
            onClick={() => handleClick(link, id, slug)}
          >
            <ThisImage src={link} fill alt={slug} className={'object-contain'} />
          </div>
        ))}
    </div>
  );
};

const GalleryModal = ({ isOpen, onOpen, onOpenChange, onClose, onSelect }) => {
  const queryClient = useQueryClient();
  const { isOpen: isOpenUploadImage, onOpen: onOpenUploadImage, onOpenChange: onOpenChangeUploadImage, onClose: onCloseUploadImage } = useDisclosure();
  const [page, setPage] = useState(1);
  const [viewPictSrc, setViewPictSrc] = useState({ src: '', id: 0 });

  const fetchData = async (params) => {
    params.pageSize = 21;
    const { data } = await axios.get('/api/admin/image', { params });
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['/gallery'],
    queryFn: async () => fetchData({ page }),
  });

  const handleViewPhoto = (src, id, slug) => {
    setViewPictSrc({ src, id, slug });
  };

  const handleSuccessUpload = () => {
    queryClient.invalidateQueries();
    onOpen();
  };

  const handleOpenUploadImage = () => {
    onClose();
    onOpenUploadImage();
  };

  const handleSelect = () => {
    onSelect({ ...viewPictSrc });
    setViewPictSrc({ src: null, id: null, slug: null });
    onClose();
  };

  return (
    <>
      <UploadImage isOpen={isOpenUploadImage} onOpenChange={onOpenChangeUploadImage} onClose={onCloseUploadImage} onSucces={handleSuccessUpload} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Gallery</ModalHeader>
              <ModalBody>
                <div className="">
                  <div className="relative max-h-40 max-w-full h-60 bg-gray-400 rounded-md overflow-hidden">
                    {viewPictSrc?.src && <ThisImage src={viewPictSrc?.src} alt={'choosen-picture'} fill className={'object-contain'} />}
                    {!viewPictSrc?.src && (
                      <div className="flex flex-col justify-center items-center w-full h-full text-white">
                        <ImageUp />
                        <p className="text-sm">Select your image</p>
                      </div>
                    )}
                    <Button className="absolute bottom-1 left-1" size="sm" color="primary" onClick={handleOpenUploadImage}>
                      New image
                    </Button>
                  </div>
                </div>
                {!isError && <GetData isPending={isPending} data={data?.data} onOpenView={handleViewPhoto} />}
                <div className="w-full flex justify-center">
                  {!isPending && data.pagination.totalPages != 1 && (
                    <Pagination showControls size="sm" total={data?.pagination?.totalPages || 1} color="primary" page={page || 11} onChange={(pg) => setPage(pg)} />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onClick={handleSelect}>
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GalleryModal;
