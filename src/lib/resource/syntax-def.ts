import { Locale } from '$lib/resource/config';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';

export type SyntaxDef = ReadonlyMap<SymbolEntity, ReadonlyArray<string | SymbolRelation>>;

export const syntaxDefByLocale: ReadonlyMap<Locale, SyntaxDef> = new Map([
  [
    Locale.EnUS,
    new Map([
      [
        SymbolEntity.ProgramStart,
        ['When the program starts', SymbolRelation.Actions, '↩//End of the program']
      ],
      [
        SymbolEntity.KeyPressed,
        [
          'When the',
          SymbolRelation.Key,
          'is pressed',
          SymbolRelation.Actions,
          '↩//End of the key event'
        ]
      ],
      [
        SymbolEntity.EventReceived,
        [
          'When the',
          SymbolRelation.Event,
          'is received',
          SymbolRelation.Actions,
          '↩//End of the event'
        ]
      ],
      [SymbolEntity.Say, ['Say', SymbolRelation.Content]],
      [SymbolEntity.SayUntil, ['Say', SymbolRelation.Content, 'until done']],
      [SymbolEntity.Play, ['Play', SymbolRelation.Sound]],
      [SymbolEntity.PlayUntil, ['Play', SymbolRelation.Sound, 'until done']],
      [SymbolEntity.StopSound, ['Stop all sounds']],
      [SymbolEntity.MoveSound, ['Move', SymbolRelation.Sound, 'to x:', SymbolRelation.Coordinate]],
      [
        SymbolEntity.GlideSound,
        [
          'Glide',
          SymbolRelation.Sound,
          'to x:',
          SymbolRelation.Coordinate,
          'in',
          SymbolRelation.Time,
          'secs'
        ]
      ],
      [SymbolEntity.SetPitch, ['Set pitch of', SymbolRelation.Sound, 'to', SymbolRelation.Degree, '%']],
      [
        SymbolEntity.SetVolume,
        ['Set volume of', SymbolRelation.Sound, 'to', SymbolRelation.Degree, '%']
      ],
      [SymbolEntity.Wait, ['Wait', SymbolRelation.Time, 'secs']],
      [SymbolEntity.DeclareVariable, ['Declare a variable named', SymbolRelation.VariableName]],
      [SymbolEntity.SetVariable, ['Set', SymbolRelation.Variable, 'to', SymbolRelation.Number]],
      [SymbolEntity.ChangeVariable, ['Change', SymbolRelation.Variable, 'by', SymbolRelation.Number]],
      [SymbolEntity.SendEvent, ['Send an event named', SymbolRelation.EventName]],
      [
        SymbolEntity.IfThen,
        ['If', SymbolRelation.Condition, 'then', SymbolRelation.Actions, '↩//End of If']
      ],
      [
        SymbolEntity.IfElse,
        [
          'If',
          SymbolRelation.Condition,
          'then',
          SymbolRelation.Actions,
          'else',
          SymbolRelation.ElseActions,
          '↩//End of If'
        ]
      ],
      [SymbolEntity.Repeat, ['Repeat', SymbolRelation.Actions, '↻//End of Repeat']],
      [
        SymbolEntity.RepeatFor,
        ['Repeat', SymbolRelation.Count, 'times', SymbolRelation.Actions, '↻//End of Repeat']
      ],
      [
        SymbolEntity.RepeatUntil,
        ['Repeat until', SymbolRelation.Condition, SymbolRelation.Actions, '↻//End of Repeat']
      ],
      [SymbolEntity.IsGreater, [SymbolRelation.LeftNumber, '>', SymbolRelation.RightNumber]],
      [SymbolEntity.IsLess, [SymbolRelation.LeftNumber, '<', SymbolRelation.RightNumber]],
      [SymbolEntity.Equals, [SymbolRelation.LeftNumber, '=', SymbolRelation.RightNumber]],
      [SymbolEntity.And, [SymbolRelation.LeftCondition, 'and', SymbolRelation.RightCondition]],
      [SymbolEntity.Or, [SymbolRelation.LeftCondition, 'or', SymbolRelation.RightCondition]],
      [SymbolEntity.Not, ['not', SymbolRelation.Condition]],
      [SymbolEntity.Plus, [SymbolRelation.LeftNumber, '+', SymbolRelation.RightNumber]],
      [SymbolEntity.Minus, [SymbolRelation.LeftNumber, '-', SymbolRelation.RightNumber]],
      [SymbolEntity.Times, [SymbolRelation.LeftNumber, '×', SymbolRelation.RightNumber]],
      [SymbolEntity.DividedBy, [SymbolRelation.LeftNumber, '÷', SymbolRelation.RightNumber]],
      [
        SymbolEntity.Remainder,
        ['remainder of', SymbolRelation.LeftNumber, '÷', SymbolRelation.RightNumber]
      ],
      [
        SymbolEntity.RandomNumber,
        ['random number between', SymbolRelation.LeftNumber, 'to', SymbolRelation.RightNumber]
      ]
    ])
  ],
  [
    Locale.JaJP,
    new Map([
      [
        SymbolEntity.ProgramStart,
        ['プログラムが始まったら、', SymbolRelation.Actions, '↩//プログラム、ここまで']
      ],
      [
        SymbolEntity.KeyPressed,
        [SymbolRelation.Key, 'が押されたら、', SymbolRelation.Actions, '↩//キーイベント、ここまで']
      ],
      [
        SymbolEntity.EventReceived,
        [SymbolRelation.Event, 'を受け取ったら、', SymbolRelation.Actions, '↩//イベント、ここまで']
      ],
      [SymbolEntity.Say, [SymbolRelation.Content, 'と言う']],
      [SymbolEntity.SayUntil, [SymbolRelation.Content, 'と最後まで言う']],
      [SymbolEntity.Play, [SymbolRelation.Sound, 'を鳴らす']],
      [SymbolEntity.PlayUntil, [SymbolRelation.Sound, 'を最後まで鳴らす']],
      [SymbolEntity.StopSound, ['すべての音を止める']],
      [
        SymbolEntity.MoveSound,
        [SymbolRelation.Sound, 'を', SymbolRelation.Coordinate, 'の位置に動かす']
      ],
      [
        SymbolEntity.GlideSound,
        [
          SymbolRelation.Sound,
          'を',
          SymbolRelation.Coordinate,
          'の位置に',
          SymbolRelation.Time,
          '秒かけて動かす'
        ]
      ],
      [SymbolEntity.SetPitch, [SymbolRelation.Sound, 'の高さを', SymbolRelation.Degree, '% にする']],
      [SymbolEntity.SetVolume, [SymbolRelation.Sound, 'の大きさを', SymbolRelation.Degree, '% にする']],
      [SymbolEntity.Wait, [SymbolRelation.Time, '秒待つ']],
      [SymbolEntity.DeclareVariable, [SymbolRelation.VariableName, 'という名前の変数を作る']],
      [SymbolEntity.SetVariable, [SymbolRelation.Variable, 'を', SymbolRelation.Number, 'にする']],
      [SymbolEntity.ChangeVariable, [SymbolRelation.Variable, 'に', SymbolRelation.Number, 'を足す']],
      [SymbolEntity.SendEvent, [SymbolRelation.EventName, 'という名前のイベントを送る']],
      [
        SymbolEntity.IfThen,
        ['もしも', SymbolRelation.Condition, 'なら、', SymbolRelation.Actions, '↩//もしも文、ここまで']
      ],
      [
        SymbolEntity.IfElse,
        [
          'もしも',
          SymbolRelation.Condition,
          'なら、',
          SymbolRelation.Actions,
          'そうでなければ',
          SymbolRelation.ElseActions,
          '↩//もしも文、ここまで'
        ]
      ],
      [SymbolEntity.Repeat, ['ずっと繰り返す、', SymbolRelation.Actions, '↻//繰り返し文、ここまで']],
      [
        SymbolEntity.RepeatFor,
        [SymbolRelation.Count, '回繰り返す、', SymbolRelation.Actions, '↻//繰り返し文、ここまで']
      ],
      [
        SymbolEntity.RepeatUntil,
        [
          SymbolRelation.Condition,
          'になるまで繰り返す、',
          SymbolRelation.Actions,
          '↻//繰り返し文、ここまで'
        ]
      ],
      [
        SymbolEntity.IsGreater,
        [SymbolRelation.LeftNumber, 'が', SymbolRelation.RightNumber, 'より大きい']
      ],
      [
        SymbolEntity.IsLess,
        [SymbolRelation.LeftNumber, 'が', SymbolRelation.RightNumber, 'より小さい']
      ],
      [SymbolEntity.Equals, [SymbolRelation.LeftNumber, 'が', SymbolRelation.RightNumber, 'と同じ']],
      [SymbolEntity.And, [SymbolRelation.LeftCondition, 'かつ', SymbolRelation.RightCondition]],
      [SymbolEntity.Or, [SymbolRelation.LeftCondition, 'または', SymbolRelation.RightCondition]],
      [SymbolEntity.Not, [SymbolRelation.Condition, 'でない']],
      [SymbolEntity.Plus, [SymbolRelation.LeftNumber, '+', SymbolRelation.RightNumber]],
      [SymbolEntity.Minus, [SymbolRelation.LeftNumber, '-', SymbolRelation.RightNumber]],
      [SymbolEntity.Times, [SymbolRelation.LeftNumber, '×', SymbolRelation.RightNumber]],
      [SymbolEntity.DividedBy, [SymbolRelation.LeftNumber, '÷', SymbolRelation.RightNumber]],
      [
        SymbolEntity.Remainder,
        [SymbolRelation.LeftNumber, 'を', SymbolRelation.RightNumber, 'で割った余り']
      ],
      [
        SymbolEntity.RandomNumber,
        [SymbolRelation.LeftNumber, 'から', SymbolRelation.RightNumber, 'までのランダムな数字']
      ]
    ])
  ]
]);
