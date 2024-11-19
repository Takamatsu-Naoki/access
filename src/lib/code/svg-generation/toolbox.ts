import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { config } from '$lib/code/config';
import {
  getCategoryByRelation,
  getSymbolEntities,
  SymbolCategory
} from '$lib/code/code-graph/symbol-category';
import { SymbolEntity } from '$lib/code/code-graph/symbol-entity';
import { findElement, type CellPosition } from '$lib/code/utils/table';
import { isBottom, moveDown, type ElementTable } from '$lib/code/label-table/label-table';
import { getSyntax, isTypedRelation, type TypedRelation } from '$lib/code/syntax-definition/syntax';
import { getPlaceholder } from '$lib/code/syntax-definition/placeholder';
import {
  drawBlock,
  drawLabel,
  drawPlaceholderBlock,
  getCategoryByElement,
  getSize,
  isActionBlock,
  isSectionBlock,
  isPlaceholderBlock,
  isTriggerActionBlock,
  resolveBlock
} from './block';

const generatePlaceholderBlock = (typedRelation: TypedRelation) => {
  const relation = typedRelation.value;
  const category = getCategoryByRelation(relation);
  const placeholder = getPlaceholder(config.locale)(relation);

  return drawPlaceholderBlock(category)(placeholder);
};

export const generateToolboxByCategory = (category: SymbolCategory) => {
  const toolbox = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  toolbox.classList.add('toolbox');

  const symbolEntities = getSymbolEntities(category);

  const blocks = pipe(
    symbolEntities,
    RA.filter((a) => a !== SymbolEntity.ProgramStart),
    RA.map((entity) =>
      pipe(
        getSyntax(config.locale)(entity),
        RNEA.map((a) => (isTypedRelation(a) ? generatePlaceholderBlock(a) : drawLabel(a))),
        drawBlock(category)
      )
    )
  );

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
  (workspaceTable: ElementTable) => (currentPosition: CellPosition) => {
    const belowBlock = pipe(currentPosition, moveDown(workspaceTable), findElement(workspaceTable));
    const category = pipe(belowBlock, O.map(getCategoryByElement));

    return pipe(
      category,
      O.getOrElse(() => SymbolCategory.None as SymbolCategory)
    );
  };

const getCategoryForBlock = (workspaceTable: ElementTable) => (currentPosition: CellPosition) => {
  const targetBlock = findElement(workspaceTable)(currentPosition);
  const category = pipe(
    targetBlock,
    O.map((block) =>
      isSectionBlock(block)
        ? SymbolCategory.None
        : isBottom(workspaceTable)(currentPosition)
          ? SymbolCategory.TriggerAction
          : isActionBlock(block)
            ? SymbolCategory.Action
            : isTriggerActionBlock(block)
              ? getCategoryForTriggerActionBlock(workspaceTable)(currentPosition)
              : SymbolCategory.None
    )
  );

  return pipe(
    category,
    O.getOrElse(() => SymbolCategory.None as SymbolCategory)
  );
};

const getCategoryForLabel = (workspaceTable: ElementTable) => (currentPosition: CellPosition) => {
  const label = findElement(workspaceTable)(currentPosition);
  const parentBlock = pipe(label, O.map(resolveBlock));
  const category = pipe(
    parentBlock,
    O.map((block) =>
      isPlaceholderBlock(block) || isTriggerActionBlock(block) || isActionBlock(block)
        ? getCategoryByElement(block)
        : SymbolCategory.None
    )
  );

  return pipe(
    category,
    O.getOrElse(() => SymbolCategory.None as SymbolCategory)
  );
};

export const generateToolbox =
  (workspaceTable: ElementTable) => (currentPosition: CellPosition) => {
    const category =
      currentPosition.columnNumber === 0
        ? getCategoryForBlock(workspaceTable)(currentPosition)
        : getCategoryForLabel(workspaceTable)(currentPosition);

    return generateToolboxByCategory(category);
  };
