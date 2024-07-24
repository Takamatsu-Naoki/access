import { describe, test, expect } from 'vitest';
import { pipe } from 'fp-ts/function';
import * as G from '$lib/code/graph';

const graph = G.initializeGraph();

describe('Tests for Graph', () => {
  test('initializeGraph', () => {
    expect(graph).toStrictEqual({ nextNodeId: 0, nodes: new Map(), links: [] });
  });

  const graph0 = pipe('node-0', G.addNode(graph));

  test('addNode', () => {
    expect(graph0).toStrictEqual({ nextNodeId: 1, nodes: new Map([[0, 'node-0']]), links: [] });
  });

  const graph1 = pipe('node-1', G.appendNode(graph0)(0)('link-0-to-1'));

  test('appendNode', () => {
    expect(graph1).toStrictEqual({
      nextNodeId: 2,
      nodes: new Map([
        [0, 'node-0'],
        [1, 'node-1']
      ]),
      links: [{ subjectNodeId: 0, relation: 'link-0-to-1', objectNodeId: 1 }]
    });
  });

  const graph2 = pipe(1, G.removeNode(graph1));

  test('removeNode', () => {
    expect(graph2).toStrictEqual({
      nextNodeId: 2,
      nodes: new Map([[0, 'node-0']]),
      links: []
    });
  });

  const graph3 = pipe('node-1', G.addNode(graph0));
  const graph4 = pipe(
    { subjectNodeId: 0, relation: 'link-0-to-1', objectNodeId: 1 },
    G.addLink(graph3)
  );

  test('addLink', () => {
    expect(graph4).toStrictEqual(graph1);
  });

  const graph5 = G.removeLink(graph1)(0)(1);

  test('removeLink', () => {
    expect(graph5).toStrictEqual(graph3);
  });
});
