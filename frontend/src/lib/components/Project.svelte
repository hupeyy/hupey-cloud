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

<div class="flex" class:flex-row={!reverse} class:flex-row-reverse={reverse}>
  <div class="flex flex-col w-1/2 p-6">
    <h2 class="text-2xl font-bold mb-4">{name}</h2>
    <p class="text-md mb-4">{description}</p>
    {#if projectURL}
      <a href={projectURL} class="text-blue-500 hover:underline">
        View Project
      </a>
    {/if}
  </div>
  <div>
    <Canvas>
      <Scene />
    </Canvas>
  </div>
</div>
