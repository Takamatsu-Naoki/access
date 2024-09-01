import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { type Table, appendElement, appendEmptyRow } from '$lib/code/fp-ts-utils/table';
import { isActionBlock, isTriggerActionBlock } from './svg/block';

export type LabelTable = Table<Element>;

export const traverseElements = (table: LabelTable) => (element: Element) => {
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

export const generateWorkspaceTable = (workspace: Element) => {
  return pipe(workspace, traverseElements([[]]), RA.filter(RA.isNonEmpty));
};
