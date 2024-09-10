import { Skeleton } from '@nextui-org/react';
import classNames from 'classnames';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ThisImage = ({ alt, className, ...others }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFail, setIsFail] = useState(false);
  const [isJustStart, setIsJustStart] = useState(true);

  const baseStayle = 'w-full h-full';

  const handleLoading = (e) => {
    setIsJustStart(false);
    setIsLoading(false);
  };

  const handleFail = (e) => {
    setIsJustStart(false);
    setIsFail(true);
  };

  if (isFail & !isJustStart) {
    return (
      <div className={classNames(baseStayle, 'bg-gray-200 flex justify-center items-center ')}>
        <ImageOff />
      </div>
    );
  }

  // if (isLoading & isJustStart & !isFail) {
  //   return <Skeleton className={classNames(baseStayle)} />;
  // }

  return (
    <>
      <Image onLoad={handleLoading} alt={alt} onError={handleFail} {...others} className={classNames(className)} />
      {isLoading && !isFail && <Skeleton className={classNames(baseStayle)} />}
    </>
  );
};

export default ThisImage;
