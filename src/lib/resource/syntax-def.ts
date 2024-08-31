import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Locale } from '$lib/resource/config';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';

const PrefixedRelation = Object.fromEntries(
	Object.entries(SymbolRelation).map(([key, value]) => [key, `@${value}`])
) as { [K in keyof typeof SymbolRelation]: `@${(typeof SymbolRelation)[K]}` };

type PrefixedRelation = (typeof PrefixedRelation)[keyof typeof PrefixedRelation];

export const isPrefixedRelation = (a: string) => a.charAt(0) === '@';

export const removePrefix = (a: string) => a.slice(1);

export type Syntax = RNEA.ReadonlyNonEmptyArray<string | PrefixedRelation>;

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
			PrefixedRelation.Action,
			'↩//End of the program'
		],
		[SymbolEntity.KeyPressed]: [
			PrefixedRelation.Key,
			'is pressed',
			PrefixedRelation.Action,
			'↩//End of the key event'
		],
		[SymbolEntity.EventReceived]: [
			PrefixedRelation.Event,
			'is received',
			PrefixedRelation.Action,
			'↩//End of the event'
		],
		[SymbolEntity.Say]: ['Say', PrefixedRelation.Content],
		[SymbolEntity.SayUntil]: ['Say', PrefixedRelation.Content, 'until done'],
		[SymbolEntity.Play]: ['Play', PrefixedRelation.Sound],
		[SymbolEntity.PlayUntil]: ['Play', PrefixedRelation.Sound, 'until done'],
		[SymbolEntity.StopSound]: ['Stop all sounds'],
		[SymbolEntity.MoveSound]: [
			'Move',
			PrefixedRelation.Sound,
			'to x:',
			PrefixedRelation.Coordinate
		],
		[SymbolEntity.GlideSound]: [
			'Glide',
			PrefixedRelation.Sound,
			'to x:',
			PrefixedRelation.Coordinate,
			'in',
			PrefixedRelation.Duration,
			'seconds'
		],
		[SymbolEntity.SetPitch]: [
			'Set pitch of',
			PrefixedRelation.Sound,
			'to',
			PrefixedRelation.Percentage,
			'%'
		],
		[SymbolEntity.SetVolume]: [
			'Set volume of',
			PrefixedRelation.Sound,
			'to',
			PrefixedRelation.Percentage,
			'%'
		],
		[SymbolEntity.Wait]: ['Wait', PrefixedRelation.Duration, 'secs'],
		[SymbolEntity.DeclareVariable]: ['Declare a variable named', PrefixedRelation.VariableName],
		[SymbolEntity.SetVariable]: ['Set', PrefixedRelation.Variable, 'to', PrefixedRelation.Number],
		[SymbolEntity.ChangeVariable]: [
			'Change',
			PrefixedRelation.Variable,
			'by',
			PrefixedRelation.Number
		],
		[SymbolEntity.SendEvent]: ['Send an event named', PrefixedRelation.EventName],
		[SymbolEntity.IfThen]: [
			'If',
			PrefixedRelation.Condition,
			'then',
			PrefixedRelation.Action,
			'↩//End of If'
		],
		[SymbolEntity.IfElse]: [
			'If',
			PrefixedRelation.Condition,
			'then',
			PrefixedRelation.Action,
			'else',
			PrefixedRelation.ElseAction,
			'↩//End of If'
		],
		[SymbolEntity.Repeat]: ['Repeat', PrefixedRelation.Action, '↻//End of Repeat'],
		[SymbolEntity.RepeatFor]: [
			'Repeat',
			PrefixedRelation.Count,
			'times',
			PrefixedRelation.Action,
			'↻//End of Repeat'
		],
		[SymbolEntity.RepeatUntil]: [
			'Repeat until',
			PrefixedRelation.Condition,
			PrefixedRelation.Action,
			'↻//End of Repeat'
		],
		[SymbolEntity.IsGreater]: [PrefixedRelation.LeftNumber, '>', PrefixedRelation.RightNumber],
		[SymbolEntity.IsLess]: [PrefixedRelation.LeftNumber, '<', PrefixedRelation.RightNumber],
		[SymbolEntity.Equals]: [PrefixedRelation.LeftNumber, '=', PrefixedRelation.RightNumber],
		[SymbolEntity.And]: [PrefixedRelation.LeftCondition, 'and', PrefixedRelation.RightCondition],
		[SymbolEntity.Or]: [PrefixedRelation.LeftCondition, 'or', PrefixedRelation.RightCondition],
		[SymbolEntity.Not]: ['not', PrefixedRelation.Condition],
		[SymbolEntity.NumericLiteral]: [PrefixedRelation.NumericValue],
		[SymbolEntity.Plus]: [PrefixedRelation.LeftNumber, '+', PrefixedRelation.RightNumber],
		[SymbolEntity.Minus]: [PrefixedRelation.LeftNumber, '-', PrefixedRelation.RightNumber],
		[SymbolEntity.Times]: [PrefixedRelation.LeftNumber, '×', PrefixedRelation.RightNumber],
		[SymbolEntity.DividedBy]: [PrefixedRelation.LeftNumber, '÷', PrefixedRelation.RightNumber],
		[SymbolEntity.Remainder]: [
			'remainder of',
			PrefixedRelation.LeftNumber,
			'÷',
			PrefixedRelation.RightNumber
		],
		[SymbolEntity.RandomNumber]: [
			'random number between',
			PrefixedRelation.LeftNumber,
			'to',
			PrefixedRelation.RightNumber
		],
		[SymbolEntity.StringLiteral]: [PrefixedRelation.StringValue]
	},
	[Locale.JaJP]: {
		[SymbolEntity.ProgramStart]: [
			'プログラムが始まったら、',
			PrefixedRelation.Action,
			'↩//プログラム、ここまで'
		],
		[SymbolEntity.KeyPressed]: [
			PrefixedRelation.Key,
			'が押されたら、',
			PrefixedRelation.Action,
			'↩//キーイベント、ここまで'
		],
		[SymbolEntity.EventReceived]: [
			PrefixedRelation.Event,
			'を受け取ったら、',
			PrefixedRelation.Action,
			'↩//イベント、ここまで'
		],
		[SymbolEntity.Say]: [PrefixedRelation.Content, 'と言う'],
		[SymbolEntity.SayUntil]: [PrefixedRelation.Content, 'と最後まで言う'],
		[SymbolEntity.Play]: [PrefixedRelation.Sound, 'を鳴らす'],
		[SymbolEntity.PlayUntil]: [PrefixedRelation.Sound, 'を最後まで鳴らす'],
		[SymbolEntity.StopSound]: ['すべての音を止める'],
		[SymbolEntity.MoveSound]: [
			PrefixedRelation.Sound,
			'を',
			PrefixedRelation.Coordinate,
			'の位置に動かす'
		],
		[SymbolEntity.GlideSound]: [
			PrefixedRelation.Sound,
			'を',
			PrefixedRelation.Coordinate,
			'の位置に',
			PrefixedRelation.Duration,
			'秒かけて動かす'
		],
		[SymbolEntity.SetPitch]: [
			PrefixedRelation.Sound,
			'の高さを',
			PrefixedRelation.Percentage,
			'% にする'
		],
		[SymbolEntity.SetVolume]: [
			PrefixedRelation.Sound,
			'の大きさを',
			PrefixedRelation.Percentage,
			'% にする'
		],
		[SymbolEntity.Wait]: [PrefixedRelation.Duration, '秒待つ'],
		[SymbolEntity.DeclareVariable]: [PrefixedRelation.VariableName, 'という名前の変数を作る'],
		[SymbolEntity.SetVariable]: [
			PrefixedRelation.Variable,
			'を',
			PrefixedRelation.Number,
			'にする'
		],
		[SymbolEntity.ChangeVariable]: [
			PrefixedRelation.Variable,
			'に',
			PrefixedRelation.Number,
			'を足す'
		],
		[SymbolEntity.SendEvent]: [PrefixedRelation.EventName, 'という名前のイベントを送る'],
		[SymbolEntity.IfThen]: [
			'もしも',
			PrefixedRelation.Condition,
			'なら、',
			PrefixedRelation.Action,
			'↩//もしも文、ここまで'
		],
		[SymbolEntity.IfElse]: [
			'もしも',
			PrefixedRelation.Condition,
			'なら、',
			PrefixedRelation.Action,
			'そうでなければ',
			PrefixedRelation.ElseAction,
			'↩//もしも文、ここまで'
		],
		[SymbolEntity.Repeat]: ['ずっと繰り返す、', PrefixedRelation.Action, '↻//繰り返し文、ここまで'],
		[SymbolEntity.RepeatFor]: [
			PrefixedRelation.Count,
			'回繰り返す、',
			PrefixedRelation.Action,
			'↻//繰り返し文、ここまで'
		],
		[SymbolEntity.RepeatUntil]: [
			PrefixedRelation.Condition,
			'になるまで繰り返す、',
			PrefixedRelation.Action,
			'↻//繰り返し文、ここまで'
		],
		[SymbolEntity.IsGreater]: [
			PrefixedRelation.LeftNumber,
			'が',
			PrefixedRelation.RightNumber,
			'より大きい'
		],
		[SymbolEntity.IsLess]: [
			PrefixedRelation.LeftNumber,
			'が',
			PrefixedRelation.RightNumber,
			'より小さい'
		],
		[SymbolEntity.Equals]: [
			PrefixedRelation.LeftNumber,
			'が',
			PrefixedRelation.RightNumber,
			'と同じ'
		],
		[SymbolEntity.And]: [PrefixedRelation.LeftCondition, 'かつ', PrefixedRelation.RightCondition],
		[SymbolEntity.Or]: [PrefixedRelation.LeftCondition, 'または', PrefixedRelation.RightCondition],
		[SymbolEntity.Not]: [PrefixedRelation.Condition, 'でない'],
		[SymbolEntity.NumericLiteral]: [PrefixedRelation.NumericValue],
		[SymbolEntity.Plus]: [PrefixedRelation.LeftNumber, '+', PrefixedRelation.RightNumber],
		[SymbolEntity.Minus]: [PrefixedRelation.LeftNumber, '-', PrefixedRelation.RightNumber],
		[SymbolEntity.Times]: [PrefixedRelation.LeftNumber, '×', PrefixedRelation.RightNumber],
		[SymbolEntity.DividedBy]: [PrefixedRelation.LeftNumber, '÷', PrefixedRelation.RightNumber],
		[SymbolEntity.Remainder]: [
			PrefixedRelation.LeftNumber,
			'を',
			PrefixedRelation.RightNumber,
			'で割った余り'
		],
		[SymbolEntity.RandomNumber]: [
			PrefixedRelation.LeftNumber,
			'から',
			PrefixedRelation.RightNumber,
			'までのランダムな数字'
		],
		[SymbolEntity.StringLiteral]: [PrefixedRelation.NumericValue]
	}
};

export const getSyntax = (locale: Locale) => (entity: SymbolEntity) =>
	syntaxDefByLocale[locale][entity];
