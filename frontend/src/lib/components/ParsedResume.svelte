<script>
  import { onMount } from 'svelte';
  
  let renderedHTML = '';

  onMount(async () => {
    try {
      await loadLaTeXJS();
      console.log('LaTeX.js loaded successfully');
      const response = await fetch('resume/sample.tex');
      const latexText = await response.text();

      console.log('LaTeX document fetched successfully');
      console.log('window.latexjs:', window.latexjs);
      if (window.latexjs) {
        const { parse, HtmlGenerator } = window.latexjs;
        console.log('LaTeX.js components:', { parse, HtmlGenerator });

        // Create the generator with proper options for browser environment
        const generator = new HtmlGenerator({ 
          hyphenate: false,
        });
        console.log('HtmlGenerator created:', generator);
        
        // Parse the LaTeX content
        let parsed = parse(latexText, { generator: generator }).htmlDocument();
        console.log('LaTeX parsed:', parsed);
        console.log('LaTeX parsed successfully');

        // Get the HTML output
        renderedHTML = parsed.documentElement.outerHTML;
        console.log('LaTeX rendered successfully');
      }
    } catch (error) {
      console.error('Error processing LaTeX:', error);
      console.log('Full error:', error);
    }
  });

  function loadLaTeXJS() {
    return new Promise((resolve) => {
      if (window.latexjs) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/latex.js/dist/latex.min.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/latex.js/dist/style.css" rel="stylesheet">
</svelte:head>

<div class="latex-output">
  {#if renderedHTML}
    {@html renderedHTML}
  {:else}
    <p>Rendering LaTeX...</p>
  {/if}
</div>