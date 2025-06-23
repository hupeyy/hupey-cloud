<script>
  import { Canvas } from '@threlte/core';
  import Project from '$lib/components/Project.svelte';
  import Resume from '$lib/components/Resume.svelte';
	import Model from '$lib/components/Model.svelte';
	import { scale } from 'svelte/transition';


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
  
</script>

<div class="flex flex-col min-h-screen pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[var(--blue)]">
  <!-- Canvas Section -->
  <div class="flex-shrink-0">
    <div class="flex h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem]">
      <Canvas>
        <Model
          scale={2}
          position={[0, -2, 0]}
          rotationY={0}
          modelURL="/models/hupey-avatar.gltf"
          oscillator={true}
          rotator={true}
        />
      </Canvas>
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
        {#each projects as project, index}
          <Project
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
      </div>
    </div>
  </div>

  <!-- Resume Section -->
  <div class="flex-shrink-0">
    <Resume />
  </div>
</div>
