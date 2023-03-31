import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import './canvans-draw.scss';

interface Config {
  lineWidth: number; // 直线宽度
  strokeStyle: string; // 路径的颜色
  lineCap: string; // 直线首尾端图形
  lineJoin: string; // 当两条线条交汇时的图形
}

interface IProps {
  config?: Config;
  degree?: 90 | -90 | 180;
  placeholder?: string;
}

export interface IRef {
  getPNGImage: () => string;
  resetDraw: () => void;
}

const CanvasDraw = forwardRef<any, Partial<IProps>>((props, ref) => {
  const {
    config = {
      lineWidth: 5, // 直线宽度
      strokeStyle: 'black', // 路径的颜色
      lineCap: 'round', // 直线首尾端圆滑
      lineJoin: 'round', // 当两条线条交汇时，创建圆形边角
    },
    degree = -90,
    placeholder = '',
  } = props;
  const containerDom = useRef<HTMLDivElement>(null);
  const canvasDom = useRef<HTMLCanvasElement>(null);

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(placeholder !== '');
    const canvas = canvasDom.current;
    const container = containerDom.current;
    if (!canvas || !container) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const width = container.parentElement?.clientWidth || 300;
    const height = container.parentElement?.clientHeight || 100;

    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    // 根据设备像素比优化canvas绘图
    const { devicePixelRatio } = window;
    if (devicePixelRatio) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.height = height * devicePixelRatio;
      canvas.width = width * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    context.lineWidth = 6;
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    Object.assign(context, config);
    const { left, top } = canvas.getBoundingClientRect();
    const point = { x: 0, y: 0 };
    let pressed = false;
    const paint = (signal) => {
      switch (signal) {
        case 1:
          context.beginPath();
          context.moveTo(point.x, point.y);
          break;
        case 2:
          context.lineTo(point.x, point.y);
          context.stroke();
          break;
        default:
      }
    };
    const create = (signal) => (event) => {
      event.preventDefault();
      if (signal === 1) {
        pressed = true;
      }
      if (signal === 1 || pressed) {
        const [e] = event.touches;
        point.x = e.clientX - left;
        point.y = e.clientY - top;
        paint(signal);
      }
    };

    const start = create(1);
    const move = create(2);

    const { requestAnimationFrame } = window;
    const optimizedMove = requestAnimationFrame
      ? (e) => {
        requestAnimationFrame(() => {
          move(e);
        });
      }
      : move;

    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', optimizedMove);

    /** 旋转画布 */
    if (degree) {
      const degreePI = (degree * Math.PI) / 180;
      context.rotate(degreePI);
      switch (degree) {
        case -90:
          context.translate(-height, 0);
          break;
        case 90:
          context.translate(0, -width);
          break;
        case 180:
          context.translate(-width, -height);
          break;
        default:
      }
    }
  }, []);

  const getPNGImage = () => canvasDom.current?.toDataURL('image/png') || '';
  const resetDraw = () => {
    setShow(true);
    const canvas = canvasDom.current;
    const context = canvas?.getContext('2d');
    const width = containerDom.current?.clientWidth || 300;
    const height = containerDom.current?.clientHeight || 100;

    if (degree) { // this.degree是画布坐标系旋转的度数
      context?.clearRect(0, 0, height, width);
    } else {
      context?.clearRect(0, 0, width, height);
    }
  };

  useImperativeHandle(ref, () => ({
    getPNGImage,
    resetDraw,
  }));

  return (
    <div ref={containerDom} style={{ position: 'relative' }} onTouchStart={() => setShow(false)}>
      <canvas ref={canvasDom} />
      {show && <div styleName="placeholder">{placeholder}</div>}
    </div>
  );
});

export default CanvasDraw;
