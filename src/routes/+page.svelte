<script lang="ts">
	import { onMount } from 'svelte';
	import { pipe } from 'fp-ts/function';
	import * as O from 'fp-ts/Option';
	import * as RM from 'fp-ts/ReadonlyMap';
	import * as RA from 'fp-ts/ReadonlyArray';
	import * as N from 'fp-ts/number';
	import { generateToolbox } from '$lib/code/svg/toolbox';
	import {
		type CodeGraph,
		type CodeEntity,
		attachBlock,
		isSectionEntity,
		BlankEntity
	} from '$lib/code/data/code-graph';
	import { generateWorkspace } from '$lib/code/svg/workspace';
	import { SymbolRelation } from '$lib/resource/graph/symbol-relation';
	import { SymbolEntity } from '$lib/resource/graph/symbol-entity';
	import {
		generateToolboxTable,
		generateWorkspaceTable,
		moveUp,
		moveDown,
		moveLeft,
		moveRight,
		type ElementTable
	} from '$lib/code/data/label-table';
	import { findElement, findRow, type CellPosition } from '$lib/code/fp-ts-utils/table';
	import {
		getOffset,
		drawArrow,
		drawOutline,
		isActionBlock,
		isTriggerActionBlock,
		getData,
		isPlaceholderBlock,
		resolveBlock,
		isClosedSectionBlock,
		isOpenedSectionBlock,
		isLabel
	} from '$lib/code/svg/block';
	import { config, getKeyBinding } from '$lib/resource/config';
	import { findNodeById } from '$lib/code/fp-ts-utils/graph';

	const keyBinding = getKeyBinding(config.keyBindingMode);

	const defaultCellPosition: CellPosition = { rowNumber: 0, columnNumber: 0 };

	let toolbox: SVGSVGElement;
	let workspace: SVGSVGElement;
	let hiddenDiv: HTMLDivElement;

	let workspaceHasFocus = true;
	let toolboxHasFocus = !workspaceHasFocus;

	let graph: CodeGraph = {
		nextNodeId: 7,
		nodes: new Map<number, CodeEntity>([
			[0, SymbolEntity.ProgramStart],
			[
				1,
				{
					type: 'section',
					path: '1',
					description: 'Set up Variables to store the sums of specific numbers, initialized to 0.'
				}
			],
			[2, { type: 'section', path: '2', description: 'Loop through numbers from 1 to 10.' }],
			[3, { type: 'section', path: '3', description: 'Output the results to the console.' }],
			[4, BlankEntity],
			[5, BlankEntity],
			[6, BlankEntity]
		]),
		links: [
			{
				subjectNodeId: 0,
				relation: SymbolRelation.Action,
				objectNodeId: 1
			},
			{
				subjectNodeId: 1,
				relation: SymbolRelation.NextAction,
				objectNodeId: 2
			},
			{
				subjectNodeId: 2,
				relation: SymbolRelation.NextAction,
				objectNodeId: 3
			},
			{
				subjectNodeId: 1,
				relation: SymbolRelation.Action,
				objectNodeId: 4
			},
			{
				subjectNodeId: 2,
				relation: SymbolRelation.Action,
				objectNodeId: 5
			},
			{
				subjectNodeId: 3,
				relation: SymbolRelation.Action,
				objectNodeId: 6
			}
		]
	};

	let toolboxSvg: SVGGElement;
	let workspaceSvg: SVGGElement;

	let toolboxTable: ElementTable = [[]];
	let workspaceTable: ElementTable = [[]];

	let currentToolboxPosition = defaultCellPosition;
	let currentWorkspacePosition = defaultCellPosition;

	let currentSectionId = 0;

	const onKeyDown = (e: KeyboardEvent) => {
		graph =
			toolboxHasFocus && e.key === keyBinding.enter
				? pipe(
						currentToolboxPosition,
						findElement(toolboxTable),
						O.map(getData('symbolEntity')),
						O.map((a) =>
							pipe(graph, attachBlock(workspaceTable)(currentWorkspacePosition)(a as SymbolEntity))
						),
						O.getOrElse(() => graph)
					)
				: graph;

		const previousSectionId = currentSectionId;

		currentSectionId = pipe(
			currentWorkspacePosition,
			findElement(workspaceTable),
			O.map((block) =>
				e.key === keyBinding.enter && isClosedSectionBlock(block)
					? pipe(block, getData('nodeId'), (a) => Number(a))
					: e.key === keyBinding.enter && isOpenedSectionBlock(block)
						? pipe(
								block,
								getData('nodeId'),
								(a) => Number(a),
								(a) => findNodeById(a)(graph),
								O.map((a) =>
									!isSectionEntity(a)
										? currentSectionId
										: a.path.includes('.')
											? pipe(a.path.substring(0, a.path.lastIndexOf('.')), (path) =>
													pipe(
														graph.nodes,
														RM.filter((a) => isSectionEntity(a) && a.path === path),
														RM.keys(N.Ord),
														(a) => a[0] ?? 0
													)
												)
											: 0
								),
								O.getOrElse(() => currentSectionId)
							)
						: currentSectionId
			),
			O.getOrElse(() => currentSectionId)
		);

		const previousWorkspacePosition = currentWorkspacePosition;

		currentWorkspacePosition =
			previousSectionId !== currentSectionId
				? defaultCellPosition
				: workspaceHasFocus && e.key === keyBinding.up
					? moveUp(workspaceTable)(currentWorkspacePosition)
					: workspaceHasFocus && e.key === keyBinding.down
						? moveDown(workspaceTable)(currentWorkspacePosition)
						: workspaceHasFocus && e.key === keyBinding.left
							? moveLeft(workspaceTable)(currentWorkspacePosition)
							: workspaceHasFocus && e.key === keyBinding.right
								? moveRight(workspaceTable)(currentWorkspacePosition)
								: currentWorkspacePosition;

		currentToolboxPosition =
			toolboxHasFocus && e.key === keyBinding.up
				? moveUp(toolboxTable)(currentToolboxPosition)
				: toolboxHasFocus && e.key === keyBinding.down
					? moveDown(toolboxTable)(currentToolboxPosition)
					: toolboxHasFocus && e.key === keyBinding.enter
						? defaultCellPosition
						: currentToolboxPosition;

		workspaceHasFocus =
			toolboxTable[0].length !== 0 && e.key === keyBinding.enter
				? !workspaceHasFocus
				: workspaceHasFocus;

		toolboxHasFocus = !workspaceHasFocus;

		if (workspaceHasFocus) {
			updateWorkspaceHighlight();
			updateToolbox();
		}

		if (toolboxHasFocus) {
			updateToolboxHighlight();
		}

		if (workspaceHasFocus && e.key === keyBinding.enter) {
			const isPlaceholder = pipe(
				currentWorkspacePosition,
				findElement(workspaceTable),
				O.map(resolveBlock),
				O.exists(isPlaceholderBlock)
			);

			currentWorkspacePosition =
				isPlaceholder || previousSectionId !== currentSectionId
					? currentWorkspacePosition
					: moveDown(workspaceTable)(currentWorkspacePosition);

			updateWorkspace();

			currentWorkspacePosition =
				previousSectionId !== currentSectionId
					? pipe(
							workspaceTable,
							RA.findIndex((row) =>
								pipe(
									row,
									RA.head,
									O.exists((a) => getData('nodeId')(a) === `${previousSectionId}`)
								)
							),
							O.getOrElse(() => 0),
							(a) => ({ rowNumber: a, columnNumber: 0 })
						)
					: currentWorkspacePosition;
		}

		updateWorkspaceHighlight();

		if (previousWorkspacePosition !== currentWorkspacePosition) {
			const text = generateQuote();
			//readWithApi(text);
		}
	};

	const getTargetElement = (label: Element): Element =>
		pipe(
			label.parentElement,
			O.fromNullable,
			O.match(
				() => label,
				(a) => (isTriggerActionBlock(a) || isActionBlock(a) ? label : getTargetElement(a))
			)
		);

	const generateArrow = (label: Element) => {
		const targetElement = getTargetElement(label);

		const offset = getOffset(targetElement);
		const size = targetElement.getBoundingClientRect();

		const arrow = drawArrow();
		arrow.setAttribute(
			'transform',
			`translate(${offset.x - 27} ${offset.y + (size.height - 27) / 2})`
		);

		targetElement.parentElement?.insertBefore(arrow, targetElement);
	};

	const generateOutline = (label: Element) => {
		const outline = drawOutline(label.getBoundingClientRect().width)(
			label.getBoundingClientRect().height
		);
		outline.setAttribute('transform', `translate(0 ${isActionBlock(label) ? -6 : 0})`);

		label.prepend(outline);
	};

	const updateToolboxHighlight = () => {
		toolbox.querySelectorAll('.highlight').forEach((a) => a.remove());

		if (toolboxHasFocus) {
			pipe(currentToolboxPosition, findElement(toolboxTable), O.map(generateOutline));
		}
	};

	const updateWorkspaceHighlight = () => {
		workspace.querySelectorAll('.highlight').forEach((a) => a.remove());

		if (currentWorkspacePosition.columnNumber === 0) {
			pipe(
				currentWorkspacePosition,
				moveRight(workspaceTable),
				findElement(workspaceTable),
				O.map(generateArrow)
			);
		} else {
			pipe(currentWorkspacePosition, findElement(workspaceTable), O.map(generateOutline));
		}
	};

	const updateToolbox = () => {
		Array.from(toolbox.children).forEach((a) => a.remove());

		toolboxSvg = generateToolbox(workspaceTable)(currentWorkspacePosition);
		toolbox.append(toolboxSvg);
		toolboxTable = generateToolboxTable(toolboxSvg);
		updateToolboxHighlight();
	};

	const updateWorkspace = () => {
		Array.from(workspace.children).forEach((a) => a.remove());

		workspaceSvg = generateWorkspace(graph)(currentSectionId);
		workspace.append(workspaceSvg);
		workspaceTable = generateWorkspaceTable(workspaceSvg);

		updateWorkspaceHighlight();
		updateToolbox();
	};

	const readWithApi = async (quote: string) => {
		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
		}

		const utterance = new SpeechSynthesisUtterance(quote);
		speechSynthesis.speak(utterance);
	};

	const generateQuote = () =>
		pipe(
			currentWorkspacePosition.rowNumber,
			findRow(workspaceTable),
			O.map((a) =>
				currentWorkspacePosition.columnNumber === 0
					? pipe(
							a,
							RA.filter(isLabel),
							RA.map((a) =>
								getData('description')(a) !== '' ? getData('description')(a) : (a.textContent ?? '')
							),
							RA.reduce('', (acc, cur) => acc + cur)
						)
					: pipe(
							a,
							RA.lookup(currentWorkspacePosition.columnNumber),
							O.map((a) =>
								getData('description')(a) !== '' ? getData('description')(a) : (a.textContent ?? '')
							),
							O.getOrElse(() => '')
						)
			),
			O.getOrElse(() => '')
		);

	const readWithScreenReader = async (text: string) => {
		const id = Math.random().toString(32).substring(2);
		hiddenDiv.insertAdjacentHTML(
			'beforeend',
			`<div class="hiddenLabel" id="${id}" aria-live="polite" aria-atomic="true"></div>`
		);

		const hiddenLabel = document.getElementById(id) as HTMLElement;
		setTimeout(() => {
			hiddenLabel.textContent = text;
		}, 10);
		setTimeout(() => {
			hiddenLabel.remove();
		}, 1000);
	};

	onMount(() => {
		updateWorkspace();
		updateToolbox();
		setTimeout(() => {
			const text = generateQuote();
			readWithApi(text);
		}, 1000);
	});
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<svelte:head>
	<title>ACCESS: Accessible Coding and Computer Education for Students with Sight-impairment</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap"
		rel="stylesheet"
	/>
	<style>
		html,
		body {
			width: 100%;
			height: 100%;
			overflow-y: hidden;
		}

		body::-webkit-scrollbar {
			display: none;
		}

		.hiddenLabel {
			position: absolute;
			right: 0;
		}

		.block-path {
			stroke: #222222;
			stroke-width: 1.3px;
		}

		.trigger-action-block-path {
			fill: #f26627;
		}

		.action-block-path {
			fill: #007ac4;
		}

		.condition-block-path {
			fill: #3abe86;
		}

		.number-block-path {
			fill: #ffd40f;
		}

		.string-block-path {
			fill: #954a35;
		}

		.text {
			fill: #222222;
		}

		.label-path {
			fill: #f5f6f7;
			stroke: #222222;
			stroke-width: 0.5px;
		}
	</style>
