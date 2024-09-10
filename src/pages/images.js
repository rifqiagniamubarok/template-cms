import ThisImage from '@/components/atoms/ThisImage';
import React from 'react';

const images = () => {
  return (
    <div>
      {' '}
      <div className="w-1/2 aspect-square relative bg-black">
        <ThisImage
          src="https://images.unsplash.com/photo-1541696490-8744a5dc0228?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt={'imagesss'}
          fill
          className={' object-contain'}
        />
      </div>
    </div>
  );
};

export default images;
