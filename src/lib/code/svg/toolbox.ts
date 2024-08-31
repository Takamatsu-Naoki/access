import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  getCategoryByRelation,
  getSymbolEntities,
  SymbolCategory
} from '$lib/resource/graph/symbol-category';
import { getSyntax, isPrefixedRelation, removePrefix, type Syntax } from '$lib/resource/syntax-def';
import { config } from '$lib/resource/config';
import { getPlaceholder } from '$lib/resource/placeholder-def';
import type { SymbolRelation } from '$lib/resource/graph/symbol-relation';
import {
  drawActionBlock,
  drawConditionBlock,
  drawLabel,
  drawNumberBlock,
  drawPlaceholderBlock,
  drawStringBlock,
  getSize,
  isActionBlock
} from './block';

const generatePlaceholderBlock = (prefixedRelation: string) =>
  pipe(removePrefix(prefixedRelation) as SymbolRelation, (relation) =>
    pipe(
      relation,
      getPlaceholder(config.locale),
      drawPlaceholderBlock(getCategoryByRelation(relation))
    )
  );

const alignChildElements = (childElements: ReadonlyArray<SVGGElement>) =>
  pipe(
    childElements,
    RA.reduce(RNEA.of([] as SVGGElement[]), (acc, cur) =>
      isActionBlock(cur)
        ? pipe(acc, RA.append([cur]))
        : pipe(acc, RNEA.last, RA.last, O.exists(isActionBlock))
          ? pipe(acc, RA.append([cur]))
          : pipe(
            acc,
            RNEA.modifyLast((a) => [...a, cur])
          )
    )
  );

export const drawToolbox = (category: SymbolCategory) => {
  const childElementTable = pipe(
    category,
    getSymbolEntities,
    RA.map((entity) =>
      pipe(
        entity,
        getSyntax(config.locale),
        RNEA.map((a) => (isPrefixedRelation(a) ? generatePlaceholderBlock(a) : drawLabel(a)))
      )
    )
  );

  const blocks = pipe(
    childElementTable,
    RA.map((childElements) =>
      category === SymbolCategory.TriggerAction
        ? drawActionBlock(alignChildElements(childElements))(true)
        : category === SymbolCategory.Action
          ? drawActionBlock(alignChildElements(childElements))(false)
          : category === SymbolCategory.Condition
            ? drawConditionBlock(childElements)
            : category === SymbolCategory.Number
              ? drawNumberBlock(childElements)
              : category === SymbolCategory.String
                ? drawStringBlock(RNEA.head(childElements))
                : document.createElementNS('http://www.w3.org/2000/svg', 'g')
    )
  );

  const toolbox = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  toolbox.classList.add('toolbox');

  let offsetY = 20;

  blocks.forEach((block) => {
    block.setAttribute('transform', `translate(${20} ${offsetY})`);
    offsetY += getSize(block).height + 20;
    toolbox.append(block);
  });

  return toolbox;
};
