import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from 'fp-ts/ReadonlyArray';
import { findNodeById, resolveNodeByLink, filterNodes } from '$lib/code/fp-ts-utils/graph';
import {
  type CodeGraph,
  isSymbolEntity,
  isNumericEntity,
  isStringEntity,
  isBlankEntity
} from '$lib/code/code-graph';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';
import {
  getCategoryByEntity,
  getCategoryByRelation,
  SymbolCategory
} from '$lib/resource/graph/symbol-category';
import { getSyntax, isLabelText, unpackRelation } from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';
import { drawLabel, drawPlaceholderBlock, getSize, drawBlock, setData } from './block';
import { getPlaceholder } from '$lib/resource/placeholder-def';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';

const isValueRelation = (relation: SymbolRelation) =>
  relation === SymbolRelation.NumericValue || relation === SymbolRelation.StringValue;

const generateValueLabel = (graph: CodeGraph) => (nodeId: number) => (relation: SymbolRelation) =>
  pipe(
    graph,
    resolveNodeByLink(nodeId)(relation),
    O.flatMap((a) => pipe(graph, findNodeById(a))),
    O.map((a) =>
      isBlankEntity(a)
        ? getPlaceholder(config.locale)(relation)
        : isNumericEntity(a)
          ? a.value.toString()
          : isStringEntity(a)
            ? a.value
            : ''
    ),
    O.getOrElse(() => ''),
    drawLabel
  );

const getNextActionNodes =
  (graph: CodeGraph) =>
    (nodeId: number): ReadonlyArray<number> =>
      pipe(
        graph,
        resolveNodeByLink(nodeId)(SymbolRelation.NextAction as SymbolRelation),
        O.map((a) => pipe(RA.fromArray([nodeId]), RA.concat(getNextActionNodes(graph)(a)))),
        O.getOrElse(() => RA.fromArray([nodeId]))
      );

const generateBlocksByRelation =
  (graph: CodeGraph) => (nodeId: number) => (relation: SymbolRelation) =>
    pipe(
      isValueRelation(relation)
        ? RA.of(generateValueLabel(graph)(nodeId)(relation))
        : pipe(
          graph,
          resolveNodeByLink(nodeId)(relation as SymbolRelation),
          O.map((childNodeId) =>
            pipe(graph, findNodeById(childNodeId), O.exists(isBlankEntity))
              ? pipe(
                getPlaceholder(config.locale)(relation),
                drawPlaceholderBlock(getCategoryByRelation(relation)),
                setData('nodeId')(childNodeId.toString()),
                RA.of
              )
              : pipe(getNextActionNodes(graph)(childNodeId), RA.map(generateBlock(graph)))
          ),
          O.getOrElse(() => RA.of(document.createElementNS('http://www.w3.org/2000/svg', 'g')))
        )
    );

const generateBlock =
  (graph: CodeGraph) =>
    (nodeId: number): SVGGElement => {
      const entity = pipe(graph, findNodeById(nodeId), O.filter(isSymbolEntity));

      if (O.isNone(entity)) {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
      }

      const childElements = pipe(
        entity.value,
        getSyntax(config.locale),
        RNEA.map((a) =>
          isLabelText(a)
            ? [drawLabel(a)]
            : pipe(generateBlocksByRelation(graph)(nodeId)(unpackRelation(a)))
        ),
        RA.flatten
      );

      const category = getCategoryByEntity(entity.value);

      return pipe(
        childElements,
        RNEA.fromReadonlyArray,
        O.map(drawBlock(category)),
        O.map(setData('nodeId')(nodeId.toString())),
        O.getOrElse(() => document.createElementNS('http://www.w3.org/2000/svg', 'g'))
      );
    };

export const generateWorkspace = (graph: CodeGraph) => {
  const triggerBlocks = pipe(
    graph,
    filterNodes((a) => isSymbolEntity(a) && a === SymbolEntity.ProgramStart),
    RA.head,
    O.map(getNextActionNodes(graph)),
    O.map(RA.map(generateBlock(graph))),
    O.getOrElse(() => [] as ReadonlyArray<SVGGElement>)
  );

  const workspace = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  workspace.classList.add('workspace');

  let offsetY = 20;

  triggerBlocks.forEach((block) => {
    block.setAttribute('transform', `translate(${20} ${offsetY})`);
    offsetY += getSize(block).height + 20;
    workspace.append(block);
  });

  return workspace;
};
