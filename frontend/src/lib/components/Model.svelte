<script>
  import { T, useTask } from '@threlte/core'
  import { useGltf } from '@threlte/extras'
  import * as THREE from 'three'
  import { onMount } from 'svelte'

  let {
    scale = 2,
    position = [0, -2, 0],
    cameraPosition = [0, 0, 8],
    modelURL = '/models/hupey-cloud.gltf',
    previewImage = null, // PNG preview for mobile
    rotationY = 0,
    rotator = false,
    oscillator = false
  } = $props();

  let rotationAnimation = $state(rotationY);
  let oscillatorTime = $state(0);
  let positionY = $state(position[1]);
  let wasRotating = $state(false);

  // Load the model
  const model = useGltf(modelURL, {
    onError: (error) => {
      console.error('Failed to load GLTF model:', error);
    }
  });

  // Animation task
  useTask((delta) => {
    // When rotator starts, initialize animation from current rotation
    if (rotator && !wasRotating) {
      rotationAnimation = rotationY;
      wasRotating = true;
    }
    
    // When rotator stops, reset the flag
    if (!rotator && wasRotating) {
      wasRotating = false;
    }

    if (rotator) {
      rotationAnimation += delta * 0.5;
    }
    
    if (oscillator) {
      oscillatorTime += delta;
      positionY = position[1] + Math.sin(oscillatorTime) * 0.5;
    }
  });

  // Calculate final rotation Y value
  const finalRotationY = $derived(rotator ? rotationAnimation : rotationY);
</script>

<T.PerspectiveCamera
  makeDefault
  position={cameraPosition}
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

{#if model && $model}
  <T is={$model.scene}
    position={[position[0], oscillator ? positionY : position[1], position[2]]}
    rotation={[0, finalRotationY, 0]}
    scale={scale}
  />
{/if}
