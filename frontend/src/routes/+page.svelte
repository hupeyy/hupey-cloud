<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/components/Scene.svelte'
  import HupeyCloud from '$lib/components/HupeyCloud.svelte'
</script>

<div class="flex flex-col h-screen">
    <div class="flex bg-[var(--blue)] pt-20">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
    <div class="flex grow bg-linear-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white justify-center text-4xl p-6">
      Take to the skys with hupey.cloud
    </div>
</div>
