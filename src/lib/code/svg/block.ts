import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray';
import * as S from '$lib/code/fp-ts-utils/svg';
import { SymbolCategory } from '$lib/resource/graph/symbol-category';

export const getSize = (element: SVGGraphicsElement) => {
  const hiddenSVG = document.getElementById('hidden-SVG');

  hiddenSVG?.append(element);
  const boundingBox = element.getBBox();
  hiddenSVG?.removeChild(element);

  return boundingBox;
};

export const getOffset = (element: Element) => {
  const transform = element?.getAttribute('transform') ?? '';
  return {
    x: Number((transform.match(/(?<=\().+(?=\s)/) ?? [0])[0]),
    y: Number((transform.match(/(?<=\s).+(?=\))/) ?? [0])[0])
  };
};

const drawText = (content: string) => {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.classList.add('text');
  text.setAttribute('dominant-baseline', 'hanging');
  text.setAttribute('x', '4px');
  text.setAttribute('y', '4px');
  text.setAttribute('font-size', '20px');
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
      S.R.down(20),
      S.R.cubicCurve(0, 2)(1.2, 3)(3, 3),
      S.R.right(textWidth + 2),
      S.R.cubicCurve(2, 0)(3, -1.2)(3, -3),
      S.R.up(20),
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
    const isMultiLineBlock = 1 < heights.length;

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
        S.R.right(width + (isMultiLineBlock ? 30 : 0)),
        (upperSideOfPath) =>
          pipe(
            heights,
            RA.reduceWithIndex(upperSideOfPath, (index, path, height) =>
              index % 2 === 0
                ? pipe(path, S.R.down(height))
                : pipe(
                  path,
                  S.R.left(width - (isMultiLineBlock ? 0 : 30)),
                  concave,
                  S.R.down(height),
                  convex,
                  S.R.right(width - (isMultiLineBlock ? 0 : 30))
                )
            )
          ),
        S.R.left(width + (isMultiLineBlock ? 30 : 0)),
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
    RA.filterWithIndex((i, _a) => i % 2 === 0),
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
    RNEA.mapWithIndex((i, a) =>
      i % 2 === 0
        ? pipe(
          a,
          RA.reduce(0, (acc, cur) => (acc < cur ? cur : acc)),
          (a) => a + 12
        )
        : pipe(
          a,
          RA.reduce(0, (acc, cur) => acc + cur - 6)
        )
    )
  );

  const isMultiLineBlock = 1 < heights.length;

  const blockPath = drawActionBlockPath(width)(heights)(isTrigger);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', isTrigger ? 'trigger-action-block' : 'action-block');
  block.append(blockPath);

  let offsetX = 0;
  let offsetY = 0;

  childElements.forEach((inlineElements, rowNumber) => {
    offsetX = isMultiLineBlock ? 60 : 30;

    inlineElements.forEach((element, columnNumber) => {
      const translate =
        rowNumber % 2 === 0
          ? `translate(${offsetX} ${offsetY + (heights[rowNumber] - childSizes[rowNumber][columnNumber].height) / 2})`
          : `translate(${30} ${offsetY})`;

      element.setAttribute('transform', translate);

      block.append(element);

      offsetX += rowNumber % 2 === 0 ? childSizes[rowNumber][columnNumber].width + 6 : 0;
      offsetY += rowNumber % 2 !== 0 ? childSizes[rowNumber][columnNumber].height - 6 : 0;
    });

    offsetY += rowNumber % 2 === 0 ? heights[rowNumber] : 0;
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
  const padding = (classList: DOMTokenList) =>
    classList.contains('label')
      ? 23
      : classList.contains('condition-block')
        ? 7
        : classList.contains('number-block')
          ? 20
          : classList.contains('string-block')
          ? 30
          : 11;

  const leftPadding = pipe(childElements, RNEA.head, (a) => a.classList, padding);
  const rightPadding = pipe(childElements, RNEA.last, (a) => a.classList, padding);

  const childSizes = pipe(childElements, RNEA.map(getSize));

  const width = pipe(
    childSizes,
    RA.reduce(-6, (acc, cur) => acc + cur.width + 6),
    (a) => a + leftPadding + rightPadding
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

  let offsetX = leftPadding;

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

export const drawNumberBlockPath = (width: number) => (height: number) => {
  const radius = height / 2;
  const controlPoint = radius * 0.553;
  const delta = radius - controlPoint;
  const bottomLength = width - radius * 2;

  const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  blockPath.classList.add('block-path', 'number-block-path');
  blockPath.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(0, radius),
      S.R.cubicCurve(0, -controlPoint)(delta, -radius)(radius, -radius),
      S.R.right(bottomLength),
      S.R.cubicCurve(controlPoint, 0)(radius, delta)(radius, radius),
      S.R.cubicCurve(0, controlPoint)(-delta, radius)(-radius, radius),
      S.R.left(bottomLength),
      S.R.cubicCurve(-controlPoint, 0)(-radius, -delta)(-radius, -radius),
      S.closePath
    )
  );

  return blockPath;
};

export const drawNumberBlock = (childElements: ChildElements) => {
  const padding = (classList: DOMTokenList) =>
    classList.contains('label')
      ? 12
      : classList.contains('number-block')
        ? 4
        : classList.contains('string-block')
          ? 18
          : 6;

  const leftPadding = pipe(childElements, RNEA.head, (a) => a.classList, padding);
  const rightPadding = pipe(childElements, RNEA.last, (a) => a.classList, padding);

  const childSizes = pipe(childElements, RNEA.map(getSize));

  const width = pipe(
    childSizes,
    RA.reduce(-6, (acc, cur) => acc + cur.width + 6),
    (a) => a + leftPadding + rightPadding
  );

  const height = pipe(
    childSizes,
    RA.reduce(0, (acc, cur) => (acc < cur.height ? cur.height : acc)),
    (a) => a + 8
  );

  const blockPath = drawNumberBlockPath(width)(height);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'number-block');
  block.append(blockPath);

  let offsetX = leftPadding;

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

export const drawPlaceholderBlock = (category: SymbolCategory) => (placeholder: string) => {
  const label = drawLabel(placeholder);

  const block =
    category === SymbolCategory.Action
      ? drawActionBlock([[label]])(false)
      : category === SymbolCategory.Condition
        ? drawConditionBlock([label])
        : category === SymbolCategory.Number
          ? drawNumberBlock([label])
          : category === SymbolCategory.String
            ? drawStringBlock(label)
            : category === SymbolCategory.Literal
              ? label
              : document.createElementNS('http://www.w3.org/2000/svg', 'g');

  block.classList.add('placeholder-block');

  return block;
};

export const drawArrow = () => {
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow.classList.add('highlight');
  arrow.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(2.4, 7.4),
      S.R.right(11),
      S.R.up(4.1),
      S.R.cubicCurve(0, -0.4)(0.7, -0.4)(1.1, 0),
      S.R.lineTo(9, 7.9),
      S.R.cubicCurve(0.5, 0.5)(0.5, 1)(0, 1.5),
      S.R.lineTo(-9, 7.9),
      S.R.cubicCurve(-0.4, 0.4)(-1.1, 0.4)(-1.1, 0),
      S.R.up(4.1),
      S.R.left(11),
      S.R.cubicCurve(-2.4, 0)(-2.4, 0)(-2.4, -2.4),
      S.R.up(4.3),
      S.R.cubicCurve(0, -2.4)(0, -2.4)(2.4, -2.4),
      S.closePath
    )
  );

  return arrow;
};

