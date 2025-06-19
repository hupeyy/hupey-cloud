<script>
  import { T, useTask } from '@threlte/core'
  import { 
    OrbitControls,
    useGltf,
    GLTF
  } from '@threlte/extras'
  import * as THREE from 'three'
  import { onMount } from 'svelte'; 

  const modelURL = '/models/hupey-avatar.gltf'
  const hupeyAvatar = useGltf(modelURL, {
    onError: (error) => {
      console.error('Failed to load GLTF model:', error);
    }
  });
  
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, 8]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
>
  <!-- <OrbitControls /> -->
</T.PerspectiveCamera>

<T.DirectionalLight
  position={[10, 5, 3]}
  castShadow
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
  intensity={4}
/>

<T.AmbientLight
  intensity={2}
/>

<!-- GLTF Model -->
{#if $hupeyAvatar}
  <GLTF 
    url={modelURL}
    position={[0, -2, 0]}
    rotation.y={Math.PI} 
    scale={2}
  />
{/if}