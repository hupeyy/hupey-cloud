<script>
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/Scene.svelte';
  import Project from '$lib/components/Project.svelte';
  import Resume from '$lib/components/Resume.svelte';
</script>

<div class="flex flex-col h-screen pt-30 bg-[var(--blue)]">
  <div class="flex flex-col h-full">
    <div class="flex">
      <Canvas>
        <Scene object="avatar" />
      </Canvas>
    </div>
    <div class="flex grow flex-col text-center text-white justify-center bg-[var(--blue)] p-6">
      <div class="text-4xl mb-4">
        About Me
      </div>
      <div class="text-lg max-w-2xl mx-auto">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam animi aut molestiae nemo quos obcaecati quidem perferendis reiciendis minima, suscipit sit qui sed magnam laborum fugit placeat, facilis voluptates error.
      </div>
    </div>
  </div>
  <div class="flex grow bg-linear-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white justify-center p-6 pb-20">
    <div class="flex flex-col items-center">
      <div class="mb-4 text-4xl">Projects</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <Project name="Hupey Cloud" description="A cloud platform for developers." modelURL="/models/hupey-cloud.gltf" projectURL="https://hupey.cloud" />
        <Project name="Another Project" description="Description of another project." modelURL="/models/another-project.gltf" projectURL="https://example.com" reverse="true"/>
        <Project name="Yet Another Project" description="Description of yet another project." modelURL="/models/yet-another-project.gltf" projectURL="https://example.com" />
      </div>
    </div>
  </div>
  <div>
    <Resume />
  </div>
</div>