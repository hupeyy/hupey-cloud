<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Resume from '$lib/components/Resume.svelte';
  
  let CanvasComponent = $state();
  let ModelComponent = $state();
  let ProjectComponent = $state();
  let shouldLoadHero = $state(false);
  let isIOS = $state(false);

  const projects = [
    {
      name: 'hupey.cloud',
      description: 'Built a private cloud server using Raspberry Pi 5 for hosting applications (like this one!) and secure file storage.',
      modelURL: '/models/hupey-cloud.gltf',
      rotationY: Math.PI
    },
    {
      name: 'ColorCoding',
      description: 'A programming competition platform designed to enhance coding skills through gamified challenges for ColorStack UF students. Developed using SvelteKit and Go, featuring real-time code execution and leaderboard.',
      modelURL: '/models/computer/scene.gltf',
      projectURL: 'https://github.com/hupeyy/ColorCoding',
      position: [0, -1, 0],
      scale: 1/20
    },
    {
      name: 'Connect 4 AI',
      description: 'Classic Connect 4 game with AI opponent using Svelte frontend and Go backend. Implemented alpha-beta pruning algorithm for strategic gameplay.',
      modelURL: '/models/connect_4/scene.gltf',
      projectURL: 'https://github.com/hupeyy/AI-Connect4',
      scale: 1/2
    },
    {
      name: 'AIDE',
      description: 'A tree-based UI for large language models to enhance dialogue navigation and context management. Integrated SGLang for improved performance.',
      modelURL: '/models/robot/scene.gltf',
      projectURL: 'https://aide.zy-j.com',
      position: [0, 0, 0],
      scale: 1/32
    },
    {
      name: 'ColorStack UF Website',
      description: 'Official website for ColorStack UF, a community for underrepresented students in tech. Developed using SvelteKit and Tailwind CSS.',
      modelURL: '/models/colorstack.gltf',
      projectURL: 'https://uf.colorstack.org',
      position: [0, -2, 0],
      scale: 3
    },
    {
      name: 'Blockchain Coin Alert System',
      description: 'A blockchain monitoring system for tracking cryptocurrency across multiple chains. Engineered caching system supporting Ethereum, Base, and Solana.',
      modelURL: '/models/crypto/scene.gltf',
      position: [0, 0, 0],
      scale: 3 
    }
  ];
 

  $effect(() => {
    if (browser) {
      isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  });

  onMount(async () => {
    // Load hero components first
    try {
      const [{ Canvas }, ModelModule, ProjectModule] = await Promise.all([
        import('@threlte/core'),
        import('$lib/components/Model.svelte'),
        import('$lib/components/Project.svelte'),
      ]);
      
      CanvasComponent = Canvas;
      ModelComponent = ModelModule.default;
      ProjectComponent = ProjectModule.default;
      
      // Stagger hero loading based on device
      setTimeout(() => {
        shouldLoadHero = true;
      }, isIOS ? 500 : 100);
      
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  });
</script>

<div class="flex flex-col min-h-screen pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[var(--blue)]">
  <!-- Hero Canvas Section with Lazy Loading -->
  <div class="flex-shrink-0">
    <div class="flex h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] relative">
      {#if shouldLoadHero && CanvasComponent && ModelComponent}
        <CanvasComponent>
          <ModelComponent 
            scale={isIOS ? 1.5 : 2}
            position={[0, -2, 0]}
            rotationY={0}
            modelURL="/models/hupey-avatar.gltf"
            oscillator={!isIOS}
            rotator={true}
          />
        </CanvasComponent>
      {:else}
        <!-- Hero loading state -->
        <div class="w-full h-full bg-gradient-to-b from-[var(--blue)] to-[var(--blue)]/80 flex items-center justify-center">
          <div class="text-white text-xl sm:text-2xl md:text-3xl animate-pulse">
            Loading...
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- About Section -->
  <div class="flex-shrink-0 flex flex-col text-center text-white justify-center bg-[var(--blue)] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
    <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6">
      About Me
    </div>
    <div class="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
      Hello, my name is Hupey and I am a software engineer with a passion for building innovative applications. As a full-stack developer, I enjoy working on both the frontend and backend of projects, creating seamless user experiences and robust server-side functionality.
      My passions apart from software engineering include thrifting, baking, and playing basketball.
    </div>
  </div>

  <!-- Projects Section -->
  <div class="flex-grow bg-gradient-to-b from-[var(--blue)] to-[var(--pink)] text-center text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
    <div class="flex flex-col items-center max-w-7xl mx-auto">
      <div class="mb-6 sm:mb-8 md:mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl">Projects</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
        {#if ProjectComponent}
          {#each projects as project, index}
            <ProjectComponent 
              name={project.name}
              description={project.description}
              modelURL={project.modelURL}
              projectURL={project.projectURL}
              scale={project.scale}
              rotationY={project.rotationY}
              position={project.position}
              onhover={project.rotator ? true : false}
            />
          {/each}
        {:else}
          <!-- Project loading placeholders -->
          {#each Array(6) as _, index}
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 h-80 animate-pulse">
              <div class="w-full h-32 sm:h-40 bg-white/5 rounded-lg mb-4"></div>
              <div class="h-6 bg-white/5 rounded mb-3"></div>
              <div class="h-4 bg-white/5 rounded mb-2"></div>
              <div class="h-4 bg-white/5 rounded w-3/4"></div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>

  <!-- Resume Section -->
  <div class="flex-shrink-0">
    <Resume />
  </div>
</div>