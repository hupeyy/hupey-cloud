<script>
  import { onMount } from 'svelte';
  
  let visibleSections = [];
  
  onMount(() => {
    // Animate sections in on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections = [...visibleSections, entry.target.id];
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  });
</script>

<div class="w-full bg-gradient-to-b from-[var(--pink)] to-[var(--blue)] text-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 relative overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
    <div class="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500"></div>
  </div>
  
  <div class="max-w-4xl mx-auto relative z-10">
    <!-- Animated title -->
    <h1 class="text-3xl font-bold text-center mb-8 sm:text-4xl lg:text-5xl animate-fade-in">
      <span class="inline-block animate-bounce">💼</span> Resume
    </h1>
    
    <!-- Contact Info with interactive elements -->
    <div class="mb-8 text-center">
      <h2 class="text-xl font-bold mb-3 sm:text-2xl animate-fade-in">W. Alexander Huper</h2>
      <p class="text-base mb-4 sm:text-lg bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
        🚀 Software Engineer
      </p>
      <div class="grid grid-cols-2 gap-3 max-w-md mx-auto text-sm sm:text-base">
        <a href="mailto:alexanderhuper@gmail.com" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span class="text-lg">📧</span>
          <span class="hidden sm:inline">Email</span>
        </a>
        <a href="https://github.com/hupeyy" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <image src="images/github-mark/github-mark-white.png" alt="GitHub Logo" class="w-6 h-6" />
          <span class="hidden sm:inline">GitHub</span>
        </a>
        <a href="https://linkedin.com/in/alex-huper" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <image src="images/in-logo/InBug-White.png" alt="LinkedIn Logo" class="w-6 h-6" />
          <span class="hidden sm:inline">LinkedIn</span>
        </a>
        <a href="resumes/SWE/WilhelmAHuper_Resume.pdf" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span class="text-lg">📄</span>
          <span class="hidden sm:inline">Resume</span>
        </a>
      </div>
    </div>

    <!-- Education Section -->
    <section id="education" class="mb-8 {visibleSections.includes('education') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left flex items-center gap-2">
        <span class="text-2xl">🎓</span> Education
      </h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
        <div class="mb-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🏛️</span>
            <h3 class="text-lg font-semibold sm:text-xl">Bachelor's of Science in Computer Science & Minor in Mathematics</h3>
          </div>
          <p class="text-base mb-1 sm:text-lg font-medium text-blue-200">University of Florida, Gainesville, FL</p>
          <div class="text-sm text-white/80 mb-2 sm:text-base flex items-center gap-2">
            <span class="text-sm">📅</span>
            <span>Aug. 2021 – Dec. 2024</span>
            <span class="ml-4 bg-green-500/20 px-2 py-1 rounded-full text-xs">GPA: 3.3/4.0</span>
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold mb-2 sm:text-base flex items-center gap-2">
            <span class="text-lg">📚</span> Relevant Coursework:
          </p>
          <p class="text-sm leading-relaxed sm:text-base">
            Programming in Java and C++, Data Structures and Algorithms, Operating Systems, Software Engineering, Compilers, AI for Games and Virtual Environments, Multi-Modal ML in Python, UX Design, Algorithm Abstraction, Computational Linear Algebra
          </p>
        </div>
      </div>
    </section>

    <!-- Technical Skills with interactive elements -->
    <section id="skills" class="mb-8 {visibleSections.includes('skills') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left flex items-center gap-2">
        <span class="text-2xl">⚡</span> Technical Skills
      </h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 hover:bg-white/15 transition-all duration-300">
        <div>
          <p class="text-sm font-semibold mb-3 sm:text-base flex items-center gap-2">
            <span class="text-lg">💻</span> Programming Languages:
          </p>
          <div class="flex flex-wrap gap-2">
            {#each ['Python', 'C++/C#', 'Go', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS'] as skill}
              <span class="bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 cursor-default hover:scale-105">
                {skill}
              </span>
            {/each}
          </div>
        </div>
        
        <div>
          <p class="text-sm font-semibold mb-3 sm:text-base flex items-center gap-2">
            <span class="text-lg">🛠️</span> Libraries/Frameworks:
          </p>
          <div class="flex flex-wrap gap-2">
            {#each ['Svelte', 'React', 'Astro', 'Next.js', 'Three.js', 'Tailwind CSS', 'ShadcnUI', 'HTMX'] as skill}
              <span class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all cursor-default duration-300  hover:scale-105">
                {skill}
              </span>
            {/each}
          </div>
        </div>
        
        <div>
          <p class="text-sm font-semibold mb-3 sm:text-base flex items-center gap-2">
            <span class="text-lg">🔧</span> Tools:
          </p>
          <div class="flex flex-wrap gap-2">
            {#each ['Firebase', 'PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'Docker', 'AWS', 'Selenium', 'Git', 'Linux', 'Figma', 'Miro', 'Canva'] as skill}
              <span class="bg-blue-500/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-blue-500/30 transition-all duration-300 cursor-default hover:scale-105">
                {skill}
              </span>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <!-- Experience with timeline design -->
    <section id="experience" class="mb-8 {visibleSections.includes('experience') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left flex items-center gap-2">
        <span class="text-2xl">💼</span> Experience
      </h2>
      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-white/30 hidden sm:block"></div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 sm:ml-8 relative hover:bg-white/15 transition-all duration-300">
          <!-- Timeline dot -->
          <div class="absolute -left-10 top-6 w-3 h-3 bg-white rounded-full hidden sm:block animate-pulse"></div>
          
          <div class="mb-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">🤖</span>
              <h3 class="text-lg font-semibold sm:text-xl">Software Engineer Intern</h3>
            </div>
            <p class="text-base mb-1 sm:text-lg font-medium text-blue-200">Every Flavor Robotics</p>
            <div class="text-sm text-white/80 mb-3 sm:text-base flex items-center gap-2">
              <span class="text-sm">📅</span>
              <span>May 2024 - Aug. 2024</span>
              <span class="text-sm">📍</span>
              <span>Denver, CO</span>
            </div>
          </div>
          <ul class="space-y-3 text-sm sm:text-base">
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-green-400 mt-1">✨</span>
              Built Dalia, an AI cooking assistant (Python / TogetherAI / Edamam) for personalized recipes & meal planning.
            </li>
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-yellow-400 mt-1">⚡</span>
              Trained Dalia utilizing few-shot learning & context pruning, achieving 36% memory reduction & 1.8s queries.
            </li>
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-purple-400 mt-1">🚀</span>
              Modernized Gourmet For Good's CaterMatrix to Astro/HTMX, introducing custom dashboards & staff updates.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Community & Leadership Section -->
    <section id="leadership" class="mb-8 {visibleSections.includes('leadership') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left flex items-center gap-2">
        <span class="text-2xl">🌟</span> Community & Leadership
      </h2>
      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-white/30 hidden sm:block"></div>
        
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 sm:ml-8 relative hover:bg-white/15 transition-all duration-300">
          <!-- Timeline dot -->
          <div class="absolute -left-10 top-6 w-3 h-3 bg-white rounded-full hidden sm:block animate-pulse"></div>
          
          <div class="mb-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">👥</span>
              <h3 class="text-lg font-semibold sm:text-xl">Mentorship Coordinator</h3>
            </div>
            <p class="text-base mb-1 sm:text-lg font-medium text-blue-200">ColorStack UF</p>
            <div class="text-sm text-white/80 mb-3 sm:text-base flex items-center gap-2">
              <span class="text-sm">📅</span>
              <span>Mar. 2024 - Apr. 2025</span>
            </div>
          </div>
          <ul class="space-y-3 text-sm sm:text-base">
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-orange-400 mt-1">🚀</span>
              Founder of Internal Projects initiative gathering 4 project leads and 15+ interns concurrently building 3 projects.
            </li>
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-blue-400 mt-1">📈</span>
              Designed 3 skill-building initiatives, enhancing programming proficiency for 10+ ColorStack members.
            </li>
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-green-400 mt-1">🌱</span>
              Grew the UF chapter to more than 400 members in its inaugural year, establishing a strong community presence.
            </li>
            <li class="flex items-start gap-3 leading-relaxed hover:bg-white/5 p-2 rounded transition-colors">
              <span class="text-purple-400 mt-1">🎯</span>
              Created mentorship programs for 20+ members, enhancing career prep and contributing to 5 job offer successes.
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  
  /* Custom scrollbar */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  /* Ensure sections start invisible */
  section {
    transition: all 0.3s ease;
  }
</style>
