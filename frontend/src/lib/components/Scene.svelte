<script>
  import HupeyCloud from "./HupeyCloud.svelte";
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";

  const style = window.getComputedStyle(document.body); 
  const bgColor = style.getPropertyValue('--blue');
  const { scene } = useThrelte();
  scene.background = new Color(bgColor);
</script>

<HupeyCloud />