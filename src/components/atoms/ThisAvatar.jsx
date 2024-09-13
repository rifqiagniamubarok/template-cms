import Avvvatars from 'avvvatars-react';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import ThisImage from './ThisImage';
import slugify from 'slugify';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { User } from 'lucide-react';

const ThisAvatar = ({ size = 38, src, value = null, alt, noView = false, style = 'character', isProfile = true }) => {
  const {
    data: { user },
  } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [viewSrc, setViewSrc] = React.useState('');

  const handleView = () => {
    if (noView) {
      return;
    }
    if (src) {
      setViewSrc(src);
    } else {
      setViewSrc(user.image);
    }
    onOpen();
  };

  if (!isProfile && src) {
    return (
      <>
        <div className={classNames(`w-fit aspect-square relative rounded-full overflow-hidden flex justify-center items-center`, !noView && 'cursor-pointer')} onClick={handleView}>
          <ThisImage src={src} alt={alt || '-'} width={size} height={size} className={'object-cover scale-150 hover:scale-125 transition-all'} />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <div className="w-full max-w-full aspect-square relative bg-black">
                  <ThisImage src={viewSrc} fill alt={'profile-detail'} className={'object-contain'} />
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  if (isProfile && user.image) {
    return (
      <>
        <div className={classNames(`w-fit aspect-square relative rounded-full overflow-hidden flex justify-center items-center`, !noView && 'cursor-pointer')} onClick={handleView}>
          <ThisImage src={src || user.image} alt={slugify(user.name || 'random')} width={size} height={size} className={'object-cover scale-150 hover:scale-125 transition-all'} />
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <div className="w-full max-w-full aspect-square relative bg-black">
                  <ThisImage src={viewSrc} fill alt={'profile-detail'} className={'object-contain'} />
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="">
        {!value && !isProfile && (
          <div className="relative w-fit h-fit">
            <Avvvatars value={''} size={size} shadow={true} style={style} />
            <div className="inset-0 absolute w-full h-full z-0 bg-gray-500 flex justify-center items-center text-white">
              <User size={size - size / 2} />
            </div>
          </div>
        )}
        {value && !isProfile && <Avvvatars value={value} size={size} shadow={true} style={style} />}
        {isProfile && <Avvvatars value={user?.name} size={size} shadow={true} style={style} />}
      </div>
    </>
  );
};

export default ThisAvatar;
