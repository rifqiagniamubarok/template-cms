import ThisImage from '@/components/atoms/ThisImage';
import Avvvatars from 'avvvatars-react';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import React from 'react';

const useAvatar = (size = 38) => {
  const {
    data: { user },
  } = useSession();

  const newStyle = `w-[${size}px]`;
  const newStyleMax = `max-w-[${size}px]`;

  if (user.image) {
    return (
      <div className={classNames(`${newStyle} ${newStyleMax} relative aspect-square  rounded-full overflow-hidden`)}>
        <ThisImage src={user.image} fill className={'object-cover'} />
      </div>
    );
  }

  return (
    <>
      <Avvvatars value={user?.name || 'await'} size={size} shadow={true} />
    </>
  );
};

export default useAvatar;
