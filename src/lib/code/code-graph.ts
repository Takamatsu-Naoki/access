import type { Graph } from '$lib/code/fp-ts-utils/graph';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';

export const BlankEntity = 'blank' as const;
export type BlankEntity = typeof BlankEntity;

type NumericEntity = {
  type: 'number';
  value: number;
};

type StringEntity = {
  type: 'string';
  value: string;
};

export type CodeEntity = SymbolEntity | BlankEntity | NumericEntity | StringEntity;

export type CodeGraph = Graph<CodeEntity, SymbolRelation>;

export const isSymbolEntity = (entity: CodeEntity): entity is SymbolEntity =>
  typeof entity === 'string' && entity !== BlankEntity;

export const isBlankEntity = (entity: CodeEntity): entity is BlankEntity => entity === BlankEntity;

export const isNumericEntity = (entity: CodeEntity): entity is NumericEntity =>
  typeof entity !== 'string' && entity.type === 'number';

export const isStringEntity = (entity: CodeEntity): entity is StringEntity =>
  typeof entity !== 'string' && entity.type === 'string';
