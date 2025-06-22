<script>
  import { T, useTask } from '@threlte/core'
  import { 
    OrbitControls,
    useGltf
  } from '@threlte/extras'
  import * as THREE from 'three'

  let {
    scale = 2,
    position = [0, -2, 0],
    modelURL = '/models/hupey-cloud.gltf'
  } = $props();

  let rotation = $state(0);
  let positionY = $state(-2);

  const model = useGltf(modelURL, {
    onError: (error) => {
      console.error('Failed to load GLTF model:', error);
    }
  });

  useTask((delta) => {
    rotation += delta * 0.5;
    positionY = -2 + Math.sin(rotation) * 0.5;
  });
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 0, 8]}
  oncreate={(ref) => {
    ref.lookAt(0, 0, 0)
  }}
>
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
{#if $model}
  <T is={$model.scene}
    position={[position[0], positionY, position[2]]}
    rotation={[0, rotation, 0]}
    scale={scale}
  />
{/if}
