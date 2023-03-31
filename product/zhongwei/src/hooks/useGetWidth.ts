import { useEffect, useRef, useState } from 'react';

const useGetWidth = () => {
  const domRef: any = useRef(null);
  const [expandWidth, setExpandWidth] = useState(0);

  useEffect(() => {
    const changeWidth = () => {
      if (!domRef.current) {
        return;
      }

      const { width = 0 } = domRef.current?.getBoundingClientRect() || {};
      setExpandWidth(width);
    };

    changeWidth();

    window.addEventListener('resize', changeWidth);

    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, [domRef.current]);

  return {
    domRef,
    expandWidth,
  };
};

export default useGetWidth;
