<script>
  import { Canvas } from '@threlte/core'
	import Model from '$lib/components/Model.svelte';
</script>

<div class="flex flex-col min-h-screen pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[var(--blue)]">
  <div class="flex flex-col h-screen">
      <div class="flex-shrink-0">
        <div class="flex h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem]">
          <Canvas>
            <Model
              scale={2}
              cameraPosition={[7, 7, 7]}
              rotationY={Math.PI}
              modelURL="/models/hupey-cloud.gltf"
            /> 
          </Canvas>
        </div>
    </div> 
      <div class="flex grow bg-linear-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight max-w-4xl">
          Take to the skys with hupey.cloud
        </h1>
      </div>
  </div>
</div>

