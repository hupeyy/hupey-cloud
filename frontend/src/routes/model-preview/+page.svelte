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
          const modelName = currentModelURL.split('/').pop().replace('.gltf', '').replace('.glb', '').replace('scene', 'model');
          
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
          if (dataURL === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==') {
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
          alert(`Error generating preview: ${error.message}\n\nTry:\n1. Wait for the model to load completely\n2. Right-click the canvas and "Save image as..."\n3. Check browser console for more details`);
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

<div class="w-screen h-screen bg-gray-900 flex flex-col">
  <!-- Header with controls - moved away from hamburger area -->
  <div class="bg-gray-800 p-4 pt-16 flex flex-col gap-4">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h1 class="text-white text-xl font-bold">Model Preview Generator</h1>
      
      <div class="flex items-center gap-4 flex-wrap">
        <!-- Model selector -->
        <select 
          class="bg-gray-700 text-white px-3 py-2 rounded min-w-48"
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
        <div class="text-white text-sm bg-gray-700 px-2 py-1 rounded">
          Current: {currentModelURL.split('/').pop()}
        </div>
        
        <!-- Manual refresh button -->
        <button 
          class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
          onclick={() => window.location.reload()}
          title="Refresh page if model doesn't change"
        >
          🔄 Refresh
        </button>
        
        <!-- Download button -->
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 font-semibold"
          onclick={downloadPreview}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : '📸 Download Preview'}
        </button>
        
        <!-- Debug button -->
        <button 
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm"
          onclick={() => {
            const canvas = canvasElement?.querySelector('canvas');
            if (canvas) {
              console.log('Canvas found:', canvas);
              console.log('Canvas size:', canvas.width, 'x', canvas.height);
              console.log('Canvas context:', canvas.getContext('webgl2') || canvas.getContext('webgl'));
              alert(`Canvas: ${canvas.width}x${canvas.height}\nContext: ${canvas.getContext('webgl2') ? 'WebGL2' : canvas.getContext('webgl') ? 'WebGL' : 'None'}`);
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
    <div class="flex items-center gap-4 flex-wrap">
      <span class="text-white font-medium">Rotation Controls:</span>
      
      <button 
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
        onclick={rotateLeft}
      >
        ↺ Left
      </button>
      
      <button 
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
        onclick={rotateRight}
      >
        ↻ Right
      </button>
      
      <button 
        class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded"
        onclick={resetRotation}
      >
        🔄 Reset
      </button>
      
      <label class="flex items-center gap-2 text-white">
        <input 
          type="checkbox" 
          bind:checked={enableRotation}
          class="rounded"
        />
        Auto Rotate
      </label>
      
      <label class="flex items-center gap-2 text-white">
        Scale:
        <input 
          type="range" 
          min="0.5" 
          max="4" 
          step="0.1"
          bind:value={scale}
          class="w-20"
        />
        <span class="text-sm">{scale.toFixed(1)}</span>
      </label>
    </div>
  </div>
  
  <!-- 3D Canvas -->
  <div class="flex-1 flex items-center justify-center relative">
    <div class="w-full h-full max-w-4xl" bind:this={canvasElement}>
      <Canvas 
        rendererParameters={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true
        }}
      >
        <Model 
          scale={scale}
          position={[0, -2, 0]}
          rotationY={rotationY}
          modelURL={currentModelURL}
          oscillator={false}
          rotator={enableRotation}
        />
      </Canvas>
    </div>
    
    <!-- Status indicator -->
    {#if isGenerating}
      <div class="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
        🎨 Generating preview...
      </div>
    {/if}
  </div>
  
  <!-- Instructions -->
  <div class="bg-gray-800 p-4 text-gray-300 text-sm border-t border-gray-700">
    <div class="max-w-4xl mx-auto">
      <p class="text-white font-semibold mb-2">📋 Instructions:</p>
      <div class="grid md:grid-cols-2 gap-4">
        <ol class="list-decimal list-inside space-y-1">
          <li>Select a model from the dropdown</li>
          <li>Use rotation controls to position the model</li>
          <li>Adjust scale if needed</li>
          <li>Wait for the 3D model to load completely</li>
          <li>Click "📸 Download Preview" to save PNG</li>
        </ol>
        <ol class="list-decimal list-inside space-y-1" start="6">
          <li>Place the downloaded PNG in <code class="bg-gray-700 px-1 rounded text-xs">static/images/previews/</code></li>
          <li>Rename to match your model:</li>
          <li class="ml-4 text-xs">
            <code class="bg-gray-700 px-1 rounded">hupey-cloud.gltf</code> → <code class="bg-gray-700 px-1 rounded">hupey-cloud.png</code>
          </li>
          <li>Test on mobile to see the preview images</li>
        </ol>
      </div>
      
      <div class="mt-3 p-3 bg-blue-900/30 rounded border border-blue-700">
        <p class="text-blue-200 text-xs">
          💡 <strong>Tip:</strong> If download doesn't work, try right-clicking the canvas and "Save image as..." 
          or check browser console for errors.
        </p>
      </div>
    </div>
  </div>
</div>
