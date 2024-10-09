import { useEffect, useState } from 'react';
import { fetchImgBackgroundById } from '../../features/imgbackground/imgbackgroundSlice';

const useBackgroundImage = (imageId: string) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const getBackgroundImage = async () => {
      const imgBackground = await fetchImgBackgroundById(imageId);
      if (imgBackground) {
        setBackgroundImage(imgBackground.link); // Giả sử `link` chứa URL của hình ảnh
      }
    };

    getBackgroundImage();
  }, [imageId]);

  return backgroundImage;
};

export default useBackgroundImage;
