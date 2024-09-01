import type { Graph } from '$lib/code/fp-ts-utils/graph';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';

type NumericEntity = {
  type: 'number';
  value: number;
};

type StringEntity = {
  type: 'string';
  value: string;
};

export type CodeEntity = SymbolEntity | NumericEntity | StringEntity;

export type CodeGraph = Graph<CodeEntity, SymbolRelation>;

export const isSymbolEntity = (entity: CodeEntity): entity is SymbolEntity =>
  typeof entity === 'string';

export const isNumericEntity = (entity: CodeEntity): entity is NumericEntity =>
  !isSymbolEntity(entity) && entity.type === 'number';

export const isStringEntity = (entity: CodeEntity): entity is StringEntity =>
  !isSymbolEntity(entity) && entity.type === 'string';
