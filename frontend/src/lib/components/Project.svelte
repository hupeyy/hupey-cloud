<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  
  let {
    name = "Project Name",
    description = "Lorem ipsum...",
    fullDescription = "",
    modelURL = "/models/hupey-cloud.gltf",
    projectURL = "",
    position = [0, -2, 0],
    scale = 1.5,
    rotationY = 0,
    rotator = false
  } = $props();

  let expanded = $state(false);
  let showExpandButton = $state(false);
  let textElement = $state();
  let isHovered = $state(false);
  
  // Lazy loading states
  let canvasContainer = $state();
  let shouldRenderCanvas = $state(false);
  let isIOS = $state(false);
  let CanvasComponent = $state();
  let ModelComponent = $state();

  // Device detection and capability assessment
  $effect(() => {
    if (browser) {
      isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  });

  onMount(async () => {
    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCanvas();
          observer.disconnect();
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px' // Start loading slightly before visible
    });

    if (canvasContainer) {
      observer.observe(canvasContainer);
    }

    return () => observer.disconnect();
  });

  async function loadCanvas() {
    try {
      // Dynamic imports for better code splitting
      const [{ Canvas }, ModelModule] = await Promise.all([
        import('@threlte/core'),
        import('$lib/components/Model.svelte')
      ]);
      
      CanvasComponent = Canvas;
      ModelComponent = ModelModule.default;
      
      // Add slight delay on iOS for better performance
      setTimeout(() => {
        shouldRenderCanvas = true;
      }, isIOS ? 300 : 0);
      
    } catch (error) {
      console.error('Failed to load 3D components:', error);
      // Fallback to static image
      shouldRenderCanvas = false;
    }
  }

  // Check if text is truncated
  $effect(() => {
    if (textElement) {
      showExpandButton = textElement.scrollHeight > textElement.clientHeight;
    }
  });

  function toggleExpanded() {
    expanded = !expanded;
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div 
  class="flex flex-col bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 h-full transition-transform hover:scale-105 duration-300"
  role="region"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  <!-- Canvas Container with Lazy Loading -->
  <div 
    bind:this={canvasContainer}
    class="w-full h-32 sm:h-40 md:h-48 lg:h-56 mb-4 rounded-lg overflow-hidden relative"
  >
    {#if shouldRenderCanvas && CanvasComponent && ModelComponent}
      <CanvasComponent class="w-full h-full">
        <ModelComponent
          scale={isIOS ? scale * 0.8 : scale}
          position={position} 
          rotationY={rotationY}
          modelURL={modelURL}
          rotator={isHovered && !isIOS}
        />
      </CanvasComponent>
    {:else}
      <!-- Loading state with static fallback -->
      <div class="w-full h-full bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center relative overflow-hidden">
        <!-- Static preview image if available -->
        <img 
          src="/images/models/{name.toLowerCase().replace(/\s+/g, '-')}.webp" 
          alt="{name} preview"
          class="w-full h-full object-cover"
          loading="lazy"
          onerror={(e) => e.target.style.display = 'none'}
        />        
        <!-- Fallback loading animation -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
        </div>
        
        <!-- Shimmer effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>
    {/if}
  </div>
  
  <!-- Rest of component remains the same -->
  <div class="flex flex-col flex-grow">
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center">{name}</h2>
    
    <div class="mb-4 sm:mb-6 text-center flex-grow">
      <p 
        bind:this={textElement}
        class="text-xs sm:text-sm md:text-base leading-relaxed opacity-90 {expanded ? '' : 'line-clamp-4'}"
      >
        {expanded && fullDescription ? fullDescription : description}
      </p>
      
      {#if (fullDescription && fullDescription !== description) || showExpandButton}
        <button 
          onclick={toggleExpanded}
          class="cursor-pointer mt-2 text-white/70 hover:text-white text-xs sm:text-sm underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-1 transition-colors duration-200"
          aria-label={expanded ? 'Show less' : 'Show more'}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      {/if}
    </div>
    
    {#if projectURL}
      <div class="mt-auto">
        <a 
          href={projectURL} 
          target="_blank"
          class="inline-block w-full sm:w-auto px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-center text-sm sm:text-base font-medium transition-colors duration-200 border border-white/20 hover:border-white/40"
        >
          View Project
        </a>
      </div>
    {/if}
  </div>
</div>