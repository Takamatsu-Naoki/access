import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { type Table, appendElement, appendEmptyRow } from '$lib/code/fp-ts-utils/table';
import { isActionBlock, isLabel, isTriggerActionBlock } from './svg/block';

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

export const generateWorkspaceTable = (workspace: Element) =>
  pipe(workspace, traverseElements([[]]), RA.filter(RA.isNonEmpty));

export const generateToolboxTable = (toolbox: Element) =>
  pipe(
    Array.from(toolbox.children),
    RA.map((block) => pipe(Array.from(block.children), RA.filter(isLabel), RA.head)),
    RA.compact,
    RA.map((a) => [a]),
    RNEA.fromReadonlyArray,
    O.getOrElse(() => [[]] as LabelTable)
  );
