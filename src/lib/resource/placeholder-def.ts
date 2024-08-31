import { Locale } from '$lib/resource/config';
import { SymbolRelation as SymbolRelation } from '$lib/resource/graph/symbol-relation';

export type PlaceholderDef = ReadonlyMap<SymbolRelation, string>;

export const placeholderDefByLocale: ReadonlyMap<Locale, PlaceholderDef> = new Map([
	[
		Locale.EnUS,
		new Map([
			[SymbolRelation.Key, 'some entered key'],
			[SymbolRelation.Event, 'some event'],
			[SymbolRelation.Variable, 'some variable'],
			[SymbolRelation.Sound, 'some number'],
			[SymbolRelation.Number, 'some number'],
			[SymbolRelation.Coordinate, 'some number'],
			[SymbolRelation.Percentage, 'some number'],
			[SymbolRelation.Duration, 'some number'],
			[SymbolRelation.Count, 'some number'],
			[SymbolRelation.LeftNumber, 'some number'],
			[SymbolRelation.RightNumber, 'some number'],
			[SymbolRelation.Condition, 'some condition'],
			[SymbolRelation.LeftCondition, 'some condition'],
			[SymbolRelation.RightCondition, 'some condition'],
			[SymbolRelation.Action, 'do something'],
			[SymbolRelation.ElseAction, 'do something'],
			[SymbolRelation.Content, 'some text'],
			[SymbolRelation.EventName, 'some text'],
			[SymbolRelation.VariableName, 'some text'],
			[SymbolRelation.NumericValue, 'some entered number'],
			[SymbolRelation.StringValue, 'some entered text']
		])
	],
	[
		Locale.JaJP,
		new Map([
			[SymbolRelation.Key, '何か入力されたキー'],
			[SymbolRelation.Event, '何かのイベント'],
			[SymbolRelation.Variable, '何かの変数'],
			[SymbolRelation.Sound, '何かの音'],
			[SymbolRelation.Number, '何かの数'],
			[SymbolRelation.Coordinate, '何かの数'],
			[SymbolRelation.Percentage, '何かの数'],
			[SymbolRelation.Duration, '何かの数'],
			[SymbolRelation.Count, '何かの数'],
			[SymbolRelation.LeftNumber, '何かの数'],
			[SymbolRelation.RightNumber, '何かの数'],
			[SymbolRelation.Condition, '何かの条件'],
			[SymbolRelation.LeftCondition, '何かの条件'],
			[SymbolRelation.RightCondition, '何かの条件'],
			[SymbolRelation.Action, '何かする'],
			[SymbolRelation.ElseAction, '何かする'],
			[SymbolRelation.Content, '何かの文章'],
			[SymbolRelation.EventName, '何かの文章'],
			[SymbolRelation.VariableName, '何かの文章'],
			[SymbolRelation.NumericValue, '何か入力された数'],
			[SymbolRelation.StringValue, '何か入力された文章']
		])
	]
]);
