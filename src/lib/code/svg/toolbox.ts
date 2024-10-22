import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  getCategoryByRelation,
  getSymbolEntities,
  SymbolCategory
} from '$lib/resource/graph/symbol-category';
import {
  getSyntax,
  isTypedRelation,
  unpackRelation,
  type TypedRelation
} from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';
import { getPlaceholder } from '$lib/resource/placeholder-def';
import {
  drawBlock,
  drawLabel,
  drawPlaceholderBlock,
  getCategoryByElement,
  getSize,
  isActionBlock,
  isClosedSectionBlock,
  isOpenedSectionBlock,
  isPlaceholderBlock,
  isTriggerActionBlock,
  resolveBlock
} from './block';
import { findElement, type CellPosition } from '../fp-ts-utils/table';
import { isBottom, moveDown, type ElementTable } from '../label-table';
import { SymbolEntity } from '$lib/resource/graph/symbol-entity';

const generatePlaceholderBlock = (typedRelation: TypedRelation) =>
  pipe(unpackRelation(typedRelation), (relation) =>
    pipe(
      relation,
      getPlaceholder(config.locale),
      drawPlaceholderBlock(getCategoryByRelation(relation))
    )
  );

export const generateToolboxByCategory = (category: SymbolCategory) => {
  const symbolEntities = getSymbolEntities(category);

  const blocks = pipe(
    symbolEntities,
    RA.filter((a) => a !== SymbolEntity.ProgramStart),
    RA.map((entity) =>
      pipe(
        entity,
        getSyntax(config.locale),
        RNEA.map((a) => (isTypedRelation(a) ? generatePlaceholderBlock(a) : drawLabel(a))),
        drawBlock(category)
      )
    )
  );

  const toolbox = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  toolbox.classList.add('toolbox');

  let offsetY = 20;

  blocks.forEach((block, i) => {
    block.setAttribute('transform', `translate(${20} ${offsetY})`);
    block.dataset.symbolEntity =
      category === SymbolCategory.TriggerAction ? symbolEntities[i + 1] : symbolEntities[i];
    offsetY += getSize(block).height + 20;
    toolbox.append(block);
  });

  return toolbox;
};

const getCategoryForTriggerActionBlock =
  (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
    pipe(
      currentPosition,
      moveDown(workspaceTable),
      findElement(workspaceTable),
      O.map(getCategoryByElement),
      O.getOrElse(() => SymbolCategory.None as SymbolCategory)
    );

const getCategoryForBlock = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(currentPosition, findElement(workspaceTable), O.exists(isOpenedSectionBlock))
    ? SymbolCategory.None
    : isBottom(workspaceTable)(currentPosition)
      ? SymbolCategory.TriggerAction
      : pipe(
        currentPosition,
        findElement(workspaceTable),
        O.map((a) =>
          isClosedSectionBlock(a)
            ? SymbolCategory.None
            : isActionBlock(a)
              ? SymbolCategory.Action
              : isTriggerActionBlock(a)
                ? getCategoryForTriggerActionBlock(workspaceTable)(currentPosition)
                : SymbolCategory.None
        ),
        O.getOrElse(() => SymbolCategory.None as SymbolCategory)
      );

const getCategoryForLabel = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(
    currentPosition,
    findElement(workspaceTable),
    O.map(resolveBlock),
    O.map((a) =>
      isPlaceholderBlock(a) || isTriggerActionBlock(a) || isActionBlock(a)
        ? getCategoryByElement(a)
        : SymbolCategory.None
    ),
    O.getOrElse(() => SymbolCategory.None as SymbolCategory)
  );

export const generateToolbox = (workspaceTable: ElementTable) => (currentPosition: CellPosition) =>
  pipe(
    currentPosition.columnNumber === 0
      ? getCategoryForBlock(workspaceTable)(currentPosition)
      : getCategoryForLabel(workspaceTable)(currentPosition),
    generateToolboxByCategory
  );
