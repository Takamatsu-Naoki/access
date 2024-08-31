<script lang="ts">
</script>

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

<div id="hidden-div">
	<svg id="hidden-SVG" />
</div>
<header id="menu-bar">
	<p id="title">
		ACCESS: Accessible Coding and Computer Education for Students with Sight-impairment
	</p>
</header>
<div id="body-wrapper">
	<div id="toolbox-wrapper">
		<svg id="toolbox" viewBox="0 0 700 1400" />
	</div>
	<div id="workspace-wrapper">
		<svg id="workspace" viewBox="0 0 700 1400" />
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
		width: 700px;
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
		top: -10px;
		left: 10px;
		font-size: 1.5em;
		color: white;
		white-space: nowrap;
	}
</style>
