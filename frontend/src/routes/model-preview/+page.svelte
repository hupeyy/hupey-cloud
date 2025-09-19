<script>
  import { page } from '$app/stores';
  import { Canvas } from '@threlte/core';
  import Model from '$lib/components/Model.svelte';
  
  const modelURL = $derived($page.url.searchParams.get('model') || '/models/hupey-cloud.gltf');
</script>

<svelte:head>
  <title>Model Preview</title>
</svelte:head>

<div class="w-screen h-screen bg-gray-900 flex items-center justify-center">
  <div class="w-full h-full max-w-4xl">
    <Canvas>
      <Model 
        scale={2}
        position={[0, -2, 0]}
        rotationY={0}
        modelURL={modelURL}
        oscillator={false}
        rotator={false}
      />
    </Canvas>
  </div>
</div>
