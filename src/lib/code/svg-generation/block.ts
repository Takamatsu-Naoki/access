import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/lib/ReadonlyNonEmptyArray';
import * as SR from '$lib/code/utils/svg/relative';
import * as SA from '$lib/code/utils/svg/absolute';
import { SymbolCategory } from '$lib/code/code-graph/symbol-category';
import type { LabelText } from '$lib/code/syntax-definition/syntax';
import { type Table, appendElement, appendRow } from '../utils/table';

export type Size = { width: number; height: number };

export const getSize = (element: SVGGraphicsElement) => {
  const hiddenSVG = document.getElementById('hidden-SVG');

  if (hiddenSVG == null) {
    return { width: 0, height: 0 };
  }

  hiddenSVG.append(element);
  const boundingBox = element.getBBox();
  hiddenSVG.removeChild(element);

  return { width: boundingBox.width, height: boundingBox.height };
};

export const getOffset = (element: Element) => {
  const transform = element.getAttribute('transform') ?? '';
  return {
    x: Number((transform.match(/(?<=\().+(?=\s)/) ?? ['0'])[0]),
    y: Number((transform.match(/(?<=\s).+(?=\))/) ?? ['0'])[0])
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
    SA.draw(
      SA.moveTo(0, 3),
      SR.down(20),
      SR.cubicCurve(0, 2)(1.2, 3)(3, 3),
      SR.right(textWidth + 2),
      SR.cubicCurve(2, 0)(3, -1.2)(3, -3),
      SR.up(20),
      SR.cubicCurve(0, -2)(-1.2, -3)(-3, -3),
      SR.left(textWidth + 2),
      SR.cubicCurve(-1.2, 0)(-3, 1.2)(-3, 3),
      SA.closePath
    )
  );

  return labelPath;
};

export const drawLabel = (labelText: LabelText) => {
  const text = drawText(labelText.value);
  const textSize = getSize(text);

  const labelPath = drawLabelPath(textSize.width);

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  label.classList.add('label');
  label.dataset.screenReaderText = labelText.screenReaderText;
  label.append(labelPath);
  label.append(text);

  return label;
};

const convex = SA.draw(
  SR.right(6),
  SR.up(3),
  SR.cubicCurve(0, -3)(0, -3)(3, -3),
  SR.right(12),
  SR.cubicCurve(3, 0)(3, 0)(3, 3),
  SR.down(3),
  SR.right(6)
);

const concave = SA.draw(
  SR.left(6),
  SR.up(3),
  SR.cubicCurve(0, -3)(0, -3)(-3, -3),
  SR.left(12),
  SR.cubicCurve(-3, 0)(-3, 0)(-3, 3),
  SR.down(3),
  SR.left(6)
);

export const drawActionBlockPath =
  (width: number) => (heights: RNEA.ReadonlyNonEmptyArray<number>) => (isTrigger: boolean) => {
    const isMultiLineBlock = 1 < heights.length;

    const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    blockPath.classList.add(
      'block-path',
      isTrigger ? 'trigger-action-block-path' : 'action-block-path'
    );

    const startSegment = SA.draw(
      SA.moveTo(0, 0),
      isTrigger ? SR.right(30) : convex,
      SR.right(width + (isMultiLineBlock ? 30 : 0))
    );

    const middleSegment = pipe(
      heights,
      RA.reduceWithIndex('', (index, path, height) =>
        index % 2 === 0
          ? SA.draw(path, SR.down(height))
          : SA.draw(
            path,
            SR.left(width - (isMultiLineBlock ? 0 : 30)),
            concave,
            SR.down(height),
            convex,
            SR.right(width - (isMultiLineBlock ? 0 : 30))
          )
      )
    );

    const endSegment = SA.draw(
      SR.left(width + (isMultiLineBlock ? 30 : 0)),
      isTrigger ? SR.left(30) : concave,
      SA.closePath
    );

    blockPath.setAttribute('d', SA.draw(startSegment, middleSegment, endSegment));

    return blockPath;
  };

export type ChildrenTable = Table<SVGGElement>;

const doubleMap =
  <A, B>(f: (a: A) => B) =>
    (table: Table<A>) =>
      pipe(
        table,
        RNEA.map((a) => pipe(a, RA.map(f)))
      );

const getMax = (a: ReadonlyArray<number>) =>
  pipe(
    a,
    RA.reduce(0, (acc, cur) => (acc < cur ? cur : acc))
  );

