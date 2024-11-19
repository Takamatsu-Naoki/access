import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  addLink,
  addNodeWithRelation,
  findNodeById,
  findRelation,
  findSubjectNode,
  removeLink,
  replaceNode,
  resolveNodeByLink,
  type Graph
} from '$lib/code/utils/graph';
import { SymbolEntity } from '$lib/code/code-graph/symbol-entity';
import { SymbolRelation } from '$lib/code/code-graph/symbol-relation';
import { findElement, type CellPosition } from '$lib/code/utils/table';
import { moveDown, type ElementTable } from '$lib/code/label-table/label-table';
import { getData, resolveBlock } from '$lib/code/svg-generation/block';
import { getSyntax, isTypedRelation } from '$lib/code/syntax-definition/syntax';
import { config } from '$lib/code/config';

export const BlankEntity = 'blank' as const;
export type BlankEntity = typeof BlankEntity;

export type SectionEntity = {
  type: 'section';
  path: string;
  description: string;
};

export type NumericEntity = {
  type: 'number';
  value: number;
};

export type StringEntity = {
  type: 'string';
  value: string;
};

export type CodeEntity = SymbolEntity | BlankEntity | SectionEntity | NumericEntity | StringEntity;

export type CodeGraph = Graph<CodeEntity, SymbolRelation>;

export const isSymbolEntity = (entity: CodeEntity): entity is SymbolEntity =>
  typeof entity === 'string' && entity !== BlankEntity;

export const isBlankEntity = (entity: CodeEntity): entity is BlankEntity => entity === BlankEntity;

export const isSectionEntity = (entity: CodeEntity): entity is SectionEntity =>
  typeof entity !== 'string' && entity.type === 'section';

export const isNumericEntity = (entity: CodeEntity): entity is NumericEntity =>
  typeof entity !== 'string' && entity.type === 'number';

export const isStringEntity = (entity: CodeEntity): entity is StringEntity =>
  typeof entity !== 'string' && entity.type === 'string';

export const replaceBlock = (graph: CodeGraph) => (nodeId: number) => (entity: SymbolEntity) => {
  const graph1 = replaceNode(graph)(nodeId)(entity as CodeEntity);

  return attachPlaceholderBlock(graph1)(nodeId)(entity);
};

const insertBlock =
  (graph: CodeGraph) =>
    (subjectNodeId: number) =>
      (objectNodeId: number) =>
        (entity: SymbolEntity) => {
          const symbolRelation = findRelation(graph)(subjectNodeId)(objectNodeId);

          const graph1 = pipe(
            symbolRelation,
            O.map((relation) => addNodeWithRelation(graph)(subjectNodeId)(relation)(entity as CodeEntity))
          );

          const graph2 = pipe(
            graph1,
            O.map((a) =>
              addLink(a)({
                subjectNodeId: graph.nextNodeId,
                relation: SymbolRelation.NextAction as SymbolRelation,
                objectNodeId
              })
            )
          );

          const graph3 = pipe(
            graph2,
            O.map((a) => removeLink(a)(subjectNodeId)(objectNodeId))
          );

          return pipe(
            graph3,
            O.map((a) => attachPlaceholderBlock(a)(graph.nextNodeId)(entity)),
            O.getOrElse(() => graph)
          );
        };

const addBlockWithRelation =
  (graph: CodeGraph) =>
    (subjectNodeId: number) =>
      (relation: SymbolRelation) =>
        (entity: SymbolEntity) => {
          const graph1 = addNodeWithRelation(graph)(subjectNodeId)(relation)(entity as CodeEntity);

          return attachPlaceholderBlock(graph1)(graph.nextNodeId)(entity);
        };

const attachPlaceholderBlock = (graph: CodeGraph) => (nodeId: number) => (entity: SymbolEntity) =>
  pipe(
    getSyntax(config.locale)(entity),
    RA.filter(isTypedRelation),
    RA.map((a) => a.value),
    RA.reduce(graph, (acc, cur) =>
      pipe(addNodeWithRelation(acc)(nodeId)(cur)(BlankEntity as CodeEntity))
    )
  );

