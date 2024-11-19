const fromBoolean = (a: boolean) => (a ? '1' : '0');

const fromNumber = (a: number) => a.toString();

const fromTwoNumbers = (a: number, b: number) => `${a},${b}`;

export const draw = (...args: Array<string>) => args.join(' ');

export const moveTo = (dx: number, dy: number) => draw('m', fromTwoNumbers(dx, dy));

export const right = (dx: number) => draw('h', fromNumber(dx));

export const left = (dx: number) => draw('h', fromNumber(-dx));

export const down = (dy: number) => draw('v', fromNumber(dy));

export const up = (dy: number) => draw('v', fromNumber(-dy));

export const lineTo = (dx: number, dy: number) => draw('l', fromTwoNumbers(dx, dy));

export const cubicCurve =
  (dx1: number, dy1: number) => (dx2: number, dy2: number) => (dx: number, dy: number) =>
    draw('c', fromTwoNumbers(dx1, dy1), fromTwoNumbers(dx2, dy2), fromTwoNumbers(dx, dy));

export const smoothCubicCurve = (dx2: number, dy2: number) => (dx: number, dy: number) =>
  draw('s', fromTwoNumbers(dx2, dy2), fromTwoNumbers(dx, dy));

export const quadraticCurve = (x1: number, y1: number) => (x: number, y: number) =>
  draw('q', fromTwoNumbers(x1, y1), fromTwoNumbers(x, y));

export const smoothQuadraticCurve = (x: number, y: number) => draw('t', fromTwoNumbers(x, y));

export const arc =
  (rx: number, ry: number) =>
    (angle: number) =>
      (largeArcFlag: boolean) =>
        (sweepFlag: boolean) =>
          (x: number, y: number) =>
            draw(
              'a',
              fromNumber(rx),
              fromNumber(ry),
              fromNumber(angle),
              fromBoolean(largeArcFlag),
              fromBoolean(sweepFlag),
              fromTwoNumbers(x, y)
            );

export const closePath = 'Z';
