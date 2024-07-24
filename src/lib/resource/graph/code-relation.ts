export const CodeRelation = {
  NextAction: 'nextAction',
  ClosingBracket: 'closingBracket',
  Key: 'key',
  Event: 'event',
  Sound: 'sound',
  NumericVariable: 'numericVariable',
  Coordinate: 'coordinate',
  Seconds: 'seconds',
  Percent: 'percent',
  Times: 'times',
  LeftNumber: 'leftNumber',
  RightNumber: 'rightNumber',
  Condition: 'condition',
  LeftCondition: 'leftCondition',
  RightCondition: 'rightCondition',
  Do: 'do',
  ElseDo: 'elseDo',
  Content: 'content',
  Name: 'name',
} as const;

export type CodeRelation = (typeof CodeRelation)[keyof typeof CodeRelation];