export const getNodeId = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(
    currentPosition,
    findElement(workspaceTable),
    O.map(resolveBlock),
    O.map(getData('nodeId')),
    O.map((a) => Number(a))
  );

const belowNodeExists = (graph: CodeGraph) => (nodeId: number) => (belowNodeId: number) =>
  pipe(
    findRelation(graph)(nodeId)(belowNodeId),
    O.exists((a) => a === SymbolRelation.Action || a === SymbolRelation.NextAction)
  );

const attachBlockBelow =
  (graph: CodeGraph) =>
    (workspaceTable: ElementTable) =>
      (currentPosition: CellPosition) =>
        (entity: SymbolEntity) => {
          const targetNodeId = getNodeId(workspaceTable)(currentPosition);

          const belowNodeId = pipe(
            currentPosition,
            moveDown(workspaceTable),
            findElement(workspaceTable),
            O.map(getData('nodeId')),
            O.map((a) => Number(a))
          );

          const belowNode = pipe(belowNodeId, O.flatMap(findNodeById(graph)));

          return pipe(
            targetNodeId,
            O.flatMap((targetId) =>
              pipe(
                belowNodeId,
                O.map((belowId) =>
                  pipe(belowNode, O.exists(isBlankEntity))
                    ? replaceBlock(graph)(targetId)(entity)
                    : belowNodeExists(graph)(targetId)(belowId)
                      ? insertBlock(graph)(targetId)(belowId)(entity)
                      : addBlockWithRelation(graph)(targetId)(SymbolRelation.NextAction)(entity)
                )
              )
            ),
            O.getOrElse(() => graph)
          );
        };

export const attachBlock =
  (graph: CodeGraph) =>
    (workspaceTable: ElementTable) =>
      (currentPosition: CellPosition) =>
        (entity: SymbolEntity) => {
          const targetNodeId = getNodeId(workspaceTable)(currentPosition);
          const targetNode = pipe(targetNodeId, O.flatMap(findNodeById(graph)));

          return pipe(
            targetNodeId,
            O.flatMap((nodeId) =>
              pipe(
                targetNode,
                O.map((node) =>
                  isBlankEntity(node)
                    ? replaceBlock(graph)(nodeId)(entity)
                    : currentPosition.rowNumber === workspaceTable.length - 1
                      ? addBlockWithRelation(graph)(nodeId)(SymbolRelation.NextAction)(entity)
                      : attachBlockBelow(graph)(workspaceTable)(currentPosition)(entity)
                )
              )
            ),
            O.getOrElse(() => graph)
          );
        };

/*
const belowNodeExists2 = (graph: CodeGraph) => (nodeId: number) => pipe(
  findRelation
)

export const removeBlock =
  (graph: CodeGraph) => (workspaceTable: ElementTable) => (currentPosition: CellPosition) => {
    const nodeId = getNodeId(workspaceTable)(currentPosition);

    const node = pipe(
      nodeId,
      O.flatMap(findNodeById(graph))
    );

    return pipe(
      node,
      O.map(a => isBlankEntity(a) ? graph :  ? )

    )
  };
*/

export const getPreviousNodes =
  (graph: CodeGraph) =>
    (nodeId: number): ReadonlyArray<number> =>
      pipe(
        findSubjectNode(graph)(nodeId),
        O.map((a) => pipe(RA.fromArray([nodeId]), RA.concat(getPreviousNodes(graph)(a)))),
        O.getOrElse(() => RA.fromArray([nodeId]))
      );

export const getNextActionNodes =
  (graph: CodeGraph) =>
    (nodeId: number): ReadonlyArray<number> =>
      pipe(
        resolveNodeByLink(graph)(nodeId)(SymbolRelation.NextAction as SymbolRelation),
        O.map((a) => pipe(RA.fromArray([nodeId]), RA.concat(getNextActionNodes(graph)(a)))),
        O.getOrElse(() => RA.fromArray([nodeId]))
      );
