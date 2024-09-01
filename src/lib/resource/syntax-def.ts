import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Locale } from '$lib/resource/config';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';

const TypedRelation = Object.fromEntries(
  Object.entries(SymbolRelation).map(([key, value]) => [key, { value }])
) as { [K in keyof typeof SymbolRelation]: { value: (typeof SymbolRelation)[K] } };

export type TypedRelation = (typeof TypedRelation)[keyof typeof TypedRelation];

export const isTypedRelation = (a: string | TypedRelation): a is TypedRelation =>
  typeof a !== 'string';

export const isLabelText = (a: string | TypedRelation): a is string => typeof a === 'string';

export const unpackRelation = (a: TypedRelation) => a.value;

export type Syntax = RNEA.ReadonlyNonEmptyArray<string | TypedRelation>;

type SyntaxDef = {
  [key in SymbolEntity]: Syntax;
};

type SyntaxDefByLocale = {
  [key in Locale]: SyntaxDef;
};

const syntaxDefByLocale: SyntaxDefByLocale = {
  [Locale.EnUS]: {
    [SymbolEntity.ProgramStart]: [
      'When the program starts',
      TypedRelation.Action,
      '↩//End of the program'
    ],
    [SymbolEntity.KeyPressed]: [
      TypedRelation.Key,
      'is pressed',
      TypedRelation.Action,
      '↩//End of the key event'
    ],
    [SymbolEntity.EventReceived]: [
      TypedRelation.Event,
      'is received',
      TypedRelation.Action,
      '↩//End of the event'
    ],
    [SymbolEntity.Say]: ['Say', TypedRelation.Content],
    [SymbolEntity.SayUntil]: ['Say', TypedRelation.Content, 'until done'],
    [SymbolEntity.Play]: ['Play', TypedRelation.Sound],
    [SymbolEntity.PlayUntil]: ['Play', TypedRelation.Sound, 'until done'],
    [SymbolEntity.StopSound]: ['Stop all sounds'],
    [SymbolEntity.MoveSound]: ['Move', TypedRelation.Sound, 'to x:', TypedRelation.Coordinate],
    [SymbolEntity.GlideSound]: [
      'Glide',
      TypedRelation.Sound,
      'to x:',
      TypedRelation.Coordinate,
      'in',
      TypedRelation.Duration,
      'seconds'
    ],
    [SymbolEntity.SetPitch]: [
      'Set pitch of',
      TypedRelation.Sound,
      'to',
      TypedRelation.Percentage,
      '%'
    ],
    [SymbolEntity.SetVolume]: [
      'Set volume of',
      TypedRelation.Sound,
      'to',
      TypedRelation.Percentage,
      '%'
    ],
    [SymbolEntity.Wait]: ['Wait', TypedRelation.Duration, 'secs'],
    [SymbolEntity.DeclareVariable]: ['Declare a variable named', TypedRelation.VariableName],
    [SymbolEntity.SetVariable]: ['Set', TypedRelation.Variable, 'to', TypedRelation.Number],
    [SymbolEntity.ChangeVariable]: ['Change', TypedRelation.Variable, 'by', TypedRelation.Number],
    [SymbolEntity.SendEvent]: ['Send an event named', TypedRelation.EventName],
    [SymbolEntity.IfThen]: [
      'If',
      TypedRelation.Condition,
      'then',
      TypedRelation.Action,
      '↩//End of If'
    ],
    [SymbolEntity.IfElse]: [
      'If',
      TypedRelation.Condition,
      'then',
      TypedRelation.Action,
      'else',
      TypedRelation.ElseAction,
      '↩//End of If'
    ],
    [SymbolEntity.Repeat]: ['Repeat', TypedRelation.Action, '↻//End of Repeat'],
    [SymbolEntity.RepeatFor]: [
      'Repeat',
      TypedRelation.Count,
      'times',
      TypedRelation.Action,
      '↻//End of Repeat'
    ],
    [SymbolEntity.RepeatUntil]: [
      'Repeat until',
      TypedRelation.Condition,
      TypedRelation.Action,
      '↻//End of Repeat'
    ],
    [SymbolEntity.IsGreater]: [TypedRelation.LeftNumber, '>', TypedRelation.RightNumber],
    [SymbolEntity.IsLess]: [TypedRelation.LeftNumber, '<', TypedRelation.RightNumber],
    [SymbolEntity.Equals]: [TypedRelation.LeftNumber, '=', TypedRelation.RightNumber],
    [SymbolEntity.And]: [TypedRelation.LeftCondition, 'and', TypedRelation.RightCondition],
    [SymbolEntity.Or]: [TypedRelation.LeftCondition, 'or', TypedRelation.RightCondition],
    [SymbolEntity.Not]: ['not', TypedRelation.Condition],
    [SymbolEntity.NumericLiteral]: [TypedRelation.NumericValue],
    [SymbolEntity.Plus]: [TypedRelation.LeftNumber, '+', TypedRelation.RightNumber],
    [SymbolEntity.Minus]: [TypedRelation.LeftNumber, '-', TypedRelation.RightNumber],
    [SymbolEntity.Times]: [TypedRelation.LeftNumber, '×', TypedRelation.RightNumber],
    [SymbolEntity.DividedBy]: [TypedRelation.LeftNumber, '÷', TypedRelation.RightNumber],
    [SymbolEntity.Remainder]: [
      'remainder of',
      TypedRelation.LeftNumber,
      '÷',
      TypedRelation.RightNumber
    ],
    [SymbolEntity.RandomNumber]: [
      'random number between',
      TypedRelation.LeftNumber,
      'to',
      TypedRelation.RightNumber
    ],
    [SymbolEntity.StringLiteral]: [TypedRelation.StringValue]
  },
  [Locale.JaJP]: {
    [SymbolEntity.ProgramStart]: [
      'プログラムが始まったら、',
      TypedRelation.Action,
      '↩//プログラム、ここまで'
    ],
    [SymbolEntity.KeyPressed]: [
      TypedRelation.Key,
      'が押されたら、',
      TypedRelation.Action,
      '↩//キーイベント、ここまで'
    ],
    [SymbolEntity.EventReceived]: [
      TypedRelation.Event,
      'を受け取ったら、',
      TypedRelation.Action,
      '↩//イベント、ここまで'
    ],
    [SymbolEntity.Say]: [TypedRelation.Content, 'と言う'],
    [SymbolEntity.SayUntil]: [TypedRelation.Content, 'と最後まで言う'],
    [SymbolEntity.Play]: [TypedRelation.Sound, 'を鳴らす'],
    [SymbolEntity.PlayUntil]: [TypedRelation.Sound, 'を最後まで鳴らす'],
    [SymbolEntity.StopSound]: ['すべての音を止める'],
    [SymbolEntity.MoveSound]: [
      TypedRelation.Sound,
      'を',
      TypedRelation.Coordinate,
      'の位置に動かす'
    ],
    [SymbolEntity.GlideSound]: [
      TypedRelation.Sound,
      'を',
      TypedRelation.Coordinate,
      'の位置に',
      TypedRelation.Duration,
      '秒かけて動かす'
    ],
    [SymbolEntity.SetPitch]: [
      TypedRelation.Sound,
      'の高さを',
      TypedRelation.Percentage,
      '% にする'
    ],
    [SymbolEntity.SetVolume]: [
      TypedRelation.Sound,
      'の大きさを',
      TypedRelation.Percentage,
      '% にする'
    ],
    [SymbolEntity.Wait]: [TypedRelation.Duration, '秒待つ'],
    [SymbolEntity.DeclareVariable]: [TypedRelation.VariableName, 'という名前の変数を作る'],
    [SymbolEntity.SetVariable]: [TypedRelation.Variable, 'を', TypedRelation.Number, 'にする'],
    [SymbolEntity.ChangeVariable]: [TypedRelation.Variable, 'に', TypedRelation.Number, 'を足す'],
    [SymbolEntity.SendEvent]: [TypedRelation.EventName, 'という名前のイベントを送る'],
    [SymbolEntity.IfThen]: [
      'もしも',
      TypedRelation.Condition,
      'なら、',
      TypedRelation.Action,
      '↩//もしも文、ここまで'
    ],
    [SymbolEntity.IfElse]: [
      'もしも',
      TypedRelation.Condition,
      'なら、',
      TypedRelation.Action,
      'そうでなければ',
      TypedRelation.ElseAction,
      '↩//もしも文、ここまで'
    ],
    [SymbolEntity.Repeat]: ['ずっと繰り返す、', TypedRelation.Action, '↻//繰り返し文、ここまで'],
    [SymbolEntity.RepeatFor]: [
      TypedRelation.Count,
      '回繰り返す、',
      TypedRelation.Action,
      '↻//繰り返し文、ここまで'
    ],
    [SymbolEntity.RepeatUntil]: [
      TypedRelation.Condition,
      'になるまで繰り返す、',
      TypedRelation.Action,
      '↻//繰り返し文、ここまで'
    ],
    [SymbolEntity.IsGreater]: [
      TypedRelation.LeftNumber,
      'が',
      TypedRelation.RightNumber,
      'より大きい'
    ],
    [SymbolEntity.IsLess]: [
      TypedRelation.LeftNumber,
      'が',
      TypedRelation.RightNumber,
      'より小さい'
    ],
    [SymbolEntity.Equals]: [TypedRelation.LeftNumber, 'が', TypedRelation.RightNumber, 'と同じ'],
    [SymbolEntity.And]: [TypedRelation.LeftCondition, 'かつ', TypedRelation.RightCondition],
    [SymbolEntity.Or]: [TypedRelation.LeftCondition, 'または', TypedRelation.RightCondition],
    [SymbolEntity.Not]: [TypedRelation.Condition, 'でない'],
    [SymbolEntity.NumericLiteral]: [TypedRelation.NumericValue],
    [SymbolEntity.Plus]: [TypedRelation.LeftNumber, '+', TypedRelation.RightNumber],
    [SymbolEntity.Minus]: [TypedRelation.LeftNumber, '-', TypedRelation.RightNumber],
    [SymbolEntity.Times]: [TypedRelation.LeftNumber, '×', TypedRelation.RightNumber],
    [SymbolEntity.DividedBy]: [TypedRelation.LeftNumber, '÷', TypedRelation.RightNumber],
    [SymbolEntity.Remainder]: [
      TypedRelation.LeftNumber,
      'を',
      TypedRelation.RightNumber,
      'で割った余り'
    ],
    [SymbolEntity.RandomNumber]: [
      TypedRelation.LeftNumber,
      'から',
      TypedRelation.RightNumber,
      'までのランダムな数字'
    ],
    [SymbolEntity.StringLiteral]: [TypedRelation.NumericValue]
  }
};

export const getSyntax = (locale: Locale) => (entity: SymbolEntity) =>
  syntaxDefByLocale[locale][entity];
