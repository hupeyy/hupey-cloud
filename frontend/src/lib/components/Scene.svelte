<script>
  import HupeyCloud from "./HupeyCloud.svelte";
  import Avatar from "./Avatar.svelte";
  import { T, useThrelte } from "@threlte/core";
	import { onMount } from "svelte";
  import { Color } from "three";

  let {
    object = "cloud" // Default to "cloud" if not provided
  } = $props();

  const { scene } = useThrelte();
  scene.background = null;
</script>


{#if object == "cloud"}
  <HupeyCloud />
{:else if object == "avatar"}
  <Avatar />
{/if}
