<script>
  import { T, useTask } from '@threlte/core'
  import { 
    OrbitControls,
    useGltf,
    GLTF
  } from '@threlte/extras'
  import * as THREE from 'three'
  import { onMount } from 'svelte'; 

  // Load the GLTF model with error handling
  const hupeyCloud = useGltf('/models/hupey-cloud.gltf', {
    onError: (error) => {
      console.error('Failed to load GLTF model:', error);
    }
  });

  // Log when the model is loaded
  $: if ($hupeyCloud) {
    console.log('GLTF model loaded successfully:', $hupeyCloud);
  }
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
  position={[0, 10, 10]}
  castShadow
/>

<T.AmbientLight
  intensity={0.5}
/>

<!-- GLTF Model -->
{#if $hupeyCloud}
  <GLTF 
    url="/models/hupey-cloud.gltf"
    position={[0, 0, 0]}
    
  />
{:else}
  <T.Mesh position={[0, 2, 0]}>
    <T.SphereGeometry args={[0.5, 16, 16]} />
    <T.MeshStandardMaterial color="red" />
  </T.Mesh>
{/if}