</svelte:head>

<div id="hidden-div" bind:this={hiddenDiv}>
	<svg id="hidden-SVG" />
</div>
<header id="menu-bar">
	<p id="title">
		ACCESS: Accessible Coding and Computer Education for Students with Sight-impairment
	</p>
</header>
<div id="body-wrapper">
	<div id="toolbox-wrapper" aria-hidden="true" class:focusedArea={toolboxHasFocus}>
		<svg id="toolbox" viewBox="0 0 805 1820" bind:this={toolbox} />
	</div>
	<div id="workspace-wrapper" aria-hidden="true" class:focusedArea={workspaceHasFocus}>
		<svg id="workspace" viewBox="0 0 1070 1400" bind:this={workspace} />
	</div>
</div>

<style>
	#hidden-div {
		position: absolute;
		left: 0;
	}

	#hidden-SVG {
		position: absolute;
		right: 0;
	}

	#menu-bar {
		position: sticky;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 3rem;
		display: flex;
		align-items: center;
	}

	#body-wrapper {
		height: calc(100% - 3rem);
		min-width: 1600px;
		padding: 12px;
		display: flex;
	}

	#toolbox-wrapper {
		width: 805px;
		margin-right: 12px;
		max-height: calc(100% - 24px);
		background-color: #bfe4ff;
		overflow-y: scroll;
		white-space: nowrap;
	}

	#toolbox-wrapper::-webkit-scrollbar {
		display: none;
	}

	#toolbox {
		min-width: 100%;
		min-height: 100%;
	}

	#workspace-wrapper {
		flex-grow: 1;
		max-height: calc(100% - 24px);
		background-color: #bfe4ff;
		overflow: scroll;
		white-space: nowrap;
	}

	#workspace-wrapper::-webkit-scrollbar {
		display: none;
	}

	#workspace {
		min-width: 100%;
		min-height: 100%;
	}

	#title {
		position: absolute;
		top: -12px;
		left: 10px;
		font-size: 1.5em;
		color: white;
		white-space: nowrap;
	}

	.focusedArea {
		outline: 12px solid #222222;
	}
</style>
