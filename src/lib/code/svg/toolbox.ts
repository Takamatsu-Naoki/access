import { pipe } from 'fp-ts/function';
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
  getSize
} from './block';

const generatePlaceholderBlock = (typedRelation: TypedRelation) =>
  pipe(unpackRelation(typedRelation), (relation) =>
    pipe(
      relation,
      getPlaceholder(config.locale),
      drawPlaceholderBlock(getCategoryByRelation(relation))
    )
  );

export const generateToolbox = (category: SymbolCategory) => {
  const childElementTable = pipe(
    category,
    getSymbolEntities,
    RA.map((entity) =>
      pipe(
        entity,
        getSyntax(config.locale),
        RNEA.map((a) => (isTypedRelation(a) ? generatePlaceholderBlock(a) : drawLabel(a)))
      )
    )
  );

  const blocks = pipe(childElementTable, RA.map(drawBlock(category)));

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
