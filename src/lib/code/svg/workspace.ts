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
  isBlankEntity,
  isSectionEntity,
  getNextActionNodes,
} from '$lib/code/code-graph';
import { SymbolRelation } from '$lib/resource/graph/symbol-relation';
import {
  getCategoryByEntity,
  getCategoryByRelation,
  isTriggerAction,
  SymbolCategory
} from '$lib/resource/graph/symbol-category';
import { getSyntax, isLabelText, unpackRelation } from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';
import {
  drawLabel,
  drawPlaceholderBlock,
  getSize,
  drawBlock,
  setData,
} from './block';
import { getPlaceholder } from '$lib/resource/placeholder-def';

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
              : pipe(childNodeId, getNextActionNodes(graph), RA.map(generateBlock(graph)))
          ),
          O.getOrElse(() => RA.of(document.createElementNS('http://www.w3.org/2000/svg', 'g')))
        )
    );

const generateSectionBlock = (graph: CodeGraph) => (nodeId: number) => {
  const text = pipe(
    graph,
    findNodeById(nodeId),
    O.map((a) => (isSectionEntity(a) ? `➕ ${a.path}. ${a.description}` : '')),
    O.getOrElse(() => '')
  );

  const label = drawLabel(text);

  const block = drawBlock(SymbolCategory.Action)([label]);
  block.classList.add('closed-section-block');
  block.dataset.nodeId = nodeId.toString();

  return block;
};

const generateBlock =
  (graph: CodeGraph) =>
    (nodeId: number): SVGGElement => {
      if (pipe(graph, findNodeById(nodeId), O.exists(isSectionEntity))) {
        return generateSectionBlock(graph)(nodeId);
      }

      const entity = pipe(graph, findNodeById(nodeId), O.filter(isSymbolEntity));

      if (O.isNone(entity)) {
        return document.createElementNS('http://www.w3.org/2000/svg', 'g');
      }

      const childElements = pipe(
        entity.value,
        getSyntax(config.locale),
        RNEA.map((a) =>
          isLabelText(a) ? [drawLabel(a)] : generateBlocksByRelation(graph)(nodeId)(unpackRelation(a))
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

const generateTriggerActions = (graph: CodeGraph) => {
  const workspace = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  workspace.classList.add('workspace');

  const triggerBlocks = pipe(
    graph,
    filterNodes((a) => isSymbolEntity(a) && isTriggerAction(a)),
    RA.map(generateBlock(graph))
  );

  let offsetY = 20;

  triggerBlocks.forEach((block) => {
    block.setAttribute('transform', `translate(${20} ${offsetY})`);
    offsetY += getSize(block).height + 20;
    workspace.append(block);
  });

  return workspace;
};

const generateSection = (graph: CodeGraph) => (currentSectionId: number) => {
  const workspace = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  workspace.classList.add('workspace');

  const sectionLabel = pipe(
    graph,
    findNodeById(currentSectionId),
    O.map((a) => (isSectionEntity(a) ? `➖  ${a.path}. ${a.description}` : '')),
    O.getOrElse(() => '')
  );

  const sectionBlock = pipe(
    graph,
    resolveNodeByLink(currentSectionId)(SymbolRelation.Action as SymbolRelation),
    O.map(getNextActionNodes(graph)),
    O.getOrElse(() => [] as ReadonlyArray<number>),
    RA.map(generateBlock(graph)),
    (a) =>
      pipe(
        drawLabel(sectionLabel),
        RNEA.of,
        RNEA.concat(a),
        RA.append(drawLabel('↩//End of the section'))
      ),
    drawBlock(SymbolCategory.TriggerAction)
  );

  sectionBlock.setAttribute('transform', 'translate(20 20)');
  sectionBlock.classList.add('opened-section-block');
  sectionBlock.dataset.nodeId = currentSectionId.toString();
  workspace.append(sectionBlock);

  return workspace;
};

export const generateWorkspace = (graph: CodeGraph) => (currentSectionId: number) =>
  currentSectionId === 0 ? generateTriggerActions(graph) : generateSection(graph)(currentSectionId);
