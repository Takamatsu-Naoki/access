import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Locale } from '$lib/code/config';
import type { SectionEntity } from '$lib/code/code-graph/code-graph';
import { SymbolEntity } from '$lib/code/code-graph/symbol-entity';
import { SymbolRelation } from '$lib/code/code-graph/symbol-relation';

export type TypedRelation = { type: 'relation'; value: SymbolRelation };

export type LabelText = { type: 'text'; value: string; screenReaderText: string };

export const isTypedRelation = (a: TypedRelation | LabelText): a is TypedRelation =>
  a.type === 'relation';

export const isLabelText = (a: TypedRelation | LabelText): a is LabelText => a.type === 'text';

export const getOpenedSectionStartText = (section: SectionEntity): LabelText => ({
  type: 'text',
  value: `➖  ${section.path}. ${section.description}`,
  screenReaderText: `section. ${section.path} ${section.description}`
});

export const getOpenedSectionEndText = (): LabelText => ({
  type: 'text',
  value: `↩`,
  screenReaderText: `The end of the section`
});

export const getClosedSectionText = (section: SectionEntity): LabelText => ({
  type: 'text',
  value: `➕ ${section.path}. ${section.description}`,
  screenReaderText: `section. ${section.path} ${section.description}`
});

export const getValueText = (value: string): LabelText => ({
  type: 'text',
  value,
  screenReaderText: value
});

export type Syntax = RNEA.ReadonlyNonEmptyArray<TypedRelation | LabelText>;

type SyntaxDef = {
  [key in SymbolEntity]: Syntax;
};

type SyntaxDefByLocale = {
  [key in Locale]: SyntaxDef;
};

