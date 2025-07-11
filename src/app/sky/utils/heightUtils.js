/** 공용 유틸 함수들 */

/* 두 터치 포인트 거리 */
export const distance = (t1, t2) =>
  Math.hypot(t2.pageX - t1.pageX, t2.pageY - t1.pageY);

/* 이미지 이동 범위 클램프 */
export function clampPosition({
  posX,
  posY,
  newScale,
  containerRect,
  imageSize,
  multiple = 1.5,
}) {
  const { width: imgW, height: imgH } = imageSize;
  if (!imgW || !imgH) return { x: posX, y: posY };

  const { width: cW, height: cH } = containerRect;
  const sW = imgW * newScale;
  const sH = imgH * newScale;

  const minX = cW - sW * multiple;
  const maxX = sW * (multiple - 1);
  const minY = cH - sH * multiple;
  const maxY = sH * (multiple - 1);

  return {
    x: Math.min(Math.max(posX, minX), maxX),
    y: Math.min(Math.max(posY, minY), maxY),
  };
}
