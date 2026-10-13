<script>
	import { onMount } from 'svelte';

	// The preview image is in the server-rendered page, so it shows straight away on
	// every screen. On wider screens the live 3D model replaces it once it has loaded.
	// three.js and threlte are ~750 KB, so they're imported on demand (below) rather
	// than at the top, and never on small screens.

	let {
		modelURL = '/models/hupey-cloud.gltf',
		previewImage = null, // PNG preview; derived from modelURL when not given, false for none
		scale = 2,
		position = [0, -2, 0],
		cameraPosition = [0, 0, 8],
		rotationY = 0,
		rotator = false,
		oscillator = false,
		alt = 'Model preview',
		breakpoint = 768 // Screens at least this wide get the live model
	} = $props();

	let live = $state(false);
	let Canvas = $state(null);
	let Model = $state(null);
	let modelReady = $state(false);
	let previewFailed = $state(false);

	onMount(() => {
		const query = matchMedia(`(min-width: ${breakpoint}px)`);
		live = query.matches;
		const update = (e) => (live = e.matches);
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});

	// Convert a model path to its preview path; scene.gltf models use the folder name
	const getPreviewPath = (modelPath) => {
		if (previewImage) return previewImage;
		let modelName = modelPath.split('/').pop().replace('.gltf', '');
		if (modelName === 'scene') {
			const pathParts = modelPath.split('/');
			modelName = pathParts[pathParts.length - 2];
		}
		return `/images/previews/${modelName}.png`;
	};

	const previewPath = getPreviewPath(modelURL);
	const showPreview = $derived(previewImage !== false && !previewFailed && !(live && modelReady));

	// Load the 3D runtime only once the live model is actually needed
	$effect(() => {
		if (!live || Canvas) return;
		Promise.all([import('@threlte/core'), import('./Model.svelte')])
			.then(([threlte, model]) => {
				Canvas = threlte.Canvas;
				Model = model.default;
			})
			.catch((err) => console.error('Failed to load 3D model viewer:', err));
	});
</script>

<div class="relative h-full w-full">
	{#if live && Canvas && Model}
		<div class="absolute inset-0 transition-opacity duration-500" class:opacity-0={!modelReady}>
			<Canvas>
				<Model
					{modelURL}
					{scale}
					{position}
					{cameraPosition}
					{rotationY}
					{rotator}
					{oscillator}
					onload={() => (modelReady = true)}
				/>
			</Canvas>
		</div>
	{/if}

	{#if previewImage !== false && !previewFailed}
		<img
			src={previewPath}
			{alt}
			fetchpriority="high"
			class="absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-500"
			class:opacity-0={!showPreview}
			onerror={() => (previewFailed = true)}
		/>
	{/if}
</div>
