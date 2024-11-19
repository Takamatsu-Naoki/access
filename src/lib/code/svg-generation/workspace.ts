import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from 'fp-ts/ReadonlyArray';
import { findNodeById, resolveNodeByLink, filterNodes } from '$lib/code/utils/graph';
import {
  type CodeGraph,
  isSymbolEntity,
  isNumericEntity,
  isStringEntity,
  isBlankEntity,
  isSectionEntity,
  getNextActionNodes,
  type CodeEntity
} from '$lib/code/code-graph/code-graph';
import { SymbolRelation } from '$lib/code/code-graph/symbol-relation';
import {
  getCategoryByEntity,
  getCategoryByRelation,
  isTriggerAction,
  SymbolCategory
} from '$lib/code/code-graph/symbol-category';
import { config } from '$lib/code/config';
import { drawLabel, drawPlaceholderBlock, getSize, drawBlock, setData } from './block';
import {
  type LabelText,
  isLabelText,
  getOpenedSectionStartText,
  getOpenedSectionEndText,
  getClosedSectionText,
  getSyntax,
  getValueText
} from '$lib/code/syntax-definition/syntax';
import { getPlaceholder } from '$lib/code/syntax-definition/placeholder';

const blankLabelText: LabelText = { type: 'text', value: '', screenReaderText: '' };

const generateClosedSectionBlock = (graph: CodeGraph) => (nodeId: number) => {
  const sectionNode = findNodeById(graph)(nodeId);

  const labelText = pipe(
    sectionNode,
    O.map((node) => (isSectionEntity(node) ? getClosedSectionText(node) : blankLabelText)),
    O.getOrElse(() => blankLabelText)
  );

  const label = drawLabel(labelText);

  const block = drawBlock(SymbolCategory.Action)([label]);
  block.classList.add('closed-section-block');
  block.dataset.nodeId = nodeId.toString();

  return block;
};

const isValueRelation = (relation: SymbolRelation) =>
  relation === SymbolRelation.NumericValue || relation === SymbolRelation.StringValue;

const generateValueLabel = (codeEntity: CodeEntity) => (relation: SymbolRelation) => {
  const labelText = isBlankEntity(codeEntity)
    ? getPlaceholder(config.locale)(relation)
    : isNumericEntity(codeEntity)
      ? getValueText(`${codeEntity.value}`)
      : isStringEntity(codeEntity)
        ? getValueText(codeEntity.value)
        : getValueText('');

  return drawLabel(labelText);
};

const generateBlankBlock = (nodeId: number) => (relation: SymbolRelation) =>
  pipe(
    getPlaceholder(config.locale)(relation),
    drawPlaceholderBlock(getCategoryByRelation(relation)),
    setData('nodeId')(`${nodeId}`),
    RA.of
  );

const generateChildrenBlock =
  (graph: CodeGraph) => (nodeId: number) => (relation: SymbolRelation) => {
    const targetNodeId = resolveNodeByLink(graph)(nodeId)(relation);
    const targetNode = pipe(
      targetNodeId,
      O.flatMap((id) => findNodeById(graph)(id))
    );

    return pipe(
      targetNodeId,
      O.flatMap((nodeId) =>
        pipe(
          targetNode,
          O.map((node) =>
            isValueRelation(relation)
              ? RA.of(generateValueLabel(node)(relation))
              : isBlankEntity(node)
                ? generateBlankBlock(nodeId)(relation)
                : pipe(getNextActionNodes(graph)(nodeId), RA.map(generateBlock(graph)))
          )
        )
      ),
      O.getOrElse(() => RA.of(document.createElementNS('http://www.w3.org/2000/svg', 'g')))
    );
  };

const generateNormalBlock =
  (graph: CodeGraph) =>
    (nodeId: number): SVGGElement => {
      const symbolEntity = pipe(findNodeById(graph)(nodeId), O.filter(isSymbolEntity));

      const childrenArray = pipe(
        symbolEntity,
        O.map((symbol) =>
          pipe(
            getSyntax(config.locale)(symbol),
            RNEA.map((a) =>
              isLabelText(a) ? [drawLabel(a)] : generateChildrenBlock(graph)(nodeId)(a.value)
            ),
            RA.flatten
          )
        ),
        O.flatMap(RNEA.fromReadonlyArray)
      );

      const symbolCategory = pipe(symbolEntity, O.map(getCategoryByEntity));

      return pipe(
        childrenArray,
        O.flatMap((children) =>
          pipe(
            symbolCategory,
            O.map((category) =>
              pipe(drawBlock(category)(children), setData('nodeId')(nodeId.toString()))
            )
          )
        ),
        O.getOrElse(() => document.createElementNS('http://www.w3.org/2000/svg', 'g'))
      );
    };

const generateBlock =
  (graph: CodeGraph) =>
    (nodeId: number): SVGGElement => {
      const node = findNodeById(graph)(nodeId);

      return pipe(node, O.exists(isSectionEntity))
        ? generateClosedSectionBlock(graph)(nodeId)
        : generateNormalBlock(graph)(nodeId);
    };

const generateTriggerActions = (graph: CodeGraph) => {
  const workspace = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  workspace.classList.add('workspace');

  const triggerBlocks = pipe(
    filterNodes(graph)((a) => isSymbolEntity(a) && isTriggerAction(a)),
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

const generatePlaceholderBlock = (nodeId: number) =>
  pipe(
    getPlaceholder(config.locale)(SymbolRelation.Action),
    drawPlaceholderBlock(SymbolCategory.Action),
    setData('nodeId')(`${nodeId}`)
  );

const generateOpenedSectionBlock = (graph: CodeGraph) => (currentSectionId: number) => {
  const workspace = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  workspace.classList.add('workspace');

  const sectionNode = findNodeById(graph)(currentSectionId);

  const sectionStartText = pipe(
    sectionNode,
    O.map((node) => (isSectionEntity(node) ? getOpenedSectionStartText(node) : blankLabelText)),
    O.getOrElse(() => blankLabelText)
  );

  const sectionEndText = pipe(
    sectionNode,
    O.map((node) => (isSectionEntity(node) ? getOpenedSectionEndText() : blankLabelText)),
    O.getOrElse(() => blankLabelText)
  );

  const nextActionNodeIds = pipe(
    resolveNodeByLink(graph)(currentSectionId)(SymbolRelation.Action as SymbolRelation),
    O.map(getNextActionNodes(graph)),
    O.getOrElse(() => [] as ReadonlyArray<number>)
  );

  const nextActionBlocks = pipe(
    nextActionNodeIds,
    RA.map((nodeId) =>
      pipe(findNodeById(graph)(nodeId), O.exists(isBlankEntity))
        ? generatePlaceholderBlock(nodeId)
        : generateBlock(graph)(nodeId)
    )
  );

  const sectionBlock = pipe(
    RNEA.of(drawLabel(sectionStartText)),
    RNEA.concat(nextActionBlocks),
    RA.append(drawLabel(sectionEndText)),
    drawBlock(SymbolCategory.TriggerAction)
  );

  sectionBlock.setAttribute('transform', 'translate(20 20)');
  sectionBlock.classList.add('opened-section-block');
  sectionBlock.dataset.nodeId = `${currentSectionId}`;
  workspace.append(sectionBlock);

  return workspace;
};

export const generateWorkspace = (graph: CodeGraph) => (currentSectionId: number) =>
  currentSectionId === 0
    ? generateTriggerActions(graph)
    : generateOpenedSectionBlock(graph)(currentSectionId);
