<script>
  import Button from "./ui/button/button.svelte";
</script>
<div  class="fixed flex flex-row-reverse w-full h-20 bg-transparent top-0 z-2 py-6 px-8">
  <Button 
    variant="secondary"
    onclick={() => {
      window.location.href = "portfolio";
    }}
  >
    hamborger
  </Button>
</div>