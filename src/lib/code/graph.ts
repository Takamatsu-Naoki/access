import { pipe } from 'fp-ts/function';
import * as RM from 'fp-ts/ReadonlyMap';
import * as RA from 'fp-ts/ReadonlyArray';
import * as N from 'fp-ts/number';

export type Link<R> = Readonly<{
  subjectNodeId: number;
  relation: R;
  objectNodeId: number;
}>;

export type Graph<E, R> = Readonly<{
  nextNodeId: number;
  nodes: ReadonlyMap<number, E>;
  links: ReadonlyArray<Link<R>>;
}>;

export const initializeGraph = <E, R>(): Graph<E, R> => ({
  nextNodeId: 0,
  nodes: new Map(),
  links: []
});

export const addNode =
  <E, R>(graph: Graph<E, R>) =>
        (entity: E): Graph<E, R> => ({
          ...graph,
          nextNodeId: graph.nextNodeId + 1,
          nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity)),
        });

export const appendNode =
  <E, R>(graph: Graph<E, R>) =>
    (subjectNodeId: number) =>
      (relation: R) =>
        (entity: E): Graph<E, R> => ({
          nextNodeId: graph.nextNodeId + 1,
          nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity)),
          links: pipe(
            graph.links,
            RA.append({ subjectNodeId, relation, objectNodeId: graph.nextNodeId })
          )
        });

export const removeNode =
  <E, R>(graph: Graph<E, R>) =>
    (nodeId: number): Graph<E, R> => ({
      ...graph,
      nodes: pipe(graph.nodes, RM.deleteAt(N.Eq)(nodeId)),
      links: pipe(
        graph.links,
        RA.filter((a) => a.subjectNodeId !== nodeId && a.objectNodeId !== nodeId)
      )
    });

export const addLink =
  <E, R>(graph: Graph<E, R>) =>
    (link: Link<R>): Graph<E, R> => ({
      ...graph,
      links: pipe(graph.links, RA.append(link))
    });

export const removeLink =
  <E, R>(graph: Graph<E, R>) =>
    (subjectNodeId: number) =>
      (objectNodeId: number): Graph<E, R> => ({
        ...graph,
        links: pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId !== subjectNodeId || a.objectNodeId !== objectNodeId)
        )
      });
