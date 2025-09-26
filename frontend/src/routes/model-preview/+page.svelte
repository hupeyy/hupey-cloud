<script>
	import { page } from '$app/stores';
	import { Canvas } from '@threlte/core';
	import Model from '$lib/components/Model.svelte';
	import { onMount } from 'svelte';

	// Use Svelte 5 state for the current model
	let currentModelURL = $state('/models/hupey-cloud.gltf');

	let canvasElement;
	let isGenerating = $state(false);
	let rotationY = $state(Math.PI); // Keep the existing rotation
	let enableRotation = $state(false);
	let scale = $state(2);
	let verticalPosition = $state(-2); // Y position of the model

	// Initialize from URL on mount
	onMount(() => {
		const urlModel = $page.url.searchParams.get('model');
		if (urlModel) {
			currentModelURL = urlModel;
		}
	});

	// Reactive effect to update URL when model changes
	$effect(() => {
		if (typeof window !== 'undefined') {
			const url = new URL(window.location);
			url.searchParams.set('model', currentModelURL);
			window.history.replaceState({}, '', url.pathname + url.search);
			console.log('Model changed to:', currentModelURL);
		}
	});

	function downloadPreview() {
		if (!canvasElement) {
			console.error('Canvas element not found');
			return;
		}

		isGenerating = true;

		// Force a render and wait for it to complete
		const canvas = canvasElement.querySelector('canvas');
		if (!canvas) {
			console.error('Canvas not found in canvasElement');
			alert('Canvas not found. Make sure the 3D model has loaded.');
			isGenerating = false;
			return;
		}

		// Wait for the next animation frame to ensure rendering is complete
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				try {
					// Check if canvas has content
					const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
					if (!ctx) {
						throw new Error('WebGL context not found');
					}

					// Get the model name for filename
					const modelName = currentModelURL
						.split('/')
						.pop()
						.replace('.gltf', '')
						.replace('.glb', '')
						.replace('scene', 'model');

					// Create a temporary canvas to ensure we get the right size
					const tempCanvas = document.createElement('canvas');
					tempCanvas.width = canvas.width;
					tempCanvas.height = canvas.height;
					const tempCtx = tempCanvas.getContext('2d');

					// Draw the WebGL canvas to the 2D canvas
					tempCtx.drawImage(canvas, 0, 0);

					// Get high quality image data
					const dataURL = tempCanvas.toDataURL('image/png', 1.0);

					// Check if we got a blank image
					if (
						dataURL ===
						'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
					) {
						throw new Error('Canvas appears to be blank');
					}

					// Create download link
					const link = document.createElement('a');
					link.download = `${modelName}-preview.png`;
					link.href = dataURL;

					// Trigger download
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					console.log(`✅ Downloaded preview: ${link.download}`);
					console.log('Canvas size:', canvas.width, 'x', canvas.height);
					console.log('Data URL length:', dataURL.length);
				} catch (error) {
					console.error('Error generating preview:', error);
					alert(
						`Error generating preview: ${error.message}\n\nTry:\n1. Wait for the model to load completely\n2. Right-click the canvas and "Save image as..."\n3. Check browser console for more details`
					);
				}

				isGenerating = false;
			});
		});
	}

	// Available models (all models found)
	const availableModels = [
		'/models/hupey-cloud.gltf',
		'/models/hupey-avatar.gltf',
		'/models/colorstack.gltf',
		'/models/computer/scene.gltf',
		'/models/connect_4/scene.gltf',
		'/models/crypto/scene.gltf',
		'/models/robot/scene.gltf'
	];

	function resetRotation() {
		rotationY = Math.PI;
	}

	function rotateLeft() {
		rotationY -= Math.PI / 4; // 45 degrees
	}

	function rotateRight() {
		rotationY += Math.PI / 4; // 45 degrees
	}
</script>

