import { SymbolEntity } from '$lib/resource/graph/symbol-entity';

export const SymbolCategory = {
  TriggerAction: 'triggerAction',
  Action: 'action',
  Condition: 'condition',
  Number: 'number',
  String: 'string',
  Sound: 'sound',
  Event: 'event',
  Variable: 'variable'
} as const;

export type SymbolCategory = (typeof SymbolCategory)[keyof typeof SymbolCategory];

export const symbolEntitiesByCategory: ReadonlyMap<
  SymbolCategory,
  ReadonlyArray<SymbolEntity>
> = new Map([
  [
    SymbolCategory.TriggerAction,
    [SymbolEntity.ProgramStart, SymbolEntity.KeyPressed, SymbolEntity.EventReceived]
  ],
  [
    SymbolCategory.Action,
    [
      SymbolEntity.Say,
      SymbolEntity.SayUntil,
      SymbolEntity.Play,
      SymbolEntity.PlayUntil,
      SymbolEntity.StopSound,
      SymbolEntity.MoveSound,
      SymbolEntity.GlideSound,
      SymbolEntity.SetPitch,
      SymbolEntity.SetVolume,
      SymbolEntity.Wait,
      SymbolEntity.DeclareVariable,
      SymbolEntity.SetVariable,
      SymbolEntity.ChangeVariable,
      SymbolEntity.SendEvent,
      SymbolEntity.IfThen,
      SymbolEntity.IfElse,
      SymbolEntity.Repeat,
      SymbolEntity.RepeatFor,
      SymbolEntity.RepeatUntil
    ]
  ],
  [
    SymbolCategory.Condition,
    [
      SymbolEntity.IsGreater,
      SymbolEntity.IsLess,
      SymbolEntity.Equals,
      SymbolEntity.And,
      SymbolEntity.Or,
      SymbolEntity.Not
    ]
  ],
  [
    SymbolCategory.Number,
    [
      SymbolEntity.NumericLiteral,
      SymbolEntity.Plus,
      SymbolEntity.Minus,
      SymbolEntity.Times,
      SymbolEntity.DividedBy,
      SymbolEntity.Remainder,
      SymbolEntity.RandomNumber
    ]
  ],
  [SymbolCategory.String, [SymbolEntity.StringLiteral]]
]);
