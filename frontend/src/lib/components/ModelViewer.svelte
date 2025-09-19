<script>
  import { Canvas } from '@threlte/core'
  import Model from './Model.svelte'
  import { onMount } from 'svelte'

  let {
    modelURL = '/models/hupey-cloud.gltf',
    previewImage = null, // Path to high-quality PNG preview
    scale = 2,
    position = [0, -2, 0],
    cameraPosition = [0, 0, 8],
    rotationY = 0,
    rotator = false,
    oscillator = false,
    alt = 'Model preview'
  } = $props();

  let isMobile = $state(false);
  let canvasLoaded = $state(false);

  onMount(() => {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    setTimeout(() => {
      canvasLoaded = true;
    }, 100);
  });

  // Generate preview image path if not provided
  const getPreviewPath = (modelPath) => {
    if (previewImage) return previewImage;
    
    // Convert model path to preview path
    // e.g., '/models/hupey-cloud.gltf' -> '/images/previews/hupey-cloud.png'
    const modelName = modelPath.split('/').pop().replace('.gltf', '');
    return `/images/previews/${modelName}.png`;
  };

  const previewPath = getPreviewPath(modelURL);
</script>

<div class="w-full h-full relative">
  {#if isMobile && previewImage !== false}
    <!-- Mobile: Show high-quality PNG preview -->
    <div class="w-full h-full flex items-center justify-center bg-gradient-to-b from-transparent to-black/10">
      <img 
        src={previewPath} 
        {alt}
        class="max-w-full max-h-full object-contain"
        loading="lazy"
        onerror={(e) => {
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
      />
      <!-- Fallback if image fails to load -->
      <div class="hidden w-full h-full items-center justify-center text-white text-4xl opacity-50">
        ☁️
      </div>
    </div>
  {:else}
    <!-- Desktop: Show 3D model -->
    {#if canvasLoaded}
      <Canvas>
        <Model
          {modelURL}
          {scale}
          {position}
          {cameraPosition}
          {rotationY}
          {rotator}
          {oscillator}
        />
      </Canvas>
    {:else}
      <!-- Loading state -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-white text-4xl animate-pulse">☁️</div>
      </div>
    {/if}
  {/if}
</div>