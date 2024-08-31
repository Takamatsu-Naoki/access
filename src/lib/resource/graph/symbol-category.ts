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

type SymbolEntitiesByCategory = {
  [key in SymbolCategory]: ReadonlyArray<SymbolEntity>;
};

const symbolEntitiesByCategory: SymbolEntitiesByCategory = {
  [SymbolCategory.TriggerAction]: [
    SymbolEntity.ProgramStart,
    SymbolEntity.KeyPressed,
    SymbolEntity.EventReceived
  ],
  [SymbolCategory.Action]: [
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
  ],
  [SymbolCategory.Condition]: [
    SymbolEntity.IsGreater,
    SymbolEntity.IsLess,
    SymbolEntity.Equals,
    SymbolEntity.And,
    SymbolEntity.Or,
    SymbolEntity.Not
  ],
  [SymbolCategory.Number]: [
    SymbolEntity.NumericLiteral,
    SymbolEntity.Plus,
    SymbolEntity.Minus,
    SymbolEntity.Times,
    SymbolEntity.DividedBy,
    SymbolEntity.Remainder,
    SymbolEntity.RandomNumber
  ],
  [SymbolCategory.String]: [SymbolEntity.StringLiteral],
  [SymbolCategory.Sound]: [],
  [SymbolCategory.Event]: [],
  [SymbolCategory.Variable]: []
};

export const getSymbolEntities = (category: SymbolCategory) => symbolEntitiesByCategory[category];

type SymbolCategoryByEntity = {
  [key in SymbolEntity]: SymbolCategory;
};

const symbolCategoryByEntity: SymbolCategoryByEntity = {
  [SymbolEntity.ProgramStart]: SymbolCategory.TriggerAction,
  [SymbolEntity.KeyPressed]: SymbolCategory.TriggerAction,
  [SymbolEntity.EventReceived]: SymbolCategory.TriggerAction,
  [SymbolEntity.Say]: SymbolCategory.Action,
  [SymbolEntity.SayUntil]: SymbolCategory.Action,
  [SymbolEntity.Play]: SymbolCategory.Action,
  [SymbolEntity.PlayUntil]: SymbolCategory.Action,
  [SymbolEntity.StopSound]: SymbolCategory.Action,
  [SymbolEntity.MoveSound]: SymbolCategory.Action,
  [SymbolEntity.GlideSound]: SymbolCategory.Action,
  [SymbolEntity.SetPitch]: SymbolCategory.Action,
  [SymbolEntity.SetVolume]: SymbolCategory.Action,
  [SymbolEntity.Wait]: SymbolCategory.Action,
  [SymbolEntity.DeclareVariable]: SymbolCategory.Action,
  [SymbolEntity.SetVariable]: SymbolCategory.Action,
  [SymbolEntity.ChangeVariable]: SymbolCategory.Action,
  [SymbolEntity.SendEvent]: SymbolCategory.Action,
  [SymbolEntity.IfThen]: SymbolCategory.Action,
  [SymbolEntity.IfElse]: SymbolCategory.Action,
  [SymbolEntity.Repeat]: SymbolCategory.Action,
  [SymbolEntity.RepeatFor]: SymbolCategory.Action,
  [SymbolEntity.RepeatUntil]: SymbolCategory.Action,
  [SymbolEntity.IsGreater]: SymbolCategory.Condition,
  [SymbolEntity.IsLess]: SymbolCategory.Condition,
  [SymbolEntity.Equals]: SymbolCategory.Condition,
  [SymbolEntity.And]: SymbolCategory.Condition,
  [SymbolEntity.Or]: SymbolCategory.Condition,
  [SymbolEntity.Not]: SymbolCategory.Condition,
  [SymbolEntity.NumericLiteral]: SymbolCategory.Number,
  [SymbolEntity.Plus]: SymbolCategory.Number,
  [SymbolEntity.Minus]: SymbolCategory.Number,
  [SymbolEntity.Times]: SymbolCategory.Number,
  [SymbolEntity.DividedBy]: SymbolCategory.Number,
  [SymbolEntity.Remainder]: SymbolCategory.Number,
  [SymbolEntity.RandomNumber]: SymbolCategory.Number,
  [SymbolEntity.StringLiteral]: SymbolCategory.String
};

export const getSymbolCategory = (entity: SymbolEntity) => symbolCategoryByEntity[entity];
