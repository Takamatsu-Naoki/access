import { Locale } from '$lib/resource/config';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { CodeRelation } from '$lib/resource/graph/code-relation';

export type SyntaxDef = ReadonlyMap<SymbolEntity, ReadonlyArray<string | CodeRelation>>;

export const syntaxDefByLocale: ReadonlyMap<Locale, SyntaxDef> = new Map([
  [
    Locale.EnUS,
    new Map([
      [
        SymbolEntity.ProgramStart,
        ['When the program starts', CodeRelation.Actions, '↩//End of the program']
      ],
      [
        SymbolEntity.KeyPressed,
        [
          'When the',
          CodeRelation.Key,
          'is pressed',
          CodeRelation.Actions,
          '↩//End of the key event'
        ]
      ],
      [
        SymbolEntity.EventReceived,
        [
          'When the',
          CodeRelation.Event,
          'is received',
          CodeRelation.Actions,
          '↩//End of the event'
        ]
      ],
      [SymbolEntity.Say, ['Say', CodeRelation.Content]],
      [SymbolEntity.SayUntil, ['Say', CodeRelation.Content, 'until done']],
      [SymbolEntity.Play, ['Play', CodeRelation.Sound]],
      [SymbolEntity.PlayUntil, ['Play', CodeRelation.Sound, 'until done']],
      [SymbolEntity.StopSound, ['Stop all sounds']],
      [SymbolEntity.MoveSound, ['Move', CodeRelation.Sound, 'to x:', CodeRelation.Coordinate]],
      [
        SymbolEntity.GlideSound,
        [
          'Glide',
          CodeRelation.Sound,
          'to x:',
          CodeRelation.Coordinate,
          'in',
          CodeRelation.Time,
          'secs'
        ]
      ],
      [SymbolEntity.SetPitch, ['Set pitch of', CodeRelation.Sound, 'to', CodeRelation.Degree, '%']],
      [
        SymbolEntity.SetVolume,
        ['Set volume of', CodeRelation.Sound, 'to', CodeRelation.Degree, '%']
      ],
      [SymbolEntity.Wait, ['Wait', CodeRelation.Time, 'secs']],
      [SymbolEntity.DeclareVariable, ['Declare a variable named', CodeRelation.Name]],
      [SymbolEntity.SetVariable, ['Set', CodeRelation.variable, 'to', CodeRelation.Number]],
      [SymbolEntity.ChangeVariable, ['Change', CodeRelation.variable, 'by', CodeRelation.Number]],
      [SymbolEntity.SendEvent, ['Send an event named', CodeRelation.Name]],
      [
        SymbolEntity.IfThen,
        ['If', CodeRelation.Condition, 'then', CodeRelation.Actions, '↩//End of If']
      ],
      [
        SymbolEntity.IfElse,
        [
          'If',
          CodeRelation.Condition,
          'then',
          CodeRelation.Actions,
          'else',
          CodeRelation.ElseActions,
          '↩//End of If'
        ]
      ],
      [SymbolEntity.Repeat, ['Repeat', CodeRelation.Actions, '↻//End of Repeat']],
      [
        SymbolEntity.RepeatFor,
        ['Repeat', CodeRelation.Count, 'times', CodeRelation.Actions, '↻//End of Repeat']
      ],
      [
        SymbolEntity.RepeatUntil,
        ['Repeat until', CodeRelation.Condition, CodeRelation.Actions, '↻//End of Repeat']
      ],
      [SymbolEntity.IsGreater, [CodeRelation.LeftNumber, '>', CodeRelation.RightNumber]],
      [SymbolEntity.IsLess, [CodeRelation.LeftNumber, '<', CodeRelation.RightNumber]],
      [SymbolEntity.Equals, [CodeRelation.LeftNumber, '=', CodeRelation.RightNumber]],
      [SymbolEntity.And, [CodeRelation.LeftCondition, 'and', CodeRelation.RightCondition]],
      [SymbolEntity.Or, [CodeRelation.LeftCondition, 'or', CodeRelation.RightCondition]],
      [SymbolEntity.Not, ['not', CodeRelation.Condition]],
      [SymbolEntity.Variable, [CodeRelation.variable]],
      [SymbolEntity.Plus, [CodeRelation.LeftNumber, '+', CodeRelation.RightNumber]],
      [SymbolEntity.Minus, [CodeRelation.LeftNumber, '-', CodeRelation.RightNumber]],
      [SymbolEntity.Times, [CodeRelation.LeftNumber, '×', CodeRelation.RightNumber]],
      [SymbolEntity.DividedBy, [CodeRelation.LeftNumber, '÷', CodeRelation.RightNumber]],
      [
        SymbolEntity.Remainder,
        ['remainder of', CodeRelation.LeftNumber, '÷', CodeRelation.RightNumber]
      ],
      [
        SymbolEntity.RandomNumber,
        ['random number between', CodeRelation.LeftNumber, 'to', CodeRelation.RightNumber]
      ]
    ])
  ],
  [
    Locale.JaJP,
    new Map([
      [
        SymbolEntity.ProgramStart,
        ['プログラムが始まったら、', CodeRelation.Actions, '↩//プログラム、ここまで']
      ],
      [
        SymbolEntity.KeyPressed,
        [CodeRelation.Key, 'が押されたら、', CodeRelation.Actions, '↩//キーイベント、ここまで']
      ],
      [
        SymbolEntity.EventReceived,
        [CodeRelation.Event, 'を受け取ったら、', CodeRelation.Actions, '↩//イベント、ここまで']
      ],
      [SymbolEntity.Say, [CodeRelation.Content, 'と言う']],
      [SymbolEntity.SayUntil, [CodeRelation.Content, 'と最後まで言う']],
      [SymbolEntity.Play, [CodeRelation.Sound, 'を鳴らす']],
      [SymbolEntity.PlayUntil, [CodeRelation.Sound, 'を最後まで鳴らす']],
      [SymbolEntity.StopSound, ['すべての音を止める']],
      [
        SymbolEntity.MoveSound,
        [CodeRelation.Sound, 'を', CodeRelation.Coordinate, 'の位置に動かす']
      ],
      [
        SymbolEntity.GlideSound,
        [
          CodeRelation.Sound,
          'を',
          CodeRelation.Coordinate,
          'の位置に',
          CodeRelation.Time,
          '秒かけて動かす'
        ]
      ],
      [SymbolEntity.SetPitch, [CodeRelation.Sound, 'の高さを', CodeRelation.Degree, '% にする']],
      [SymbolEntity.SetVolume, [CodeRelation.Sound, 'の大きさを', CodeRelation.Degree, '% にする']],
      [SymbolEntity.Wait, [CodeRelation.Time, '秒待つ']],
      [SymbolEntity.DeclareVariable, [CodeRelation.Name, 'という名前の変数を作る']],
      [SymbolEntity.SetVariable, [CodeRelation.variable, 'を', CodeRelation.Number, 'にする']],
      [SymbolEntity.ChangeVariable, [CodeRelation.variable, 'に', CodeRelation.Number, 'を足す']],
      [SymbolEntity.SendEvent, [CodeRelation.Name, 'という名前のイベントを送る']],
      [
        SymbolEntity.IfThen,
        ['もしも', CodeRelation.Condition, 'なら、', CodeRelation.Actions, '↩//もしも文、ここまで']
      ],
      [
        SymbolEntity.IfElse,
        [
          'もしも',
          CodeRelation.Condition,
          'なら、',
          CodeRelation.Actions,
          'そうでなければ',
          CodeRelation.ElseActions,
          '↩//もしも文、ここまで'
        ]
      ],
      [SymbolEntity.Repeat, ['ずっと繰り返す、', CodeRelation.Actions, '↻//繰り返し文、ここまで']],
      [
        SymbolEntity.RepeatFor,
        [CodeRelation.Count, '回繰り返す、', CodeRelation.Actions, '↻//繰り返し文、ここまで']
      ],
      [
        SymbolEntity.RepeatUntil,
        [
          CodeRelation.Condition,
          'になるまで繰り返す、',
          CodeRelation.Actions,
          '↻//繰り返し文、ここまで'
        ]
      ],
      [
        SymbolEntity.IsGreater,
        [CodeRelation.LeftNumber, 'が', CodeRelation.RightNumber, 'より大きい']
      ],
      [
        SymbolEntity.IsLess,
        [CodeRelation.LeftNumber, 'が', CodeRelation.RightNumber, 'より小さい']
      ],
      [SymbolEntity.Equals, [CodeRelation.LeftNumber, 'が', CodeRelation.RightNumber, 'と同じ']],
      [SymbolEntity.And, [CodeRelation.LeftCondition, 'かつ', CodeRelation.RightCondition]],
      [SymbolEntity.Or, [CodeRelation.LeftCondition, 'または', CodeRelation.RightCondition]],
      [SymbolEntity.Not, [CodeRelation.Condition, 'でない']],
      [SymbolEntity.Variable, [CodeRelation.variable]],
      [SymbolEntity.Plus, [CodeRelation.LeftNumber, '+', CodeRelation.RightNumber]],
      [SymbolEntity.Minus, [CodeRelation.LeftNumber, '-', CodeRelation.RightNumber]],
      [SymbolEntity.Times, [CodeRelation.LeftNumber, '×', CodeRelation.RightNumber]],
      [SymbolEntity.DividedBy, [CodeRelation.LeftNumber, '÷', CodeRelation.RightNumber]],
      [
        SymbolEntity.Remainder,
        [CodeRelation.LeftNumber, 'を', CodeRelation.RightNumber, 'で割った余り']
      ],
      [
        SymbolEntity.RandomNumber,
        [CodeRelation.LeftNumber, 'から', CodeRelation.RightNumber, 'までのランダムな数字']
      ]
    ])
  ]
]);
