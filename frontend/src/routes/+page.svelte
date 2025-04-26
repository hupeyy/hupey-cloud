<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/components/Scene.svelte'
</script>

<div class="flex flex-col h-screen ">
    <div class="flex h-[65vh] bg-[var(--blue)]">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
    <div class="flex grow bg-linear-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white justify-center text-4xl">
      Take to the skys with hupey.cloud
    </div>
</div>
