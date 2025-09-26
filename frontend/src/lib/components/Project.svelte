<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import ModelViewer from './ModelViewer.svelte';
  
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
  
  let isIOS = $state(false);

  // Device detection
  $effect(() => {
    if (browser) {
      isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  });

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
  <!-- Model Viewer with Responsive Preview Images -->
  <div class="w-full h-32 sm:h-40 md:h-48 lg:h-56 mb-4 rounded-lg overflow-hidden">
    <ModelViewer
      {modelURL}
      scale={isIOS ? scale * 0.8 : scale}
      {position}
      {rotationY}
      rotator={isHovered && !isIOS}
      alt="{name} 3D model"
      breakpoint={768}
    />
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