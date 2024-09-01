import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from 'fp-ts/ReadonlyArray';
import { findNodeById, resolveNodeByLink, filterNodes } from '$lib/code/fp-ts-utils/graph';
import {
  type CodeGraph,
  isSymbolEntity,
  isNumericEntity,
  isStringEntity
} from '$lib/code/code-graph';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';
import {
  getCategoryByEntity,
  getCategoryByRelation,
  SymbolCategory
} from '$lib/resource/graph/symbol-category';
import { getSyntax, isLabelText, unpackRelation } from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';
import {
  drawLabel,
  drawPlaceholderBlock,
  getSize,
  drawBlock
} from './block';
import { getPlaceholder } from '$lib/resource/placeholder-def';

const isValueRelation = (relation: SymbolRelation) =>
  relation === SymbolRelation.NumericValue || relation === SymbolRelation.StringValue;

const generateValueLabel = (graph: CodeGraph) => (nodeId: number) => (relation: SymbolRelation) =>
  pipe(
    resolveNodeByLink(graph)(nodeId)(relation),
    O.flatMap(findNodeById(graph)),
    O.map((a) => (isNumericEntity(a) ? a.value.toString() : isStringEntity(a) ? a.value : '')),
    O.getOrElse(() => getPlaceholder(config.locale)(relation)),
    drawLabel
  );

const generateBlockByRelation =
  (graph: CodeGraph) => (nodeId: number) => (relation: SymbolRelation) =>
    pipe(
      isValueRelation(relation)
        ? generateValueLabel(graph)(nodeId)(relation)
        : pipe(
          resolveNodeByLink(graph)(nodeId)(relation),
          O.map(generateBlock(graph)),
          O.getOrElse(() =>
            drawPlaceholderBlock(getCategoryByRelation(relation))(
              getPlaceholder(config.locale)(relation)
            )
          )
        )
    );

const generateBlock =
  (graph: CodeGraph) =>
    (nodeId: number): SVGGElement => {
      const entity = pipe(findNodeById(graph)(nodeId), O.filter(isSymbolEntity));

      if (O.isNone(entity)) {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
      }

      const childElements = pipe(
        entity.value,
        getSyntax(config.locale),
        RNEA.map((a) =>
          isLabelText(a) ? drawLabel(a) : generateBlockByRelation(graph)(nodeId)(unpackRelation(a))
        )
      );

      const category = getCategoryByEntity(entity.value);

      return drawBlock(category)(childElements);
    };

export const generateWorkspace = (graph: CodeGraph) => {
  const triggerBlocks = pipe(
    filterNodes(graph)(
      (a) => isSymbolEntity(a) && getCategoryByEntity(a) === SymbolCategory.TriggerAction
    ),
    RA.map(generateBlock(graph))
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