export const drawOutline = (width: number) => (height: number) => {
  const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  outline.classList.add('highlight');
  outline.setAttribute(
    'd',
    pipe(
      S.draw,
      S.A.moveTo(-6, -6),
      S.R.right(width + 12),
      S.R.down(height + 12),
      S.R.left(width + 12),
      S.closePath,
      S.A.moveTo(0, 3),
      S.R.down(height - 6),
      S.R.cubicCurve(0, 2)(1.2, 3)(3, 3),
      S.R.right(width - 6),
      S.R.cubicCurve(2, 0)(3, -1.2)(3, -3),
      S.R.up(height - 6),
      S.R.cubicCurve(0, -2)(-1.2, -3)(-3, -3),
      S.R.left(width - 6),
      S.R.cubicCurve(-1.2, 0)(-3, 1.2)(-3, 3),
      S.closePath
    )
  );

  return outline;
};

export const isLabel = (element: Element) => element.classList.contains('label');

export const isBlock = (element: Element) => element.classList.contains('block');

export const isClosedSectionBlock = (element: Element) =>
  element.classList.contains('closed-section-block');

export const isOpenedSectionBlock = (element: Element) =>
  element.classList.contains('opened-section-block');

export const isSectionBlock = (element: Element) =>
  isClosedSectionBlock(element) || isOpenedSectionBlock(element);

