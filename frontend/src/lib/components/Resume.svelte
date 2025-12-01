<script>
  import { onMount } from 'svelte';
  
  let visibleSections = [];
  
  onMount(() => {
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
  <div class="max-w-4xl mx-auto relative z-10">
    <h1 class="text-3xl font-bold text-center mb-8 sm:text-4xl lg:text-5xl animate-fade-in">
      Resume
    </h1>
    
    <!-- Contact Info -->
    <div class="mb-8 text-center">
      <h2 class="text-xl font-bold mb-3 sm:text-2xl animate-fade-in">W. Alexander Huper</h2>
      <p class="text-base mb-4 sm:text-lg bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
        Software Engineer
      </p>
      <div class="grid grid-cols-2 gap-3 max-w-md mx-auto text-sm sm:text-base">
        <a href="mailto:alexanderhuper@gmail.com" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span>Email</span>
        </a>
        <a href="https://github.com/hupeyy" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span>GitHub</span>
        </a>
        <a href="https://linkedin.com/in/alex-huper" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span>LinkedIn</span>
        </a>
        <a href="resume/resume.pdf" target="_blank"
           class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300 hover:scale-105">
          <span>Resume</span>
        </a>
      </div>
    </div>

    <!-- Education Section -->
    <section id="education" class="mb-8 {visibleSections.includes('education') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left">Education</h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
        <h3 class="text-lg font-semibold sm:text-xl">Bachelor of Science in Computer Science & Minor in Mathematics</h3>
        <p class="text-base mb-1 sm:text-lg font-medium text-blue-200">University of Florida, Gainesville, FL</p>
        <div class="text-sm text-white/80 mb-2 sm:text-base flex items-center gap-2">
          <span>Aug. 2021 – Dec. 2024</span>
          <span class="ml-4 bg-green-500/20 px-2 py-1 rounded-full text-xs">GPA: 3.3/4.0</span>
        </div>
        <p class="text-sm leading-relaxed sm:text-base">
          Relevant Coursework: Data Structures & Algorithms, Operating Systems, Software Engineering, Compilers, AI for Games, Multi-Modal ML in Python, UX Design, Computational Linear Algebra
        </p>
      </div>
    </section>

    <!-- Technical Skills -->
    <section id="skills" class="mb-8 {visibleSections.includes('skills') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left">Technical Skills</h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 hover:bg-white/15 transition-all duration-300">
        <p class="text-sm font-semibold sm:text-base">Programming Languages:</p>
        <div class="flex flex-wrap gap-2">
          {#each ['JavaScript', 'TypeScript', 'Python', 'C++/C#', 'Golang', 'Java', 'MATLAB', 'SQL', 'HTML/CSS'] as skill}
            <span class="bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-white/30 transition-all duration-300 cursor-default hover:scale-105">{skill}</span>
          {/each}
        </div>
        <p class="text-sm font-semibold sm:text-base">Libraries/Frameworks:</p>
        <div class="flex flex-wrap gap-2">
          {#each ['Svelte', 'ReactJS', 'Astro', 'NextJS', 'ThreeJS', 'NodeJS', 'TailwindCSS', 'ShadcnUI', 'Alpine.js', 'HTMX'] as skill}
            <span class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-default hover:scale-105">{skill}</span>
          {/each}
        </div>
        <p class="text-sm font-semibold sm:text-base">Tools:</p>
        <div class="flex flex-wrap gap-2">
          {#each ['Firebase', 'PostgreSQL', 'MySQL', 'MongoDB', 'MariaDB', 'Docker', 'AWS', 'Selenium', 'Git', 'Linux', 'Figma', 'Miro', 'Canva'] as skill}
            <span class="bg-blue-500/20 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-blue-500/30 transition-all duration-300 cursor-default hover:scale-105">{skill}</span>
          {/each}
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section id="experience" class="mb-8 {visibleSections.includes('experience') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left">Experience</h2>
      <div class="space-y-6">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
          <h3 class="text-lg font-semibold sm:text-xl">Web Developer - Every Flavor Robotics (Remote)</h3>
          <p class="text-sm text-white/80 mb-2 sm:text-base">Apr. 2025 - Sep. 2025</p>
          <ul class="list-disc list-inside text-sm sm:text-base space-y-1">
            <li>Contributed to CaterLynx v1.1 development, building customer-facing features for catering management platform.</li>
            <li>Built dynamic email template editor with Astro and Alpine.js, eliminating manual drafting processes.</li>
            <li>Implemented dynamic templating with database integration for personalized customer content.</li>
            <li>Engineered Driver Management Suite with availability calendar & automated scheduling workflows.</li>
          </ul>
        </div>

        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
          <h3 class="text-lg font-semibold sm:text-xl">Software Engineer Intern - Every Flavor Robotics (Denver, CO)</h3>
          <p class="text-sm text-white/80 mb-2 sm:text-base">May 2024 - Aug. 2024</p>
          <ul class="list-disc list-inside text-sm sm:text-base space-y-1">
            <li>Built Dalia, an AI cooking assistant (Python / TogetherAI / Edamam) for personalized recipes & meal planning.</li>
            <li>Trained Dalia using few-shot learning & context pruning, reducing memory usage by 36% and queries to 1.8s.</li>
            <li>Modernized Gourmet For Good's CaterMatrix to Astro/Alpine.js, introducing dashboards & staff updates.</li>
            <li>Conducted customer interviews and user research to optimize platform usability.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Community & Leadership -->
    <section id="leadership" class="mb-8 {visibleSections.includes('leadership') ? 'animate-slide-up' : 'opacity-0'}">
      <h2 class="text-xl font-bold mb-4 text-center sm:text-2xl sm:text-left">Community & Leadership</h2>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 hover:bg-white/15 transition-all duration-300">
        <h3 class="text-lg font-semibold sm:text-xl">Mentorship Coordinator - ColorStack UF</h3>
        <p class="text-sm text-white/80 mb-2 sm:text-base">Mar. 2024 - Apr. 2025</p>
        <ul class="list-disc list-inside text-sm sm:text-base space-y-1">
          <li>Founded Internal Projects initiative gathering 4 project leads and 15+ interns concurrently building 3 projects.</li>
          <li>Designed 3 skill-building initiatives enhancing programming proficiency for 10+ members.</li>
          <li>Grew UF chapter to 400+ members, establishing a strong community presence.</li>
          <li>Created mentorship programs for 20+ members, supporting career prep and 5 job offer successes.</li>
        </ul>
      </div>
    </section>

  </div>
</div>

<style>
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
  .animate-fade-in { animation: fade-in 0.8s ease-out; }

  :global(html) { scroll-behavior: smooth; }
  section { transition: all 0.3s ease; }
</style>
