import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

export type Table<E> = RNEA.ReadonlyNonEmptyArray<ReadonlyArray<E>>;

export type CellPosition = Readonly<{ rowNumber: number; columnNumber: number }>;

export const findRow =
  <E>(table: Table<E>) =>
    (rowNumber: number) =>
      pipe(table, RA.lookup(rowNumber))

export const findElement =
  <E>(table: Table<E>) =>
    (position: CellPosition) =>
      pipe(table, RA.lookup(position.rowNumber), O.flatMap(RA.lookup(position.columnNumber)));

export const appendElement =
  <E>(table: Table<E>) =>
    (element: E) =>
      pipe(
        table,
        RNEA.modifyLast((a) => [...a, element])
      );

export const appendEmptyRow = <E>(table: Table<E>) =>
  pipe(table, RA.append([] as ReadonlyArray<E>));
