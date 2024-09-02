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
  (nodeId: number) =>
    <E, R>(graph: Graph<E, R>) =>
      pipe(
        graph.nodes,
        RM.lookupWithKey(N.Eq)(nodeId),
        O.map((a) => a[1])
      );

export const findSubjectNode =
  (objectNodeId: number) =>
    <E, R>(graph: Graph<E, R>) =>
      pipe(
        graph.links,
        RA.filter((a) => a.objectNodeId === objectNodeId),
        RA.head,
        O.map((a) => a.subjectNodeId)
      );

export const resolveNodeByLink =
  (nodeId: number) =>
    <R>(relation: R) =>
      <E>(graph: Graph<E, R>) =>
        pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId === nodeId && a.relation === relation),
          RA.head,
          O.map((a) => a.objectNodeId)
        );

export const findRelation =
  (subjectNodeId: number) =>
    (objectNodeId: number) =>
      <E, R>(graph: Graph<E, R>) =>
        pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId === subjectNodeId && a.objectNodeId === objectNodeId),
          RA.head,
          O.map((a) => a.relation)
        );

export const filterNodes =
  <E>(predicate: Predicate<E>) =>
    <R>(graph: Graph<E, R>) =>
      pipe(graph.nodes, RM.filter<E>(predicate), RM.keys(N.Ord));

export const addNode =
  <E>(entity: E) =>
    <R>(graph: Graph<E, R>) => ({
      ...graph,
      nextNodeId: graph.nextNodeId + 1,
      nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity))
    });

export const addNodeWithRelation =
  (subjectNodeId: number) =>
    <R>(relation: R) =>
      <E>(entity: E) =>
        (graph: Graph<E, R>) => ({
          nextNodeId: graph.nextNodeId + 1,
          nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(graph.nextNodeId, entity)),
          links: pipe(graph.links, RA.append({ subjectNodeId, relation, objectNodeId: graph.nextNodeId }))
        });

export const replaceNode =
  (nodeId: number) =>
    <E>(entity: E) =>
      <R>(graph: Graph<E, R>) => ({
        ...graph,
        nextNodeId: graph.nextNodeId + 1,
        nodes: pipe(graph.nodes, RM.upsertAt(N.Eq)(nodeId, entity))
      });

export const removeNode =
  (nodeId: number) =>
    <E, R>(graph: Graph<E, R>) => ({
      ...graph,
      nodes: pipe(graph.nodes, RM.deleteAt(N.Eq)(nodeId)),
      links: pipe(
        graph.links,
        RA.filter((a) => a.subjectNodeId !== nodeId && a.objectNodeId !== nodeId)
      )
    });

export const addLink =
  <R>(link: Link<R>) =>
    <E>(graph: Graph<E, R>) => ({
      ...graph,
      links: pipe(graph.links, RA.append(link))
    });

export const removeLink =
  (subjectNodeId: number) =>
    (objectNodeId: number) =>
      <E, R>(graph: Graph<E, R>) => ({
        ...graph,
        links: pipe(
          graph.links,
          RA.filter((a) => a.subjectNodeId !== subjectNodeId || a.objectNodeId !== objectNodeId)
        )
      });