<svelte:head>
	<title>Model Preview</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col bg-gray-900">
	<!-- Header with controls - moved away from hamburger area -->
	<div class="flex flex-col gap-4 bg-gray-800 p-4 pt-16">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h1 class="text-xl font-bold text-white">Model Preview Generator</h1>

			<div class="flex flex-wrap items-center gap-4">
				<!-- Model selector -->
				<select
					class="min-w-48 rounded bg-gray-700 px-3 py-2 text-white"
					bind:value={currentModelURL}
				>
					{#each availableModels as model}
						<option value={model}>
							{#if model.includes('/scene.gltf')}
								{model.split('/')[2]} (scene.gltf)
							{:else}
								{model.split('/').pop()}
							{/if}
						</option>
					{/each}
				</select>

				<!-- Current model indicator -->
				<div class="rounded bg-gray-700 px-2 py-1 text-sm text-white">
					Current: {currentModelURL.split('/').pop()}
				</div>

				<!-- Manual refresh button -->
				<button
					class="rounded bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
					onclick={() => window.location.reload()}
					title="Refresh page if model doesn't change"
				>
					🔄 Refresh
				</button>

				<!-- Download button -->
				<button
					class="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
					onclick={downloadPreview}
					disabled={isGenerating}
				>
					{isGenerating ? 'Generating...' : '📸 Download Preview'}
				</button>

				<!-- Debug button -->
				<button
					class="rounded bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700"
					onclick={() => {
						const canvas = canvasElement?.querySelector('canvas');
						if (canvas) {
							console.log('Canvas found:', canvas);
							console.log('Canvas size:', canvas.width, 'x', canvas.height);
							console.log(
								'Canvas context:',
								canvas.getContext('webgl2') || canvas.getContext('webgl')
							);
							alert(
								`Canvas: ${canvas.width}x${canvas.height}\nContext: ${canvas.getContext('webgl2') ? 'WebGL2' : canvas.getContext('webgl') ? 'WebGL' : 'None'}`
							);
						} else {
							alert('No canvas found!');
						}
					}}
				>
					🔍 Debug
				</button>
			</div>
		</div>

		<!-- Rotation Controls -->
		<div class="flex flex-wrap items-center gap-4">
			<span class="font-medium text-white">Rotation Controls:</span>

			<button
				class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
				onclick={rotateLeft}
			>
				↺ Left
			</button>

			<button
				class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
				onclick={rotateRight}
			>
				↻ Right
			</button>

			<button
				class="rounded bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
				onclick={resetRotation}
			>
				🔄 Reset
			</button>

			<label class="flex items-center gap-2 text-white">
				<input type="checkbox" bind:checked={enableRotation} class="rounded" />
				Auto Rotate
			</label>

			<label class="flex items-center gap-2 text-white">
				Scale:
				<input type="range" min="0.05" max="20" step="0.1" bind:value={scale} class="w-20" />
				<span class="text-sm">{scale.toFixed(1)}</span>
			</label>

			<label class="flex items-center gap-2 text-white">
				Height:
				<input
					type="range"
					min="-5"
					max="3"
					step="0.1"
					bind:value={verticalPosition}
					class="w-20"
				/>
				<span class="text-sm">{verticalPosition.toFixed(1)}</span>
			</label>

			<button
				class="rounded bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-700"
				onclick={() => {
					verticalPosition = -2;
					scale = 2;
					rotationY = Math.PI;
				}}
				title="Reset position, scale, and rotation to defaults"
			>
				📍 Reset All
			</button>
		</div>
	</div>

	<!-- 3D Canvas -->
	<div class="relative flex flex-1 items-center justify-center">
		<div class="h-full w-full max-w-4xl" bind:this={canvasElement}>
			<Canvas
				rendererParameters={{
					preserveDrawingBuffer: true,
					antialias: true,
					alpha: true
				}}
			>
				<Model
					{scale}
					position={[0, verticalPosition, 0]}
					{rotationY}
					modelURL={currentModelURL}
					oscillator={false}
					rotator={enableRotation}
				/>
			</Canvas>
		</div>

		<!-- Status indicator -->
		{#if isGenerating}
			<div class="absolute right-4 top-4 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
				🎨 Generating preview...
			</div>
		{/if}
	</div>

	<!-- Instructions -->
	<div class="border-t border-gray-700 bg-gray-800 p-4 text-sm text-gray-300">
		<div class="mx-auto max-w-4xl">
			<p class="mb-2 font-semibold text-white">📋 Instructions:</p>
			<div class="grid gap-4 md:grid-cols-2">
				<ol class="list-inside list-decimal space-y-1">
					<li>Select a model from the dropdown</li>
					<li>Use rotation controls to rotate the model</li>
					<li>Adjust scale and height as needed</li>
					<li>Wait for the 3D model to load completely</li>
					<li>Click "📸 Download Preview" to save PNG</li>
				</ol>
				<ol class="list-inside list-decimal space-y-1" start="6">
					<li>
						Place the downloaded PNG in <code class="rounded bg-gray-700 px-1 text-xs"
							>static/images/previews/</code
						>
					</li>
					<li>Rename to match your model:</li>
					<li class="ml-4 text-xs">
						<code class="rounded bg-gray-700 px-1">hupey-cloud.gltf</code> →
						<code class="rounded bg-gray-700 px-1">hupey-cloud.png</code>
					</li>
					<li>Test on mobile to see the preview images</li>
				</ol>
			</div>

			<div class="mt-3 rounded border border-blue-700 bg-blue-900/30 p-3">
				<p class="text-xs text-blue-200">
					💡 <strong>Tip:</strong> If download doesn't work, try right-clicking the canvas and "Save
					image as..." or check browser console for errors.
				</p>
			</div>
		</div>
	</div>
</div>
