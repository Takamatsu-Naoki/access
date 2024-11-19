const fromBoolean = (a: boolean) => (a ? '1' : '0');

const fromNumber = (a: number) => a.toString();

const fromTwoNumbers = (a: number, b: number) => `${a},${b}`;

export const draw = (...args: Array<string>) => args.join(' ');

export const moveTo = (x: number, y: number) => draw('M', fromTwoNumbers(x, y));

export const right = (x: number) => draw('H', fromNumber(x));

export const left = (x: number) => draw('H', fromNumber(-x));

export const down = (y: number) => draw('V', fromNumber(y));

export const up = (y: number) => draw('V', fromNumber(-y));

export const lineTo = (x: number, y: number) => draw('L', fromTwoNumbers(x, y));

export const cubicCurve =
  (x1: number, y1: number) => (x2: number, y2: number) => (x: number, y: number) =>
    draw('C', fromTwoNumbers(x1, y1), fromTwoNumbers(x2, y2), fromTwoNumbers(x, y));

export const smoothCubicCurve = (x2: number, y2: number) => (x: number, y: number) =>
  draw('S', fromTwoNumbers(x2, y2), fromTwoNumbers(x, y));

export const quadraticCurve = (x1: number, y1: number) => (x: number, y: number) =>
  draw('Q', fromTwoNumbers(x1, y1), fromTwoNumbers(x, y));

export const smoothQuadraticCurve = (x: number, y: number) => draw('T', fromTwoNumbers(x, y));

export const arc =
  (rx: number, ry: number) =>
    (angle: number) =>
      (largeArcFlag: boolean) =>
        (sweepFlag: boolean) =>
          (x: number, y: number) =>
            draw(
              'A',
              fromNumber(rx),
              fromNumber(ry),
              fromNumber(angle),
              fromBoolean(largeArcFlag),
              fromBoolean(sweepFlag),
              fromTwoNumbers(x, y)
            );

export const closePath = 'Z';
