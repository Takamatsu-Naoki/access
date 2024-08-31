export type Config = Readonly<{
  voiceInput: boolean;
  locale: Locale;
  keyBindingMode: KeyBindingMode;
}>;

export const Locale = {
  JaJP: 'ja_JP',
  EnUS: 'en_US'
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const KeyBindingMode = {
  Arrow: 'arrow',
  Wasd: 'wasd',
  Hjkl: 'hjkl',
  NumericKeypad: 'numericKeypad'
} as const;

export type KeyBindingMode = (typeof KeyBindingMode)[keyof typeof KeyBindingMode];

type KeyBinding = {
  up: string;
  down: string;
  left: string;
  right: string;
  enter: string;
  back: string;
};

export const keyBinding: ReadonlyMap<KeyBindingMode, KeyBinding> = new Map([
  [
    KeyBindingMode.Arrow,
    {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      enter: 'f',
      back: 'd'
    }
  ],
  [
    KeyBindingMode.Wasd,
    {
      up: 'w',
      down: 'a',
      left: 's',
      right: 'd',
      enter: 'j',
      back: 'k'
    }
  ],
  [
    KeyBindingMode.Hjkl,
    {
      up: 'k',
      down: 'j',
      left: 'h',
      right: 'l',
      enter: 'f',
      back: 'd'
    }
  ],
  [
    KeyBindingMode.NumericKeypad,
    {
      up: '8',
      down: '2',
      left: '4',
      right: '6',
      enter: '5',
      back: '9'
    }
  ]
]);

export const config: Config = {
  voiceInput: false,
  locale: Locale.EnUS,
  keyBindingMode: KeyBindingMode.Hjkl
};

