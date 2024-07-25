import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray';
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
  blockPath.classList.add('block-path', 'string-block-path');
  blockPath.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(0, 0),
      S.R.right(labelSize.width + 8),
      S.R.down(labelSize.height + 8),
      S.R.left(labelSize.width + 8),
      S.closePath
    )
  );

  return blockPath;
};

export const drawStringBlock = (label: SVGGElement) => {
  label.setAttribute('transform', 'translate(4 4)');

  const blockPath = drawStringBlockPath(label);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'string-block');
  block.append(blockPath);
  block.append(label);

  return block;
};

const convex = (path: string) =>
  pipe(
    path,
    S.R.right(6),
    S.R.up(3),
    S.R.cubicCurve(0, -3)(0, -3)(3, -3),
    S.R.right(12),
    S.R.cubicCurve(3, 0)(3, 0)(3, 3),
    S.R.down(3),
    S.R.right(6)
  );

const concave = (path: string) =>
  pipe(
    path,
    S.R.left(6),
    S.R.up(3),
    S.R.cubicCurve(0, -3)(0, -3)(-3, -3),
    S.R.left(12),
    S.R.cubicCurve(-3, 0)(-3, 0)(-3, 3),
    S.R.down(3),
    S.R.left(6)
  );

export const drawActionBlockPath =
  (width: number) => (heights: RNEA.ReadonlyNonEmptyArray<number>) => (isTrigger: boolean) => {
    const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    blockPath.classList.add(
      'block-path',
      isTrigger ? 'trigger-action-block-path' : 'action-block-path'
    );
    blockPath.setAttribute(
      'd',
      pipe(
        S.draw,
        S.A.moveTo(0, 0),
        isTrigger ? S.R.right(30) : convex,
        S.R.right(width + 30),
        (upperSideOfPath) =>
          pipe(
            heights,
            RA.reduceWithIndex(upperSideOfPath, (index, path, height) =>
              index % 2 === 0
                ? pipe(path, S.R.down(height))
                : pipe(path, S.R.left(width), concave, S.R.down(height), convex, S.R.right(width))
            )
          ),
        S.R.left(width + 30),
        isTrigger ? S.R.left(30) : concave,
        S.closePath
      )
    );

    return blockPath;
  };

export type ChildElementTable = RNEA.ReadonlyNonEmptyArray<ReadonlyArray<SVGGElement>>;

const doubleMap =
  <A, B>(f: (a: A) => B) =>
    (array: RNEA.ReadonlyNonEmptyArray<ReadonlyArray<A>>) =>
      pipe(
        array,
        RNEA.map((a) => pipe(a, RA.map(f)))
      );

export const drawActionBlock = (childElements: ChildElementTable) => (isTrigger: boolean) => {
  const childSizes = pipe(childElements, doubleMap(getSize));

  const width = pipe(
    childSizes,
    doubleMap((a) => a.width),
    RA.map((a) =>
      pipe(
        a,
        RA.reduce(0, (acc, cur) => acc + cur + 6)
      )
    ),
    RA.reduce(0, (acc, cur) => (acc < cur ? cur : acc))
  );

  const heights = pipe(
    childSizes,
    doubleMap((a) => a.height),
    RNEA.map((a) =>
      pipe(
        a,
        RA.reduce(0, (acc, cur) => (acc < cur ? cur : acc)),
        (a) => a + 12
      )
    )
  );

  const blockPath = drawActionBlockPath(width)(heights)(isTrigger);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', isTrigger ? 'trigger-action-block' : 'action-block');
  block.append(blockPath);

  let offsetY = 0;

  childElements.forEach((inlineElements, rowNumber) => {
    let offsetX = 60;

    inlineElements.forEach((element, columnNumber) => {
      if (rowNumber % 2 === 0) {
        element.setAttribute(
          'transform',
          `translate(${offsetX} ${offsetY + (heights[rowNumber] - childSizes[rowNumber][columnNumber].height) / 2})`
        );
        offsetX += childSizes[rowNumber][columnNumber].width + 6;
      } else {
        element.setAttribute('transform', `translate(${30} ${offsetY})`);
      }

      block.append(element);
    });

    offsetY += heights[rowNumber];
  });

  return block;
};

export const drawConditionBlockPath = (width: number) => (height: number) => {
  const dy = height / 2;
  const dx = dy * 1.2;
  const bottomLength = width - dx * 2;

  const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  blockPath.classList.add('block-path', 'condition-block-path');
  blockPath.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(0, dy),
      S.R.lineTo(dx, -dy),
      S.R.right(bottomLength),
      S.R.lineTo(dx, dy),
      S.R.lineTo(-dx, dy),
      S.R.left(bottomLength),
      S.closePath
    )
  );

  return blockPath;
};

type ChildElements = RNEA.ReadonlyNonEmptyArray<SVGGElement>;

export const drawConditionBlock = (childElements: ChildElements) => {
  const margin = (classList: DOMTokenList) =>
    classList.contains('label')
      ? 23
      : classList.contains('condition-block')
        ? 7
        : classList.contains('number-block')
          ? 20
          : 11;

  const leftMargin = pipe(childElements, RNEA.head, (a) => a.classList, margin);
  const rightMargin = pipe(childElements, RNEA.last, (a) => a.classList, margin);

  const childSizes = pipe(childElements, RNEA.map(getSize));

  const width = pipe(
    childSizes,
    RA.reduce(-6, (acc, cur) => acc + cur.width + 6),
    (a) => a + leftMargin + rightMargin
  );

  const height = pipe(
    childSizes,
    RA.reduce(0, (acc, cur) => (acc < cur.height ? cur.height : acc)),
    (a) => a + 8
  );

  const blockPath = drawConditionBlockPath(width)(height);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'condition-block');
  block.append(blockPath);

  let offsetX = leftMargin;

  childElements.forEach((element, columnNumber) => {
    element.setAttribute(
      'transform',
      `translate(${offsetX} ${(height - childSizes[columnNumber].height) / 2})`
    );
    offsetX += childSizes[columnNumber].width + 6;

    block.append(element);
  });

  return block;
};
