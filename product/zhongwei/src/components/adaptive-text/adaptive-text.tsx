import { useEffect, useRef, useState } from 'react';
import './adaptive-text.scss';

const canvas = document.createElement('canvas');
const ctx: any = canvas.getContext('2d');
const defaultGetFont = (font: number) => `${font}px PingFang HK`;

interface IProps {
  text: string;
  fontSize: number;
  minFontSize?: number;
  maxFontSize?: number;
  step?: number;
  getFont?: (...args: any[]) => string;
}

const AdaptiveText: React.FC<IProps> = (props) => {
  const { text, fontSize, minFontSize = 18, maxFontSize = 27, step = 1, getFont = defaultGetFont } = props;

  const textRef: any = useRef(null);
  const [realFontSize, setRealFontSize] = useState(fontSize);

  useEffect(() => {
    let tryFontSize = fontSize;
    const { width: containerWidth } = textRef.current.getBoundingClientRect();

    function run(trySize: number) {
      ctx.font = getFont(trySize);

      if (ctx.measureText(text).width > containerWidth) {
        tryFontSize -= step;
        run(tryFontSize);
        return;
      }

      const result = trySize / Math.floor(100 * (document.body.clientWidth / 750));
      const transMinSize = minFontSize / 100;
      const transMaxSize = maxFontSize / 100;

      if (result < transMinSize) {
        setRealFontSize(transMinSize);
        return;
      }

      if (result > transMaxSize) {
        setRealFontSize(transMaxSize);
        return;
      }

      setRealFontSize(result);
    }

    run(tryFontSize);
  }, [fontSize, text, step]);

  return (
    <span styleName="adaptive-text" ref={textRef} style={{ fontSize: `${realFontSize}rem` }}>
      {text}
    </span>
  );
};

export default AdaptiveText;
