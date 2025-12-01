<script>
  let resume = {};

  onMount(async () => {
    const res = await fetch('/resume/resume.json');
    resume = await res.json();
  })
</script>
<h1>{resume.name}</h1>
<p>{resume.email} | {resume.phone}</p>

<section>
  <h2>Experience</h2>
  {#each resume.experience as exp}
    <h3>{exp.title} — {exp.company}</h3>
    <p>{exp.location} ({exp.period})</p>
    <ul>
      {#each exp.bullets as b}<li>{b}</li>{/each}
    </ul>
  {/each}
</section>

<iframe title="resume" src="/resume/resume.pdf" class="w-full h-[90vh]"></iframe>