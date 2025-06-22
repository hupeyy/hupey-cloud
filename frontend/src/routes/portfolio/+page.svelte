<script>
  import { Canvas } from '@threlte/core';
  import Avatar from '$lib/components/Avatar.svelte';
  import Project from '$lib/components/Project.svelte';
  import Resume from '$lib/components/Resume.svelte';


  const projects = [
    {
      name: 'hupey.cloud',
      description: 'Built a private cloud server using Raspberry Pi 5 for hosting applications and secure file storage. Configured Nginx with Cloudflare tunnels and Docker containerization.',
      modelURL: '/models/hupey-cloud.gltf',
      projectURL: 'https://hupey.cloud',
    },
    {
      name: 'ColorCoding',
      description: 'Led a 4-person Svelte and Firebase application development team using Agile Scrum. Created database schema and developer tools with code review practices.',
      modelURL: '',
      projectURL: '#',
    },
    {
      name: 'Connect 4 AI',
      description: 'Engineered a full-stack Connect 4 game with AI opponent using Svelte frontend and Go backend. Implemented alpha-beta pruning algorithm for strategic gameplay.',
      modelURL: '/models/connect4-ai.gltf',
      projectURL: '#',
    },
    {
      name: 'AIDE',
      description: 'Designed a tree-based UI for large language models to enhance dialogue navigation and context management. Integrated SGLang for improved performance.',
      modelURL: '',
      projectURL: '#',
    },
    {
      name: 'ColorStack UF Website',
      description: 'Led development of an interactive About page with LinkedIn integration and responsive design. Collaborated with design team for pixel-perfect implementation.',
      modelURL: '',
      projectURL: '#',
    },
    {
      name: 'Blockchain Coin Alert System',
      description: 'Developed a blockchain monitoring system for tracking cryptocurrency across multiple chains. Engineered caching system supporting Ethereum, Base, and Solana.',
      modelURL: '',
      projectURL: '#',
    }
  ];
  
</script>

<div class="flex flex-col min-h-screen pt-12 sm:pt-16 md:pt-20 lg:pt-24 bg-[var(--blue)]">
  <!-- Canvas Section -->
  <div class="flex-shrink-0">
    <div class="flex h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem]">
      <Canvas>
        <Avatar />
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
