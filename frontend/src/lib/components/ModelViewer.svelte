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
    alt = 'Model preview',
    breakpoint = 768 // Screen width breakpoint for mobile/desktop switch
  } = $props();

  let isSmallScreen = $state(false);
  let isMobileDevice = $state(false);
  let canvasLoaded = $state(false);
  let windowWidth = $state(0);

  onMount(() => {
    // Detect mobile device (for touch vs mouse)
    isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Set initial window width
    windowWidth = window.innerWidth;
    // Force desktop mode for very large screens (> 1200px)
    if (windowWidth > 1200) {
      isSmallScreen = false;
    } else {
      isSmallScreen = windowWidth < breakpoint;
    }
    
    // Listen for window resize
    const handleResize = () => {
      windowWidth = window.innerWidth;
      // Force desktop mode for very large screens (> 1200px)
      if (windowWidth > 1200) {
        isSmallScreen = false;
      } else {
        isSmallScreen = windowWidth < breakpoint;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    setTimeout(() => {
      canvasLoaded = true;
    }, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Generate preview image path if not provided
  const getPreviewPath = (modelPath) => {
    if (previewImage) return previewImage;
    
    // Convert model path to preview path
    // Handle both regular models and scene.gltf models
    let modelName = modelPath.split('/').pop().replace('.gltf', '');
    
    // If it's a scene.gltf, use the folder name instead
    if (modelName === 'scene') {
      const pathParts = modelPath.split('/');
      modelName = pathParts[pathParts.length - 2]; // Get folder name
    }
    
    return `/images/previews/${modelName}.png`;
  };

  const previewPath = getPreviewPath(modelURL);
  
  // Determine if we should show preview image
  // Only show preview on small screens (< breakpoint), regardless of device type
  const shouldShowPreview = $derived(isSmallScreen && previewImage !== false);
</script>

<div class="w-full h-full relative">


  {#if shouldShowPreview}
    <!-- Small Screen: Show high-quality PNG preview -->
    <div class="w-full h-full flex items-center justify-center bg-transparent">
      <img 
        src={previewPath} 
        {alt}
        class="max-w-full max-h-full object-contain transition-opacity duration-300"
        loading="lazy"
        onerror={(e) => {
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
      />
      <!-- Fallback if image fails to load -->
      <div class="hidden w-full h-full items-center justify-center text-white text-4xl opacity-50">
        <div class="text-center">
          <div class="text-6xl mb-2">☁️</div>
          <div class="text-sm">Preview not available</div>
          <div class="text-xs mt-1 opacity-70">Expected: {previewPath.split('/').pop()}</div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Large Screen: Show 3D model -->
    <div class="w-full h-full transition-opacity duration-300">
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
    </div>
  {/if}
  

</div>