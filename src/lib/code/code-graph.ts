import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as N from 'fp-ts/number';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import {
  addLink,
  addNodeWithRelation,
  findNodeById,
  findRelation,
  removeLink,
  replaceNode,
  type Graph
} from '$lib/code/fp-ts-utils/graph';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';
import { findElement, type CellPosition } from './fp-ts-utils/table';
import { moveDown, type ElementTable } from './label-table';
import { getData, resolveBlock } from './svg/block';
import { getSyntax, isTypedRelation, unpackRelation } from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';

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

export const replaceBlock = (nodeId: number) => (entity: SymbolEntity) => (graph: CodeGraph) =>
  pipe(graph, replaceNode(nodeId)(entity as CodeEntity), attachPlaceholderBlock(nodeId)(entity));

const insertBlock =
  (subjectNodeId: number) =>
    (objectNodeId: number) =>
      (entity: SymbolEntity) =>
        (graph: CodeGraph) =>
          pipe(
            graph,
            findRelation(subjectNodeId)(objectNodeId),
            O.map((relation) =>
              pipe(
                graph,
                addNodeWithRelation(subjectNodeId)(relation)(entity as CodeEntity),
                addLink({
                  subjectNodeId: graph.nextNodeId,
                  relation: SymbolRelation.NextAction as SymbolRelation,
                  objectNodeId
                }),
                removeLink(subjectNodeId)(objectNodeId),
                attachPlaceholderBlock(graph.nextNodeId)(entity)
              )
            ),
            O.getOrElse(() => graph)
          );

const addBlockWithRelation =
  (subjectNodeId: number) =>
    (relation: SymbolRelation) =>
      (entity: SymbolEntity) =>
        (graph: CodeGraph) =>
          pipe(
            graph,
            addNodeWithRelation(subjectNodeId)(relation)(entity as CodeEntity),
            attachPlaceholderBlock(graph.nextNodeId)(entity)
          );

const attachPlaceholderBlock = (nodeId: number) => (entity: SymbolEntity) => (graph: CodeGraph) =>
  pipe(
    entity,
    getSyntax(config.locale),
    RA.filter(isTypedRelation),
    RA.map(unpackRelation),
    RA.reduce(graph, (acc, cur) =>
      pipe(acc, addNodeWithRelation(nodeId)(cur)(BlankEntity as CodeEntity))
    )
  );

const getNodeId = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(
    currentPosition,
    findElement(workspaceTable),
    O.map(resolveBlock),
    O.map(getData('nodeId')),
    O.map((a) => Number(a))
  );

const getBelowNodeId = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(
    currentPosition,
    moveDown(workspaceTable),
    findElement(workspaceTable),
    O.map(getData('nodeId')),
    O.map((a) => Number(a))
  );

const belowNodeExists = (nodeId: number) => (belowNodeId: number) => (graph: CodeGraph) =>
  pipe(
    graph,
    findRelation(nodeId)(belowNodeId),
    O.exists((a) => a === SymbolRelation.Action || a === SymbolRelation.NextAction)
  );

const attachBlockBelow =
  (entity: SymbolEntity) => (nodeId: number) => (belowNodeId: number) => (graph: CodeGraph) =>
    pipe(
      graph,
      findNodeById(belowNodeId),
      O.map((a) =>
        isBlankEntity(a)
          ? pipe(graph, replaceBlock(belowNodeId)(entity))
          : pipe(graph, belowNodeExists(nodeId)(belowNodeId))
            ? pipe(graph, insertBlock(nodeId)(belowNodeId)(entity))
            : pipe(graph, addBlockWithRelation(nodeId)(SymbolRelation.NextAction)(entity))
      ),
      O.getOrElse(() => graph)
    );

export const attachBlock =
  (workspaceTable: ElementTable) =>
    (currentPosition: CellPosition) =>
      (entity: SymbolEntity) =>
        (graph: CodeGraph) =>
          pipe(
            getNodeId(workspaceTable)(currentPosition),
            O.flatMap((nodeId) =>
              pipe(
                graph,
                findNodeById(nodeId),
                O.map((a) =>
                  isBlankEntity(a)
                    ? pipe(graph, replaceBlock(nodeId)(entity))
                    : currentPosition.rowNumber === workspaceTable.length - 1
                      ? pipe(graph, addBlockWithRelation(nodeId)(SymbolRelation.NextAction)(entity))
                      : pipe(
                        getBelowNodeId(workspaceTable)(currentPosition),
                        O.map((a) => pipe(graph, attachBlockBelow(entity)(nodeId)(a))),
                        O.getOrElse(() => graph)
                      )
                )
              )
            ),
            O.getOrElse(() => graph)
          );
