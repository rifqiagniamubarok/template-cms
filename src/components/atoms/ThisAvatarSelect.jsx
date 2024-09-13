import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import * as React from 'react';
import ThisImage from './ThisImage';
import GalleryModal from '../organisms/GalleryModal';
import ThisAvatar from './ThisAvatar';
import { Camera, Images, Trash2 } from 'lucide-react';

const ThisAvatarSelect = ({ size, onSelect, defaultSrc, ...other }) => {
  const [isOver, setIsOver] = React.useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { isOpen: isOpenSelect, onOpen: onOpenSelect, onClose: onCloseSelect, onOpenChange: onOpenChangeSelect } = useDisclosure();
  const [srcImage, setSrcImage] = React.useState('');

  const handleSelectImage = ({ src, id }) => {
    onSelect({ src, id });
    setSrcImage(src);
    onCloseSelect();
  };

  React.useEffect(() => {
    if (defaultSrc) {
      setSrcImage(defaultSrc);
    }
  }, [defaultSrc]);

  return (
    <>
      <div className="relative rounded-full max-w-fit max-h-fit overflow-hidden" onMouseOver={() => setIsOver(true)} onMouseOut={() => setIsOver(false)}>
        <ThisAvatar size={size} src={srcImage} isProfile={false} {...other} />
        {isOver && (
          <div className="absolute bottom-0 inset-x-0 bg-primary bg-opacity-60 h-1/3 cursor-pointer flex justify-center items-center flex-col text-white" onClick={onOpen}>
            <Camera size={20} />
          </div>
        )}
      </div>
      <Modal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="p-4 mt-8 space-y-2">
              <Button
                className="w-full font-semibold flex justify-between items-center"
                onClick={() => {
                  onClose();
                  onOpenSelect();
                }}
              >
                Choose Photo <Images size="20" />
              </Button>
              <Button
                className="w-full font-semibold flex justify-between items-center"
                color="danger"
                onClick={() => {
                  handleSelectImage({ src: null, id: null });
                  onClose();
                }}
              >
                Delete Photo <Trash2 size="20" />
              </Button>
            </div>
          )}
        </ModalContent>
      </Modal>
      <GalleryModal isOpen={isOpenSelect} onOpen={onOpenSelect} onClose={onCloseSelect} onOpenChange={onOpenChangeSelect} onSelect={(value) => handleSelectImage(value)} />
    </>
  );
};

export default ThisAvatarSelect;