export const isTriggerActionBlock = (element: Element) =>
  element.classList.contains('trigger-action-block');

export const isActionBlock = (element: Element) => element.classList.contains('action-block');

export const isConditionBlock = (element: Element) => element.classList.contains('condition-block');

export const isNumberBlock = (element: Element) => element.classList.contains('number-block');

export const isStringBlock = (element: Element) => element.classList.contains('string-block');

export const isPlaceholderBlock = (element: Element) =>
  element.classList.contains('placeholder-block');

export const getCategoryByElement = (element: Element) =>
  isTriggerActionBlock(element)
    ? SymbolCategory.TriggerAction
    : isActionBlock(element)
      ? SymbolCategory.Action
      : isConditionBlock(element)
        ? SymbolCategory.Condition
        : isNumberBlock(element)
          ? SymbolCategory.Number
          : isStringBlock(element)
            ? SymbolCategory.String
            : SymbolCategory.None;

const alignChildElements = (childElements: ReadonlyArray<SVGGElement>) =>
  pipe(
    childElements,
    RA.reduce(RNEA.of([] as SVGGElement[]), (acc, cur) =>
      isActionBlock(cur) && pipe(acc, RNEA.last, RA.last, O.exists(isActionBlock))
        ? pipe(
          acc,
          RNEA.modifyLast((a) => [...a, cur])
        )
        : isActionBlock(cur)
          ? pipe(acc, RA.append([cur]))
          : pipe(acc, RNEA.last, RA.last, O.exists(isActionBlock))
            ? pipe(acc, RA.append([cur]))
            : pipe(
              acc,
              RNEA.modifyLast((a) => [...a, cur])
            )
    )
  );

export const drawBlock =
  (category: SymbolCategory) => (childElements: RNEA.ReadonlyNonEmptyArray<SVGGElement>) =>
    category === SymbolCategory.TriggerAction
      ? drawActionBlock(alignChildElements(childElements))(true)
      : category === SymbolCategory.Action
        ? drawActionBlock(alignChildElements(childElements))(false)
        : category === SymbolCategory.Condition
          ? drawConditionBlock(childElements)
          : category === SymbolCategory.Number
            ? drawNumberBlock(childElements)
            : category === SymbolCategory.String
              ? drawStringBlock(RNEA.head(childElements))
              : document.createElementNS('http://www.w3.org/2000/svg', 'g');

export const getData = (key: string) => (block: Element) =>
  block instanceof SVGGElement ? (block.dataset[key] ?? '') : '';

export const setData = (key: string) => (value: string) => (block: SVGGElement) => {
  block.dataset[key] = value;
  return block;
};

export const resolveTopLevelBlock = (element: Element): Element =>
  pipe(
    element.parentElement,
    O.fromNullable,
    O.match(
      () => element,
      (a) => (isBlock(a) ? resolveTopLevelBlock(a) : element)
    )
  );

export const resolveBlock = (element: Element): Element =>
  pipe(
    element.parentElement,
    O.fromNullable,
    O.match(
      () => element,
      (a) => (isBlock(element) ? element : isBlock(a) ? a : resolveBlock(a))
    )
  );

export const resolveActionBlock = (element: Element): Element =>
  pipe(
    element.parentElement,
    O.fromNullable,
    O.match(
      () => element,
      (a) =>
        isTriggerActionBlock(element) || isActionBlock(element)
          ? element
          : isTriggerActionBlock(a) || isActionBlock(a)
            ? a
            : resolveActionBlock(a)
    )
  );
