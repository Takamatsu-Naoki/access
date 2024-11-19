import { Locale } from '$lib/code/config';
import { SymbolRelation } from '$lib/code/code-graph/symbol-relation';
import type { LabelText } from '$lib/code/syntax-definition/syntax';

type PlaceholderDef = {
  [key in SymbolRelation]: LabelText;
};

type PlaceholderDefByLocale = {
  [key in Locale]: PlaceholderDef;
};

const placeholderDefByLocale: PlaceholderDefByLocale = {
  [Locale.EnUS]: {
    [SymbolRelation.NextAction]: { type: 'text', value: '', screenReaderText: '' },
    [SymbolRelation.Key]: { type: 'text', value: '(some entered key)', screenReaderText: '' },
    [SymbolRelation.Event]: { type: 'text', value: '(some event)', screenReaderText: '' },
    [SymbolRelation.Variable]: { type: 'text', value: '(some variable)', screenReaderText: '' },
    [SymbolRelation.Sound]: { type: 'text', value: '(some sound)', screenReaderText: '' },
    [SymbolRelation.Number]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.Coordinate]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.Percentage]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.Duration]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.Count]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.LeftNumber]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.RightNumber]: { type: 'text', value: '(some number)', screenReaderText: '' },
    [SymbolRelation.Condition]: { type: 'text', value: '(some condition)', screenReaderText: '' },
    [SymbolRelation.LeftCondition]: {
      type: 'text',
      value: '(some condition)',
      screenReaderText: ''
    },
    [SymbolRelation.RightCondition]: {
      type: 'text',
      value: '(some condition)',
      screenReaderText: ''
    },
    [SymbolRelation.Action]: { type: 'text', value: '(do something)', screenReaderText: '' },
    [SymbolRelation.ElseAction]: { type: 'text', value: '(do something)', screenReaderText: '' },
    [SymbolRelation.Content]: { type: 'text', value: '(some text)', screenReaderText: '' },
    [SymbolRelation.EventName]: { type: 'text', value: '(some text)', screenReaderText: '' },
    [SymbolRelation.VariableName]: { type: 'text', value: '(some text)', screenReaderText: '' },
    [SymbolRelation.NumericValue]: {
      type: 'text',
      value: '(some entered number)',
      screenReaderText: ''
    },
    [SymbolRelation.StringValue]: {
      type: 'text',
      value: '(some entered text)',
      screenReaderText: ''
    }
  },
  [Locale.JaJP]: {
    [SymbolRelation.NextAction]: { type: 'text', value: '', screenReaderText: '' },
    [SymbolRelation.Key]: { type: 'text', value: '『何か入力されたキー』', screenReaderText: '' },
    [SymbolRelation.Event]: { type: 'text', value: '『何かのイベント』', screenReaderText: '' },
    [SymbolRelation.Variable]: { type: 'text', value: '『何かの変数』', screenReaderText: '' },
    [SymbolRelation.Sound]: { type: 'text', value: '『何かの音』', screenReaderText: '' },
    [SymbolRelation.Number]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.Coordinate]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.Percentage]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.Duration]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.Count]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.LeftNumber]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.RightNumber]: { type: 'text', value: '『何かの数』', screenReaderText: '' },
    [SymbolRelation.Condition]: { type: 'text', value: '『何かの条件』', screenReaderText: '' },
    [SymbolRelation.LeftCondition]: { type: 'text', value: '『何かの条件』', screenReaderText: '' },
    [SymbolRelation.RightCondition]: {
      type: 'text',
      value: '『何かの条件』',
      screenReaderText: ''
    },
    [SymbolRelation.Action]: { type: 'text', value: '『何かする』', screenReaderText: '' },
    [SymbolRelation.ElseAction]: { type: 'text', value: '『何かする』', screenReaderText: '' },
    [SymbolRelation.Content]: { type: 'text', value: '『何かの文章』', screenReaderText: '' },
    [SymbolRelation.EventName]: { type: 'text', value: '『何かの文章』', screenReaderText: '' },
    [SymbolRelation.VariableName]: { type: 'text', value: '『何かの文章』', screenReaderText: '' },
    [SymbolRelation.NumericValue]: {
      type: 'text',
      value: '『何か入力された数』',
      screenReaderText: ''
    },
    [SymbolRelation.StringValue]: {
      type: 'text',
      value: '『何か入力された文章』',
      screenReaderText: ''
    }
  }
};

export const getPlaceholder = (locale: Locale) => (relation: SymbolRelation) =>
  placeholderDefByLocale[locale][relation];
