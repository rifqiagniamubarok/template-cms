import classNames from 'classnames';
import { ImageUp } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ThisImage from '../atoms/ThisImage';

const ImageDropzone = ({ onImageUpload, ...others }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedImage(URL.createObjectURL(file));
      onImageUpload(file);
    },
  });

  const uploadStyle = 'absolute inset-0 h-full bg-primary bg-opacity-50 rounded-md flex flex-col gap-3 justify-center items-center  text-6xl cursor-pointer text-white';
  const basicStyle = 'w-full max-h-fit max-w-full aspect-video relative bg-black overflow-hidden rounded-md cursor-pointer';

  return (
    <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)} className={classNames(basicStyle)}>
      {uploadedImage ? <ThisImage src={uploadedImage} alt={'upload-image'} fill className={'object-contain'} /> : <div></div>}
      {isHover | !uploadedImage && (
        <div {...getRootProps()} className={classNames(uploadStyle)}>
          <input {...getInputProps()} className="" {...others} />
          <ImageUp />
          <p className="text-sm">Click or drag n drop here</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
