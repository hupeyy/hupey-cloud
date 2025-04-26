<script>
  import HupeyCloud from "./HupeyCloud.svelte";
  import { T, useThrelte } from "@threlte/core";
  import { Color } from "three";

  const { scene } = useThrelte();
  scene.background = new Color('white');
</script>

<HupeyCloud />