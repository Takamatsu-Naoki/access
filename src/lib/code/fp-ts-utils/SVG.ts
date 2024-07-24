import { pipe } from 'fp-ts/function';
import * as S from '$lib/code/fp-ts-utils/String';

const concat = (second: string) => (first: string) =>
	pipe(first, S.append(' '), S.append(second));

const fromBoolean = (bool: boolean) => (bool ? '1' : '0');

export const draw = '';

export const closePath = (path: string) => pipe(path, concat(`Z`));

export namespace A {
	export const moveTo = (x: number, y: number) => (path: string) =>
		pipe(path, concat('M'), concat(`${x},${y}`));

	export const horizontal = (x: number) => (path: string) =>
		pipe(path, concat('H'), concat(`${x}`));

	export const vertical = (y: number) => (path: string) => pipe(path, concat('V'), concat(`${y}`));

	export const lineTo = (x: number, y: number) => (path: string) =>
		pipe(path, concat('L'), concat(`${x},${y}`));

	export const cubicCurve =
		(x1: number, y1: number) =>
		(x2: number, y2: number) =>
		(x: number, y: number) =>
		(path: string) =>
			pipe(path, concat('C'), concat(`${x1},${y1}`), concat(`${x2},${y2}`), concat(`${x},${y}`));

	export const smoothCubicCurve =
		(x2: number, y2: number) => (x: number, y: number) => (path: string) =>
			pipe(path, concat('S'), concat(`${x2},${y2}`), concat(`${x},${y}`));

	export const quadraticCurve =
		(x1: number, y1: number) => (x: number, y: number) => (path: string) =>
			pipe(path, concat('Q'), concat(`${x1},${y1}`), concat(`${x},${y}`));

	export const smoothQuadraticCurve = (x: number, y: number) => (path: string) =>
		pipe(path, concat('T'), concat(`${x},${y}`));

	export const arc =
		(rx: number, ry: number) =>
		(angle: number) =>
		(largeArcFlag: boolean) =>
		(sweepFlag: boolean) =>
		(x: number, y: number) =>
		(path: string) =>
			pipe(
				path,
				concat('A'),
				concat(`${rx}`),
				concat(`${ry}`),
				concat(`${angle}`),
				concat(fromBoolean(largeArcFlag)),
				concat(fromBoolean(sweepFlag)),
				concat(`${x},${y}`)
			);
}

export namespace R {
	export const moveTo = (dx: number, dy: number) => (path: string) =>
		pipe(path, concat('m'), concat(`${dx},${dy}`));

	export const horizontal = (dx: number) => (path: string) =>
		pipe(path, concat('h'), concat(`${dx}`));

	export const vertical = (dy: number) => (path: string) =>
		pipe(path, concat('v'), concat(`${dy}`));

	export const lineTo = (dx: number, dy: number) => (path: string) =>
		pipe(path, concat('l'), concat(`${dx},${dy}`));

	export const cubicCurve =
		(dx1: number, dy1: number) =>
		(dx2: number, dy2: number) =>
		(dx: number, dy: number) =>
		(path: string) =>
			pipe(
				path,
				concat('c'),
				concat(`${dx1},${dy1}`),
				concat(`${dx2},${dy2}`),
				concat(`${dx},${dy}`)
			);

	export const smoothCubicCurve =
		(dx2: number, dy2: number) => (dx: number, dy: number) => (path: string) =>
			pipe(path, concat('s'), concat(`${dx2},${dy2}`), concat(`${dx},${dy}`));

	export const quadraticCurve =
		(x1: number, y1: number) => (x: number, y: number) => (path: string) =>
			pipe(path, concat('q'), concat(`${x1},${y1}`), concat(`${x},${y}`));

	export const smoothQuadraticCurve = (x: number, y: number) => (path: string) =>
		pipe(path, concat('t'), concat(`${x},${y}`));

	export const arc =
		(rx: number, ry: number) =>
		(angle: number) =>
		(largeArcFlag: boolean) =>
		(sweepFlag: boolean) =>
		(x: number, y: number) =>
		(path: string) =>
			pipe(
				path,
				concat('a'),
				concat(`${rx}`),
				concat(`${ry}`),
				concat(`${angle}`),
				concat(fromBoolean(largeArcFlag)),
				concat(fromBoolean(sweepFlag)),
				concat(`${x},${y}`)
			);
}
