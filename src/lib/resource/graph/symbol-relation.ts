export const SymbolRelation = {
  NextAction: 'nextAction',
  Key: 'key',
  Event: 'event',
  Variable: 'variable',
  Sound: 'sound',
  Number: 'number',
  Coordinate: 'coordinate',
  Percentage: 'percentage',
  Duration: 'duration',
  Count: 'count',
  LeftNumber: 'leftNumber',
  RightNumber: 'rightNumber',
  Condition: 'condition',
  LeftCondition: 'leftCondition',
  RightCondition: 'rightCondition',
  Action: 'action',
  ElseAction: 'elseAction',
  Content: 'content',
  EventName: 'eventName',
  VariableName: 'variableName',
  NumericValue: 'numericValue',
  StringValue: 'stringValue'
} as const;

export type SymbolRelation = (typeof SymbolRelation)[keyof typeof SymbolRelation];
