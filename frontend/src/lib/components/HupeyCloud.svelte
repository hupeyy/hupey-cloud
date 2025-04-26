<script>
  import { T, useTask } from '@threlte/core'
  import { 
    OrbitControls,
    useGltf,
    GLTF
  } from '@threlte/extras'
  import * as THREE from 'three'
  import { onMount } from 'svelte'; 

  const hupeyCloud = useGltf('/models/hupey-cloud.gltf', {
    onError: (error) => {
      console.error('Failed to load GLTF model:', error);
    }
  });
  
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
>
  <!-- <OrbitControls /> -->
</T.PerspectiveCamera>

<T.DirectionalLight
  position={[10, 5, 0]}
  castShadow
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
  intensity={4}
/>

<T.AmbientLight
  intensity={1}
/>

<!-- GLTF Model -->
{#if $hupeyCloud}
  <GLTF 
    url="/models/hupey-cloud.gltf"
    position={[0, 0, 0]}
    rotation.y={Math.PI} 
  />
{/if}