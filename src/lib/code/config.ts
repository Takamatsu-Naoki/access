export const Locale = {
  JaJP: 'ja_JP',
  EnUS: 'en_US',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

type KeyBinding = {
  up: string;
  down: string;
  left: string;
  right: string;
  enter: string;
  back: string;
};

type KeyBindingDef = {
  [key: string]: KeyBinding;
};

const keyBindingDef: KeyBindingDef = {
  arrow: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    enter: 'f',
    back: 'd'
  },
  wasd: {
    up: 'w',
    down: 'a',
    left: 's',
    right: 'd',
    enter: 'j',
    back: 'k'
  },
  hjkl: {
    up: 'k',
    down: 'j',
    left: 'h',
    right: 'l',
    enter: 'f',
    back: 'd'
  },
  numericKeypad: {
    up: '8',
    down: '2',
    left: '4',
    right: '6',
    enter: '5',
    back: '9'
  }
};

export type Config = Readonly<{
  voiceInput: boolean;
  locale: Locale;
  keyBinding: KeyBinding;
}>;

export const config: Config = {
  voiceInput: false,
  locale: Locale.EnUS,
  keyBinding: keyBindingDef.hjkl
};
