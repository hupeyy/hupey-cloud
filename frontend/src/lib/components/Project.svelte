<script>
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/Scene.svelte';

  let {
    name = "Project Name",
    description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam animi aut molestiae nemo quos obcaecati quidem perferendis reiciendis minima, suscipit sit qui sed magnam laborum fugit placeat, facilis voluptates error.",
    modelURL = "/models/hupey-cloud.gltf",
    projectURL = "",
    reverse = false
  } = $props();
</script>

<div class="flex flex-col bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 h-full transition-transform hover:scale-105 duration-300">
  <!-- Canvas Container -->
  <div class="w-full h-32 sm:h-40 md:h-48 lg:h-56 mb-4 rounded-lg overflow-hidden">
    <Canvas class="w-full h-full">
      <Scene />
    </Canvas>
  </div>
  
  <!-- Content -->
  <div class="flex flex-col flex-grow">
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center">{name}</h2>
    <p class="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-relaxed text-center flex-grow opacity-90 line-clamp-4">
      {description}
    </p>
    
    {#if projectURL}
      <div class="mt-auto">
        <a 
          href={projectURL} 
          class="inline-block w-full sm:w-auto px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-center text-sm sm:text-base font-medium transition-colors duration-200 border border-white/20 hover:border-white/40"
        >
          View Project
        </a>
      </div>
    {/if}
  </div>
</div>

