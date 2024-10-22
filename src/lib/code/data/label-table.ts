import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  type CellPosition,
  type Table,
  appendElement,
  appendEmptyRow
} from '$lib/code/fp-ts-utils/table';
import { resolveActionBlock, isActionBlock, isLabel, isTriggerActionBlock } from '../svg/block';

export type ElementTable = Table<Element>;

export const traverseElements = (table: ElementTable) => (element: Element) => {
  const childElements = Array.from(element.children);

  childElements.forEach((childElement) => {
    table = childElement.classList.contains('label')
      ? appendElement(table)(childElement)
      : isActionBlock(childElement)
        ? appendEmptyRow(table)
        : table;
    table = traverseElements(table)(childElement);
  });

  return isTriggerActionBlock(element) || isActionBlock(element) ? appendEmptyRow(table) : table;
};

export const generateWorkspaceTable = (workspace: Element) =>
  pipe(
    workspace,
    traverseElements([[]]),
    RA.filter(RA.isNonEmpty),
    RA.map((a) => pipe(a, RA.prepend(resolveActionBlock(RNEA.head(a))))),
    RNEA.fromReadonlyArray,
    O.getOrElse(() => [[]] as ElementTable)
  );

export const generateToolboxTable = (toolbox: Element) =>
  pipe(
    Array.from(toolbox.children),
    RA.map((a) => [a]),
    RNEA.fromReadonlyArray,
    O.getOrElse(() => [[]] as ElementTable)
  );

export const isTop = (position: CellPosition) =>
  position.rowNumber === 0;

export const isBottom = (table: ElementTable) => (position: CellPosition) =>
  position.rowNumber === table.length - 1;

export const moveUp = (table: ElementTable) => (position: CellPosition) =>
  isTop(position)
    ? {
      rowNumber: table.length - 1,
      columnNumber: 0
    }
    : {
      rowNumber: position.rowNumber - 1,
      columnNumber: 0
    };

export const moveDown = (table: ElementTable) => (position: CellPosition) =>
  isBottom(table)(position)
    ? {
      rowNumber: 0,
      columnNumber: 0
    }
    : {
      rowNumber: position.rowNumber + 1,
      columnNumber: 0
    };

export const moveLeft = (table: ElementTable) => (position: CellPosition) =>
  position.columnNumber === 0
    ? {
      ...position,
      columnNumber: table[position.rowNumber].length - 1
    }
    : {
      ...position,
      columnNumber: position.columnNumber - 1
    };

export const moveRight = (table: ElementTable) => (position: CellPosition) =>
  position.columnNumber === table[position.rowNumber].length - 1
    ? {
      ...position,
      columnNumber: 0
    }
    : {
      ...position,
      columnNumber: position.columnNumber + 1
    };
