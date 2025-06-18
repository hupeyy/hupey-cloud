<script>
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/Scene.svelte';
</script>

<div class="flex flex-col h-screen">
  <div class="flex h-[65vh] bg-[var(--blue)]">
    <div class="flex col w-full p-12 gap-4">
      <div class="flex h-full w-full">
        <div class="flex flex-col w-full h-full justify-center">
          <h1 class="text-4xl text-white font-bold">About Me</h1>
          <p class="text-lg text-white mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Tempora quas cupiditate assumenda cum obcaecati quis pariatur, rem facilis porro, impedit consequatur repudiandae voluptate voluptatum consequuntur!
            Porro, dolor? 
            Eos, blanditiis perferendis.
          </p>
        </div>
      </div>
      <div class="flex h-full w-full align-center justify-center">
        <!-- Replace with new Graphic -->
        <Canvas>
          <Scene object="avatar" />
        </Canvas> 
      </div>
    </div>
  </div>
  <div class="flex grow bg-linear-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white justify-center text-4xl">
  </div>
</div>