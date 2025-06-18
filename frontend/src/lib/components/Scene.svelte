<script>
  import HupeyCloud from "./HupeyCloud.svelte";
  import Avatar from "./Avatar.svelte";
  import { T, useThrelte } from "@threlte/core";
	import { onMount } from "svelte";
  import { Color } from "three";

  let {
    object = "cloud" // Default to "cloud" if not provided
  } = $props();

  const style = window.getComputedStyle(document.body); 
  const bgColor = style.getPropertyValue('--blue');
  const { scene } = useThrelte();
  scene.background = new Color(bgColor);
</script>


{#if object == "cloud"}
  <HupeyCloud />
{:else if object == "avatar"}
  <Avatar />
{/if}
