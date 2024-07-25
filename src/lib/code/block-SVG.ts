import { pipe } from 'fp-ts/function';
import * as S from '$lib/code/fp-ts-utils/SVG';

export const getSize = (element: SVGGraphicsElement) => {
  const hiddenSVG = document.getElementById('hidden-SVG');

  hiddenSVG?.append(element);
  const boundingBox = element.getBBox();
  hiddenSVG?.removeChild(element);

  return boundingBox;
};

const drawText = (content: string) => {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.classList.add('text');
  text.setAttribute('dominant-baseline', 'hanging');
  text.setAttribute('x', '4px');
  text.setAttribute('y', '4px');
  text.setAttribute('font-size', '16px');
  text.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
  text.textContent = content;

  return text;
};

const drawLabelPath = (textWidth: number) => {
  const labelPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  labelPath.classList.add('label-path');
  labelPath.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(0, 3),
      S.R.down(18),
      S.R.cubicCurve(0, 2)(1.2, 3)(3, 3),
      S.R.right(textWidth + 2),
      S.R.cubicCurve(2, 0)(3, -1.2)(3, -3),
      S.R.up(18),
      S.R.cubicCurve(0, -2)(-1.2, -3)(-3, -3),
      S.R.left(textWidth + 2),
      S.R.cubicCurve(-1.2, 0)(-3, 1.2)(-3, 3),
      S.closePath
    )
  );

  return labelPath;
};

export const drawLabel = (content: string) => {
  const text = drawText(content);
  const textSize = getSize(text);

  const labelPath = drawLabelPath(textSize.width);

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  label.classList.add('label');
  label.append(labelPath);
  label.append(text);

  return label;
};

export const drawStringBlockPath = (label: SVGGElement) => {
  const labelSize = getSize(label);

  const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  blockPath.classList.add('block-path');
  blockPath.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(0, 0),
      S.R.right(labelSize.width + 4),
      S.R.down(labelSize.height + 4),
      S.R.left(labelSize.width + 4),
      S.closePath
    )
  );

  return blockPath;
};

export const drawStringBlock = (label: SVGGElement) => {
  label.setAttribute('transform', 'translate(2 2)');

  const blockPath = drawStringBlockPath(label);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block-path', 'string-block-path');
  block.append(blockPath);
  block.append(label);

  return block;
};

