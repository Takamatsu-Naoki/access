import { pipe } from 'fp-ts/function';
import { concatAll } from 'fp-ts/Monoid';
import * as S from 'fp-ts/string';
import * as RA from 'fp-ts/ReadonlyArray';

export * from 'fp-ts/string';

export const repeat = (str: string) => (count: number) =>
	pipe(RA.replicate(count, str), concatAll(S.Monoid));

export const prepend = (second: string) => (first: string) => S.Semigroup.concat(second, first);

export const append = (second: string) => (first: string) => S.Semigroup.concat(first, second);