export const drawActionBlock = (childrenTable: ChildrenTable) => (isTrigger: boolean) => {
  const childrenSize = pipe(childrenTable, doubleMap(getSize));

  const childrenWidth = pipe(
    childrenSize,
    doubleMap((a) => a.width)
  );

  const width = pipe(
    childrenWidth,
    RA.filterWithIndex((i) => i % 2 === 0),
    RA.map((rowItems) =>
      pipe(
        rowItems,
        RA.reduce(0, (acc, cur) => acc + cur + 6)
      )
    ),
    getMax
  );

  const childrenHeight = pipe(
    childrenSize,
    doubleMap((a) => a.height)
  );

  const heights = pipe(
    childrenHeight,
    RNEA.mapWithIndex((i, rowItems) =>
      i % 2 === 0
        ? pipe(getMax(rowItems), (a) => a + 12)
        : pipe(
          rowItems,
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

  childrenTable.forEach((rowItems, rowNumber) => {
    offsetX = isMultiLineBlock ? 60 : 30;

    rowItems.forEach((child, columnNumber) => {
      const translate =
        rowNumber % 2 === 0
          ? `translate(${offsetX} ${offsetY + (heights[rowNumber] - childrenSize[rowNumber][columnNumber].height) / 2})`
          : `translate(${30} ${offsetY})`;

      child.setAttribute('transform', translate);

      block.append(child);

      offsetX += rowNumber % 2 === 0 ? childrenSize[rowNumber][columnNumber].width + 6 : 0;
      offsetY += rowNumber % 2 !== 0 ? childrenSize[rowNumber][columnNumber].height - 6 : 0;
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
    SA.draw(
      SA.moveTo(0, dy),
      SR.lineTo(dx, -dy),
      SR.right(bottomLength),
      SR.lineTo(dx, dy),
      SR.lineTo(-dx, dy),
      SR.left(bottomLength),
      SA.closePath
    )
  );

  return blockPath;
};

type ChildrenArray = RNEA.ReadonlyNonEmptyArray<SVGGElement>;

export const drawConditionBlock = (childrenArray: ChildrenArray) => {
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

  const leftPadding = pipe(childrenArray, RNEA.head, (a) => a.classList, padding);
  const rightPadding = pipe(childrenArray, RNEA.last, (a) => a.classList, padding);

  const childrenSize = pipe(childrenArray, RNEA.map(getSize));

  const width = pipe(
    childrenSize,
    RA.reduce(-6, (acc, cur) => acc + cur.width + 6),
    (a) => a + leftPadding + rightPadding
  );

  const childrenHeight = pipe(
    childrenSize,
    RA.map((a) => a.height)
  );

  const height = pipe(getMax(childrenHeight), (a) => a + 8);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'condition-block');

  const blockPath = drawConditionBlockPath(width)(height);
  block.append(blockPath);

  let offsetX = leftPadding;

  childrenArray.forEach((child, columnNumber) => {
    child.setAttribute(
      'transform',
      `translate(${offsetX} ${(height - childrenSize[columnNumber].height) / 2})`
    );
    offsetX += childrenSize[columnNumber].width + 6;

    block.append(child);
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
    SA.draw(
      SA.moveTo(0, radius),
      SR.cubicCurve(0, -controlPoint)(delta, -radius)(radius, -radius),
      SR.right(bottomLength),
      SR.cubicCurve(controlPoint, 0)(radius, delta)(radius, radius),
      SR.cubicCurve(0, controlPoint)(-delta, radius)(-radius, radius),
      SR.left(bottomLength),
      SR.cubicCurve(-controlPoint, 0)(-radius, -delta)(-radius, -radius),
      SA.closePath
    )
  );

  return blockPath;
};

export const drawNumberBlock = (childrenArray: ChildrenArray) => {
  const padding = (classList: DOMTokenList) =>
    classList.contains('label')
      ? 12
      : classList.contains('number-block')
        ? 4
        : classList.contains('string-block')
          ? 18
          : 6;

  const leftPadding = pipe(childrenArray, RNEA.head, (a) => a.classList, padding);
  const rightPadding = pipe(childrenArray, RNEA.last, (a) => a.classList, padding);

  const childrenSize = pipe(childrenArray, RNEA.map(getSize));

  const width = pipe(
    childrenSize,
    RA.reduce(-6, (acc, cur) => acc + cur.width + 6),
    (a) => a + leftPadding + rightPadding
  );

  const childrenHeight = pipe(
    childrenSize,
    RA.map((a) => a.height)
  );

  const height = pipe(getMax(childrenHeight), (a) => a + 8);

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'number-block');

  const blockPath = drawNumberBlockPath(width)(height);
  block.append(blockPath);

  let offsetX = leftPadding;

  childrenArray.forEach((child, columnNumber) => {
    child.setAttribute(
      'transform',
      `translate(${offsetX} ${(height - childrenSize[columnNumber].height) / 2})`
    );
    offsetX += childrenSize[columnNumber].width + 6;

    block.append(child);
  });

  return block;
};

export const drawStringBlockPath = (label: SVGGElement) => {
  const labelSize = getSize(label);

  const blockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  blockPath.classList.add('block-path', 'string-block-path');
  blockPath.setAttribute(
    'd',
    SA.draw(
      SA.moveTo(0, 0),
      SR.right(labelSize.width + 8),
      SR.down(labelSize.height + 8),
      SR.left(labelSize.width + 8),
      SA.closePath
    )
  );

  return blockPath;
};

export const drawStringBlock = (label: SVGGElement) => {
  label.setAttribute('transform', 'translate(4 4)');

  const block = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  block.classList.add('block', 'string-block');

  const blockPath = drawStringBlockPath(label);
  block.append(blockPath);

  block.append(label);

  return block;
};

export const drawPlaceholderBlock = (category: SymbolCategory) => (labelText: LabelText) => {
  const label = drawLabel(labelText);

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
  arrow.classList.add('highlight', 'arrow');
  arrow.setAttribute(
    'd',
    SA.draw(
      SA.moveTo(2.4, 7.4),
      SR.right(11),
      SR.up(4.1),
      SR.cubicCurve(0, -0.4)(0.7, -0.4)(1.1, 0),
      SR.lineTo(9, 7.9),
      SR.cubicCurve(0.5, 0.5)(0.5, 1)(0, 1.5),
      SR.lineTo(-9, 7.9),
      SR.cubicCurve(-0.4, 0.4)(-1.1, 0.4)(-1.1, 0),
      SR.up(4.1),
      SR.left(11),
      SR.cubicCurve(-2.4, 0)(-2.4, 0)(-2.4, -2.4),
      SR.up(4.3),
      SR.cubicCurve(0, -2.4)(0, -2.4)(2.4, -2.4),
      SA.closePath
    )
  );

  return arrow;
};

export const drawOutline = (width: number) => (height: number) => {
  const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  outline.classList.add('highlight', 'outline');
  outline.setAttribute(
    'd',
    SA.draw(
      SA.moveTo(-6, -6),
      SR.right(width + 12),
      SR.down(height + 12),
      SR.left(width + 12),
      SA.closePath,
      SA.moveTo(0, 3),
      SR.down(height - 6),
      SR.cubicCurve(0, 2)(1.2, 3)(3, 3),
      SR.right(width - 6),
      SR.cubicCurve(2, 0)(3, -1.2)(3, -3),
      SR.up(height - 6),
      SR.cubicCurve(0, -2)(-1.2, -3)(-3, -3),
      SR.left(width - 6),
      SR.cubicCurve(-1.2, 0)(-3, 1.2)(-3, 3),
      SA.closePath
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

export const isTriggerOrActionBlock = (element: Element) =>
  isTriggerActionBlock(element) || isActionBlock(element);

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

const generateChildrenTable = (childrenArray: ChildrenArray) =>
  pipe(
    childrenArray,
    RA.reduce(RNEA.of([] as ReadonlyArray<SVGGElement>), (table, element) =>
      isActionBlock(element) && pipe(table, RNEA.last, RA.last, O.exists(isActionBlock))
        ? appendElement(table)(element)
        : isActionBlock(element)
          ? appendRow(table)(element)
          : pipe(table, RNEA.last, RA.last, O.exists(isActionBlock))
            ? appendRow(table)(element)
            : appendElement(table)(element)
    )
  );

export const drawBlock = (category: SymbolCategory) => (childrenArray: ChildrenArray) =>
  category === SymbolCategory.TriggerAction
    ? drawActionBlock(generateChildrenTable(childrenArray))(true)
    : category === SymbolCategory.Action
      ? drawActionBlock(generateChildrenTable(childrenArray))(false)
      : category === SymbolCategory.Condition
        ? drawConditionBlock(childrenArray)
        : category === SymbolCategory.Number
          ? drawNumberBlock(childrenArray)
          : category === SymbolCategory.String
            ? drawStringBlock(RNEA.head(childrenArray))
            : document.createElementNS('http://www.w3.org/2000/svg', 'g');

export const getData = (key: string) => (block: Element) =>
  block instanceof SVGElement ? (block.dataset[key] ?? '') : '';

export const setData =
  (key: string) =>
    (value: string) =>
      <E extends SVGElement>(block: E) => {
        block.dataset[key] = value;
        return block;
      };

export const resolveTopLevelBlock = (element: Element): Element => {
  const parent = O.fromNullable(element.parentElement);

  return O.isNone(parent)
    ? element
    : isBlock(parent.value)
      ? resolveTopLevelBlock(parent.value)
      : element;
};

export const resolveBlock = (element: Element): Element => {
  const parent = O.fromNullable(element.parentElement);

  return isBlock(element) ? element : O.isNone(parent) ? element : resolveBlock(parent.value);
};

export const resolveActionBlock = (element: Element): Element => {
  const parent = O.fromNullable(element.parentElement);

  return isTriggerOrActionBlock(element)
    ? element
    : O.isNone(parent)
      ? element
      : resolveBlock(parent.value);
};
