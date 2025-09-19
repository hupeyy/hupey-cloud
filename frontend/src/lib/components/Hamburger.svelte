<script>
  import { slide, fly } from 'svelte/transition';
  import Button from "./ui/button/button.svelte";
  
  let isOpen = false;
  
  function toggleMenu() {
    isOpen = !isOpen;
  }
  
  function closeMenu() {
    isOpen = false;
  }
  
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  }
</script>

<!-- Header with Hamburger Button -->
<div class="fixed flex flex-row-reverse w-full h-20 bg-transparent top-0 z-50 py-6 px-8">
  <Button 
    variant="cloud"
    onclick={toggleMenu}
    class="relative z-50"
    aria-label="Toggle navigation menu"
  >
  
  <!-- Animated Hamburger Icon -->
  <div class="w-6 h-6 relative flex flex-col justify-center items-center">
    <span class="absolute w-6 h-0.5 bg-current transition-all duration-300 {isOpen ? 'rotate-45' : '-translate-y-2'}"></span>
    <span class="absolute w-6 h-0.5 bg-current transition-all duration-300 {isOpen ? 'opacity-0' : 'opacity-100'}"></span>
    <span class="absolute w-6 h-0.5 bg-current transition-all duration-300 {isOpen ? '-rotate-45' : 'translate-y-2'}"></span>
  </div>


  </Button>
</div>

{#if isOpen}
  <!-- Mobile Dropdown Menu - Slides down -->
  <nav
    class="md:hidden fixed pt-20 top-0 left-0 right-0 bg-white text-[var(--pink)] shadow-lg z-40 overflow-hidden"
    transition:slide={{ duration: 300 }}
  >
    <div class="block px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-black">Menu</h2>
      <a href="/" class="block px-6 py-4 hover:bg-gray-100 transition-colors" on:click={closeMenu}>Home</a>
      <a href="/portfolio" class="block px-6 py-4 hover:bg-gray-100 transition-colors" on:click={closeMenu}>Portfolio</a>
    </div>
  </nav>

  <!-- Desktop Sidebar with Backdrop -->
  <div class="hidden md:block">
    <!-- Backdrop for desktop -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div 
      class="fixed inset-0 bg-black/50 z-40"
      on:click={handleBackdropClick}
    ></div>
    
    <!-- Menu Panel - Slides in from right -->
    <div 
      class="fixed z-40 bg-white text-[var(--pink)] top-0 right-0 h-full w-80 shadow-2xl"
      transition:fly={{ x: 320, duration: 300 }}
    >
      <!-- Menu Header -->
      <div class="flex justify-between items-center text-black p-8 border-b border-gray-200">
        <h2 class="text-xl font-bold">Menu</h2>
      </div>
      
      <!-- Navigation Links -->
      <nav class="flex flex-col p-8 space-y-4">
        <a 
          href="/" 
          class="text-base py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
          on:click={closeMenu}
        >
          Home
        </a>
        <a 
          href="/portfolio" 
          class="text-base py-3 px-4 hover:bg-gray-100 rounded-lg transition-colors"
          on:click={closeMenu}
        >
          Portfolio
        </a>
      </nav>
    </div>
  </div>
{/if}

<!-- Global keyboard handler -->
<svelte:window on:keydown={(e) => e.key === 'Escape' && closeMenu()} />

