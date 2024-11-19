import type { Predicate } from 'fp-ts/Predicate';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
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

export const findNodeById =
  <E, R>(graph: Graph<E, R>) =>
    (nodeId: number) =>
      pipe(
        graph.nodes,
        RM.lookupWithKey(N.Eq)(nodeId),
        O.map((a) => a[1])
      );

export const findSubjectNode =
  <E, R>(graph: Graph<E, R>) =>
    (objectNodeId: number) =>
      pipe(
        graph.links,
        RA.filter((a) => a.objectNodeId === objectNodeId),
        RA.head,
        O.map((a) => a.subjectNodeId)
      );

export const resolveNodeByLink =
  <E, R>(graph: Graph<E, R>) =>
    (nodeId: number) =>
      (relation: R) =>
        pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId === nodeId && a.relation === relation),
          RA.head,
          O.map((a) => a.objectNodeId)
        );

export const findRelation =
  <E, R>(graph: Graph<E, R>) =>
    (subjectNodeId: number) =>
      (objectNodeId: number) =>
        pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId === subjectNodeId && a.objectNodeId === objectNodeId),
          RA.head,
          O.map((a) => a.relation)
        );

export const filterNodes =
  <E, R>(graph: Graph<E, R>) =>
    (predicate: Predicate<E>) =>
      pipe(graph.nodes, RM.filter<E>(predicate), RM.keys(N.Ord));

export const addNode =
  <E, R>(graph: Graph<E, R>) =>
    (entity: E) => ({
      ...graph,
      nextNodeId: graph.nextNodeId + 1,
      nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity))
    });

export const addNodeWithRelation =
  <E, R>(graph: Graph<E, R>) =>
    (subjectNodeId: number) =>
      (relation: R) =>
        (entity: E) => ({
          nextNodeId: graph.nextNodeId + 1,
          nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity)),
          links: pipe(graph.links, RA.append({ subjectNodeId, relation, objectNodeId: graph.nextNodeId }))
        });

export const replaceNode =
  <E, R>(graph: Graph<E, R>) =>
    (nodeId: number) =>
      (entity: E) => ({
        ...graph,
        nextNodeId: graph.nextNodeId + 1,
        nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(nodeId, entity))
      });

export const removeNode =
  <E, R>(graph: Graph<E, R>) =>
    (nodeId: number) => ({
      ...graph,
      nodes: pipe(graph.nodes, RM.deleteAt(N.Eq)(nodeId)),
      links: pipe(
        graph.links,
        RA.filter((a) => a.subjectNodeId !== nodeId && a.objectNodeId !== nodeId)
      )
    });

export const addLink =
  <E, R>(graph: Graph<E, R>) =>
    (link: Link<R>) => ({
      ...graph,
      links: pipe(graph.links, RA.append(link))
    });

export const removeLink =
  <E, R>(graph: Graph<E, R>) =>
    (subjectNodeId: number) =>
      (objectNodeId: number) => ({
        ...graph,
        links: pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId !== subjectNodeId || a.objectNodeId !== objectNodeId)
        )
      });