const syntaxDefByLocale: SyntaxDefByLocale = {
  [Locale.EnUS]: {
    [SymbolEntity.ProgramStart]: [
      { type: 'text', value: 'When the program starts', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of the program' }
    ],
    [SymbolEntity.KeyPressed]: [
      { type: 'relation', value: SymbolRelation.Key },
      { type: 'text', value: 'is pressed', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of the key event' }
    ],
    [SymbolEntity.EventReceived]: [
      { type: 'relation', value: SymbolRelation.Event },
      { type: 'text', value: 'is received', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of the event' }
    ],
    [SymbolEntity.Say]: [
      { type: 'text', value: 'Say', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Content }
    ],
    [SymbolEntity.SayUntil]: [
      { type: 'text', value: 'Say', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Content },
      { type: 'text', value: 'until done', screenReaderText: '' }
    ],
    [SymbolEntity.Play]: [
      { type: 'text', value: 'Play', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound }
    ],
    [SymbolEntity.PlayUntil]: [
      { type: 'text', value: 'Play', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'until done', screenReaderText: '' }
    ],
    [SymbolEntity.StopSound]: [{ type: 'text', value: 'Stop all sounds', screenReaderText: '' }],
    [SymbolEntity.MoveSound]: [
      { type: 'text', value: 'Move', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'to x:', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Coordinate }
    ],
    [SymbolEntity.GlideSound]: [
      { type: 'text', value: 'Glide', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'to x:', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Coordinate },
      { type: 'text', value: 'in', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Duration },
      { type: 'text', value: 'seconds', screenReaderText: '' }
    ],
    [SymbolEntity.SetPitch]: [
      { type: 'text', value: 'Set pitch of', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'to', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Percentage },
      { type: 'text', value: '%', screenReaderText: '' }
    ],
    [SymbolEntity.SetVolume]: [
      { type: 'text', value: 'Set volume of', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'to', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Percentage },
      { type: 'text', value: '%', screenReaderText: '' }
    ],
    [SymbolEntity.Wait]: [
      { type: 'text', value: 'Wait', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Duration },
      { type: 'text', value: 'secs', screenReaderText: '' }
    ],
    [SymbolEntity.DeclareVariable]: [
      { type: 'text', value: 'Declare a variable named', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.VariableName }
    ],
    [SymbolEntity.SetVariable]: [
      { type: 'text', value: 'Set', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Variable },
      { type: 'text', value: 'to', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Number }
    ],
    [SymbolEntity.ChangeVariable]: [
      { type: 'text', value: 'Change', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Variable },
      { type: 'text', value: 'by', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Number }
    ],
    [SymbolEntity.SendEvent]: [
      { type: 'text', value: 'Send an event named', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.EventName }
    ],
    [SymbolEntity.IfThen]: [
      { type: 'text', value: 'If', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'then', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of If' }
    ],
    [SymbolEntity.IfElse]: [
      { type: 'text', value: 'If', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'then', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: 'else', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.ElseAction },
      { type: 'text', value: '↩', screenReaderText: 'End of If' }
    ],
    [SymbolEntity.Repeat]: [
      { type: 'text', value: 'Repeat', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of Repeat' }
    ],
    [SymbolEntity.RepeatFor]: [
      { type: 'text', value: 'Repeat', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Count },
      { type: 'text', value: 'times', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of Repeat' }
    ],
    [SymbolEntity.RepeatUntil]: [
      { type: 'text', value: 'Repeat until', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'End of Repeat' }
    ],
    [SymbolEntity.IsGreater]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '>', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.IsLess]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '<', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Equals]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '=', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.And]: [
      { type: 'relation', value: SymbolRelation.LeftCondition },
      { type: 'text', value: 'and', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightCondition }
    ],
    [SymbolEntity.Or]: [
      { type: 'relation', value: SymbolRelation.LeftCondition },
      { type: 'text', value: 'or', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightCondition }
    ],
    [SymbolEntity.Not]: [
      { type: 'text', value: 'not', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition }
    ],
    [SymbolEntity.NumericLiteral]: [{ type: 'relation', value: SymbolRelation.NumericValue }],
    [SymbolEntity.Plus]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '+', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Minus]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '-', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Times]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '×', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.DividedBy]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '÷', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Remainder]: [
      { type: 'text', value: 'remainder of', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '÷', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.RandomNumber]: [
      { type: 'text', value: 'random number between', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'to', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.StringLiteral]: [{ type: 'relation', value: SymbolRelation.StringValue }]
  },
  [Locale.JaJP]: {
    [SymbolEntity.ProgramStart]: [
      { type: 'text', value: 'プログラムが始まったら、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'プログラム、ここまで' }
    ],
    [SymbolEntity.KeyPressed]: [
      { type: 'relation', value: SymbolRelation.Key },
      { type: 'text', value: 'が押されたら、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'キーイベント、ここまで' }
    ],
    [SymbolEntity.EventReceived]: [
      { type: 'relation', value: SymbolRelation.Event },
      { type: 'text', value: 'を受け取ったら、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'イベント、ここまで' }
    ],
    [SymbolEntity.Say]: [
      { type: 'relation', value: SymbolRelation.Content },
      { type: 'text', value: 'と言う', screenReaderText: '' }
    ],
    [SymbolEntity.SayUntil]: [
      { type: 'relation', value: SymbolRelation.Content },
      { type: 'text', value: 'と最後まで言う', screenReaderText: '' }
    ],
    [SymbolEntity.Play]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'を鳴らす', screenReaderText: '' }
    ],
    [SymbolEntity.PlayUntil]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'を最後まで鳴らす', screenReaderText: '' }
    ],
    [SymbolEntity.StopSound]: [{ type: 'text', value: 'すべての音を止める', screenReaderText: '' }],
    [SymbolEntity.MoveSound]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'を', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Coordinate },
      { type: 'text', value: 'の位置に動かす', screenReaderText: '' }
    ],
    [SymbolEntity.GlideSound]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'を', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Coordinate },
      { type: 'text', value: 'の位置に', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Duration },
      { type: 'text', value: '秒かけて動かす', screenReaderText: '' }
    ],
    [SymbolEntity.SetPitch]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'の高さを', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Percentage },
      { type: 'text', value: '% にする', screenReaderText: '' }
    ],
    [SymbolEntity.SetVolume]: [
      { type: 'relation', value: SymbolRelation.Sound },
      { type: 'text', value: 'の大きさを', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Percentage },
      { type: 'text', value: '% にする', screenReaderText: '' }
    ],
    [SymbolEntity.Wait]: [
      { type: 'relation', value: SymbolRelation.Duration },
      { type: 'text', value: '秒待つ', screenReaderText: '' }
    ],
    [SymbolEntity.DeclareVariable]: [
      { type: 'relation', value: SymbolRelation.VariableName },
      { type: 'text', value: 'という名前の変数を作る', screenReaderText: '' }
    ],
    [SymbolEntity.SetVariable]: [
      { type: 'relation', value: SymbolRelation.Variable },
      { type: 'text', value: 'を', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Number },
      { type: 'text', value: 'にする', screenReaderText: '' }
    ],
    [SymbolEntity.ChangeVariable]: [
      { type: 'relation', value: SymbolRelation.Variable },
      { type: 'text', value: 'に', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Number },
      { type: 'text', value: 'を足す', screenReaderText: '' }
    ],
    [SymbolEntity.SendEvent]: [
      { type: 'relation', value: SymbolRelation.EventName },
      { type: 'text', value: 'という名前のイベントを送る', screenReaderText: '' }
    ],
    [SymbolEntity.IfThen]: [
      { type: 'text', value: 'もしも', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'なら、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: 'もしも文、ここまで' }
    ],
    [SymbolEntity.IfElse]: [
      { type: 'text', value: 'もしも', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'なら、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: 'そうでなければ', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.ElseAction },
      { type: 'text', value: '↩', screenReaderText: 'もしも文、ここまで' }
    ],
    [SymbolEntity.Repeat]: [
      { type: 'text', value: 'ずっと繰り返す、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: '繰り返し文、ここまで' }
    ],
    [SymbolEntity.RepeatFor]: [
      { type: 'relation', value: SymbolRelation.Count },
      { type: 'text', value: '回繰り返す、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: '繰り返し文、ここまで' }
    ],
    [SymbolEntity.RepeatUntil]: [
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'になるまで繰り返す、', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.Action },
      { type: 'text', value: '↩', screenReaderText: '繰り返し文、ここまで' }
    ],
    [SymbolEntity.IsGreater]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'が', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber },
      { type: 'text', value: 'より大きい', screenReaderText: '' }
    ],
    [SymbolEntity.IsLess]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'が', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber },
      { type: 'text', value: 'より小さい', screenReaderText: '' }
    ],
    [SymbolEntity.Equals]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'が', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber },
      { type: 'text', value: 'と同じ', screenReaderText: '' }
    ],
    [SymbolEntity.And]: [
      { type: 'relation', value: SymbolRelation.LeftCondition },
      { type: 'text', value: 'かつ', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightCondition }
    ],
    [SymbolEntity.Or]: [
      { type: 'relation', value: SymbolRelation.LeftCondition },
      { type: 'text', value: 'または', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightCondition }
    ],
    [SymbolEntity.Not]: [
      { type: 'relation', value: SymbolRelation.Condition },
      { type: 'text', value: 'でない', screenReaderText: '' }
    ],
    [SymbolEntity.NumericLiteral]: [{ type: 'relation', value: SymbolRelation.NumericValue }],
    [SymbolEntity.Plus]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '+', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Minus]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '-', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Times]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '×', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.DividedBy]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: '÷', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber }
    ],
    [SymbolEntity.Remainder]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'を', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber },
      { type: 'text', value: 'で割った余り', screenReaderText: '' }
    ],
    [SymbolEntity.RandomNumber]: [
      { type: 'relation', value: SymbolRelation.LeftNumber },
      { type: 'text', value: 'から', screenReaderText: '' },
      { type: 'relation', value: SymbolRelation.RightNumber },
      { type: 'text', value: 'までのランダムな数字', screenReaderText: '' }
    ],
    [SymbolEntity.StringLiteral]: [{ type: 'relation', value: SymbolRelation.NumericValue }]
  }
};

export const getSyntax = (locale: Locale) => (entity: SymbolEntity) =>
  syntaxDefByLocale[locale][entity];
