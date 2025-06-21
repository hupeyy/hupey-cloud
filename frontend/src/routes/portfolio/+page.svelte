<script>
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/Scene.svelte';
  import Project from '$lib/components/Project.svelte';
  import Resume from '$lib/components/Resume.svelte';
</script>

<div class="flex flex-col min-h-screen pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[var(--blue)]">
  <!-- Canvas Section -->
  <div class="flex-shrink-0">
    <div class="flex h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem]">
      <Canvas>
        <Scene object="avatar" />
      </Canvas>
    </div>
  </div>

  <!-- About Section -->
  <div class="flex-shrink-0 flex flex-col text-center text-white justify-center bg-[var(--blue)] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
    <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6">
      About Me
    </div>
    <div class="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam animi aut molestiae nemo quos obcaecati quidem perferendis reiciendis minima, suscipit sit qui sed magnam laborum fugit placeat, facilis voluptates error.
    </div>
  </div>

  <!-- Projects Section -->
  <div class="flex-grow bg-gradient-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
    <div class="flex flex-col items-center max-w-7xl mx-auto">
      <div class="mb-6 sm:mb-8 md:mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl">Projects</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
        {#each Array(6) as _, index}
          <Project
            name="Project Name"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam animi aut molestiae nemo quos obcaecati quidem perferendis reiciendis minima, suscipit sit qui sed magnam laborum fugit placeat, facilis voluptates error."
            modelURL="/models/hupey-cloud.gltf"
            projectURL="#"
            reverse={index % 2 === 0}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Resume Section -->
  <div class="flex-shrink-0">
    <Resume />
  </div>
</div>
