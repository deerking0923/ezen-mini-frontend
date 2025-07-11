import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { clampPosition, distance } from './heightUtils';

/* html2canvas는 클라이언트에서만 필요 */
const html2canvas = dynamic(
  () => import('html2canvas').then((m) => m.default),
  { ssr: false }
);

/* 실제 화면에서 1 클릭당 이동시키고 싶은 픽셀 수 */
const STEP_DESKTOP_PX = 0.5;   // 데스크톱
const STEP_MOBILE_PX  = 0.1;   // 모바일

export default function useHeightMeter(canvasRef) {
  /* 상태 */
  const [uploaded, setUploaded] = useState(null);
  const [scale, setScale]       = useState(0.3);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize]   = useState({ width: 0, height: 0 });
  const [touch, setTouch]       = useState(null);

  /* 화살표/확대 스텝 */
  const [arrowStep, setArrowStep] = useState(STEP_DESKTOP_PX);
  const [zoomStep,  setZoomStep]  = useState(0.01);

  /* 모바일/데스크톱 구분 */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobile = window.innerWidth < 768;
    setArrowStep(mobile ? STEP_MOBILE_PX : STEP_DESKTOP_PX);
    setZoomStep (mobile ? 0.0002 : 0.0003);
  }, []);

  /* 위치 제한 */
  const clamp = useCallback(
    (x, y, s = scale) => {
      const rect = canvasRef.current?.getBoundingClientRect() ?? {
        width: 0, height: 0,
      };
      return clampPosition({
        posX: x, posY: y, newScale: s,
        containerRect: rect, imageSize: imgSize,
      });
    },
    [canvasRef, imgSize, scale]
  );

  /* ─ 업로드 ─ */
  const onUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploaded(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ─ 마우스 드래그 ─ */
  const onDrag = (e) => {
    if (e.buttons !== 1) return;
    setPos((p) => clamp(p.x + e.movementX, p.y + e.movementY));
  };

  /* ─ 휠 줌 ─ */
  const onWheel = useCallback((e) => {
    if (e.cancelable) e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const newS    = Math.max(0.1, scale + (e.deltaY < 0 ? 0.003 : -0.003));

    const newX = pos.x + offsetX * (1 - newS / scale);
    const newY = pos.y + offsetY * (1 - newS / scale);

    setScale(newS);
    setPos(clamp(newX, newY, newS));
  }, [scale, pos, clamp]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    cvs.addEventListener('wheel', onWheel, { passive: false });
    return () => cvs.removeEventListener('wheel', onWheel);
  }, [onWheel, canvasRef]);

  /* ─ 터치(핀치/드래그) ─ */
  const onTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      setTouch({ type:'drag', sx:pageX, sy:pageY, ix:pos.x, iy:pos.y });
    } else if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      setTouch({
        type:'pinch',
        sd: distance(t1, t2),
        is: scale,
        ip: { ...pos },
        c:  { x:(t1.pageX+t2.pageX)/2, y:(t1.pageY+t2.pageY)/2 },
      });
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (!touch) return;

    if (touch.type === 'drag' && e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      setPos(clamp(
        touch.ix + (pageX - touch.sx),
        touch.iy + (pageY - touch.sy)
      ));
    } else if (touch.type === 'pinch' && e.touches.length === 2) {
      const [t1, t2] = e.touches;
      let newS = touch.is * (1 + (distance(t1, t2) / touch.sd - 1) * 0.5);
      newS = Math.max(0.2, newS);

      const newX = touch.ip.x + touch.c.x * (1 - newS / touch.is);
      const newY = touch.ip.y + touch.c.y * (1 - newS / touch.is);

      setScale(newS);
      setPos(clamp(newX, newY, newS));
    }
  };

  /* ─ 이동 & 줌 ─ */
  const move = (dx, dy) => setPos((p) => clamp(p.x + dx, p.y + dy));
  const zoom = (delta) => {
    const s = Math.max(0.1, scale + delta);
    setScale(s);
    setPos(clamp(pos.x, pos.y, s));
  };

  /* ─ 다운로드 ─ */
  const download = async () => {
    const el = canvasRef.current;
    if (!el) return;
    const html2canvasFn = (await import('html2canvas')).default;
    const canvas = await html2canvasFn(el, { useCORS: true });
    const link  = document.createElement('a');
    link.href   = canvas.toDataURL('image/png');
    link.download = 'heightmeter.png';
    link.click();
  };

  return {
    uploaded,
    setImgSize,
    imgSize,
    pos,
    scale,
    onUpload,
    onDrag,
    onTouchStart,
    onTouchMove,
    move,
    zoom,
    arrowStep,
    zoomStep,
    download,
  };
}
