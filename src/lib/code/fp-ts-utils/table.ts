import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

export type Table<E> = RNEA.ReadonlyNonEmptyArray<ReadonlyArray<E>>;

export const findElement =
  <E>(table: Table<E>) =>
    (rowNumber: number) =>
      (columnNumber: number) =>
        table[rowNumber][columnNumber];

export const appendElement =
  <E>(table: Table<E>) =>
    (element: E) =>
      pipe(
        table,
        RNEA.modifyLast((a) => [...a, element])
      );

export const appendEmptyRow = <E>(table: Table<E>) =>
  pipe(table, RA.append([] as ReadonlyArray<E>));
