<script>
	import ModelViewer from '$lib/components/ModelViewer.svelte';

	let { data } = $props();

	const links = [
		{ label: 'GitHub', href: 'https://github.com/hupeyy' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/alex-huper' },
		{ label: 'Email', href: 'mailto:alexanderhuper@gmail.com' }
	];

	// Copied from the LinkedIn profile (linkedin.com/in/alex-huper), in its order
	const experience = [
		{
			role: 'Software Engineer',
			org: 'RipplePoint',
			place: 'Orlando, FL',
			dates: 'Oct 2026 – Present',
			points: []
		},
		{
			role: 'Software Engineer Intern',
			org: 'RipplePoint',
			place: 'Orlando, FL',
			dates: 'Jul 2026 – Oct 2026',
			points: []
		},
		{
			role: 'AI Data Annotator',
			org: 'Handshake',
			dates: 'Dec 2025 – Present',
			points: []
		},
		{
			role: 'Software Engineer',
			org: 'Every Flavor Robotics',
			dates: 'Apr 2025 – Sep 2025',
			points: [
				'Contributed to CaterLynx v1.1 development, building customer-facing features for a catering management platform.',
				'Reduced manual drafting effort by 80% by creating an email template rich text editor for customer communications.',
				'Implemented dynamic templating with database integration, enabling personalized variables for customer content.',
				'Engineered a Driver Management Suite with an availability calendar, boosting scheduling efficiency by 60%.'
			]
		},
		{
			role: 'Academic Programs Coordinator',
			org: 'ColorStack UFlorida',
			place: 'Gainesville, FL',
			dates: 'Mar 2024 – Apr 2025',
			points: []
		},
		{
			role: 'Software Engineer Intern',
			org: 'Every Flavor Robotics',
			place: 'Denver, CO',
			dates: 'May 2024 – Aug 2024',
			points: [
				'Built Dalia, an AI cooking assistant (Python, TogetherAI, Edamam) for personalized recipes and meal planning.',
				'Trained Dalia using few-shot learning and context pruning, achieving 36% memory reduction and 1.8s queries.',
				'Modernized Gourmet For Good’s CaterMatrix to Astro and HTMX, introducing custom dashboards and staff updates.',
				'Conducted customer interviews to optimize user experience and streamlined internal workflows by 40%.'
			]
		},
		{
			role: 'B.S. Computer Science',
			org: 'University of Florida',
			dates: 'Aug 2021 – Dec 2024',
			points: []
		}
	];

	const skills = [
		{
			group: 'Languages',
			items: [
				'JavaScript',
				'TypeScript',
				'Python',
				'C++',
				'C#',
				'Go',
				'Java',
				'MATLAB',
				'SQL',
				'HTML/CSS'
			]
		},
		{
			group: 'Frameworks',
			items: [
				'Svelte',
				'React',
				'Astro',
				'Next.js',
				'Three.js',
				'Node.js',
				'Tailwind CSS',
				'shadcn/ui',
				'Alpine.js',
				'htmx'
			]
		},
		{
			group: 'Tools',
			items: [
				'Docker',
				'PostgreSQL',
				'MySQL',
				'MariaDB',
				'MongoDB',
				'Firebase',
				'AWS',
				'Selenium',
				'Git',
				'Linux',
				'Figma'
			]
		}
	];

	// ---- Contribution calendar ----
	const weeks = $derived(data.calendar?.weeks ?? []);
	const months = $derived(
		weeks.map((week, i) => {
			const month = new Date(week[0].date + 'T00:00').getMonth();
			const prev = i ? new Date(weeks[i - 1][0].date + 'T00:00').getMonth() : null;
			return month !== prev && i < weeks.length - 2
				? new Date(week[0].date + 'T00:00').toLocaleString('en', { month: 'short' })
				: '';
		})
	);
	const busiest = $derived(
		weeks
			.flat()
			.filter(Boolean)
			.reduce((a, d) => (d.count > a.count ? d : a), { count: 0 })
	);

	let hovered = $state(null);
	const longDate = (d) =>
		new Date(d + 'T00:00').toLocaleDateString('en', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	const dayLabel = (d) =>
		`${d.count || 'No'} contribution${d.count === 1 ? '' : 's'} on ${longDate(d.date)}`;

	// Start the calendar scrolled to the most recent weeks on narrow screens
	let scroller = $state();
	$effect(() => {
		if (scroller) scroller.scrollLeft = scroller.scrollWidth;
	});

	const updated = (iso) =>
		new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric' });
</script>

<svelte:head>
	<title>Alex Huper</title>
</svelte:head>

<main>
	<header class="hero">
		<div class="avatar">
			<ModelViewer
				modelURL="/models/hupey-avatar.gltf"
				previewImage="/images/previews/hupey-avatar.png"
				scale={2}
				position={[0, -2, 0]}
				rotator
				alt="Alex's 3D avatar"
			/>
		</div>
		<div class="who">
			<h1>Alex Huper</h1>
			<p class="role">Software engineer</p>
			<nav class="links" aria-label="Profiles">
				{#each links as l}
					<a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
						{l.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<section class="block" aria-labelledby="contrib-heading">
		<h2 id="contrib-heading">
			{#if data.calendar?.total != null}
				{data.calendar.total.toLocaleString()} contributions in the last year
			{:else}
				Contributions
			{/if}
		</h2>

		{#if weeks.length}
			<div class="calendar-scroll" bind:this={scroller}>
				<div
					class="calendar"
					style="--weeks: {weeks.length}"
					role="img"
					aria-label="GitHub contribution calendar. Busiest day: {dayLabel(busiest)}."
				>
					{#each months as m, i}
						<span class="month" style="grid-column: {i + 2}">{m}</span>
					{/each}
					<span class="weekday" style="grid-row: 3">Mon</span>
					<span class="weekday" style="grid-row: 5">Wed</span>
					<span class="weekday" style="grid-row: 7">Fri</span>
					{#each weeks as week, w}
						{#each week as day, d}
							{#if day}
								<span
									class="cell"
									data-level={day.level}
									style="grid-column: {w + 2}; grid-row: {d + 2}"
									title={dayLabel(day)}
									onpointerenter={() => (hovered = day)}
									onpointerleave={() => (hovered = null)}
								></span>
							{/if}
						{/each}
					{/each}
				</div>
			</div>
			<p class="readout" aria-live="polite">
				{hovered ? dayLabel(hovered) : `Busiest day: ${dayLabel(busiest)}`}
			</p>
		{:else}
			<p class="muted">
				GitHub didn't send the calendar just now. It's on
				<a href="https://github.com/hupeyy">github.com/hupeyy</a>.
			</p>
		{/if}
	</section>

	<section class="block" aria-labelledby="repos-heading">
		<h2 id="repos-heading">Pinned repositories</h2>
		{#if data.repos?.length}
			<ul class="repos">
				{#each data.repos as r}
					<li>
						<a href={r.url} target="_blank" rel="noopener" class="repo">
							<span class="repo-name">{r.name}</span>
							{#if r.description}<span class="repo-desc">{r.description}</span>{/if}
							<span class="repo-meta">
								{#if r.language}<span>{r.language}</span>{/if}
								{#if r.stars}<span>{r.stars} star{r.stars === 1 ? '' : 's'}</span>{/if}
								<span>Updated {updated(r.pushedAt)}</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">
				Couldn't load repositories from GitHub. See them on
				<a href="https://github.com/hupeyy?tab=repositories">github.com/hupeyy</a>.
			</p>
		{/if}
	</section>

	<section class="block" aria-labelledby="exp-heading">
		<h2 id="exp-heading">Experience</h2>
		<ol class="timeline">
			{#each experience as job}
				<li>
					<p class="dates">{job.dates}</p>
					<h3>{job.role}</h3>
					<p class="org">{job.place ? `${job.org}, ${job.place}` : job.org}</p>
					{#if job.points.length}
						<ul class="points">
							{#each job.points as p}<li>{p}</li>{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ol>
	</section>

	<section class="block" aria-labelledby="skills-heading">
		<h2 id="skills-heading">Skills</h2>
		<dl class="skills">
			{#each skills as s}
				<dt>{s.group}</dt>
				<dd>{s.items.join(', ')}</dd>
			{/each}
		</dl>
	</section>

	<div class="grain" aria-hidden="true"></div>
</main>

<style>
	main {
		--sky: #7fd2eb;
		--bubblegum: #fb64b6;
		--haze: #eef0f6;
		--bruise: #4a2a52;
		--smog: #b9b3cf;
		--pixel: 'Silkscreen', 'jetbrains-mono', monospace;

		position: relative;
		overflow: hidden;
		min-height: 100vh;
		padding-bottom: 6rem;
		background: var(--bruise);
		color: var(--haze);
	}

	a {
		color: inherit;
	}

	a:focus-visible {
		outline: 3px solid var(--sky);
		outline-offset: 3px;
	}

	/* ---------- Hero ---------- */

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: end;
		gap: 1rem;
		padding: 5rem 1.5rem 4rem;
		background: linear-gradient(
			to bottom,
			var(--sky),
			color-mix(in srgb, var(--sky) 40%, var(--bubblegum)) 60%,
			var(--bruise)
		);
	}

	.avatar {
		height: 18rem;
	}

	.who {
		max-width: 72rem;
		width: 100%;
		margin: 0 auto;
	}

	@media (min-width: 48rem) {
		.hero {
			grid-template-columns: 1fr 1.4fr;
			padding: 6rem max(1.5rem, calc((100% - 72rem) / 2)) 5rem;
		}

		.avatar {
			height: 26rem;
		}
	}

	h1 {
		margin-bottom: 1rem;
		font-family: var(--pixel);
		font-size: clamp(2.75rem, 8vw, 6rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.role {
		max-width: 32rem;
		margin-bottom: 1.5rem;
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
	}

	.links a {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 5px;
	}

	.links a:hover {
		color: var(--sky);
	}

	/* ---------- Sections ---------- */

	.block {
		position: relative;
		z-index: 1;
		max-width: 72rem;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 0;
	}

	h2 {
		margin-bottom: 1.75rem;
		font-size: clamp(1.4rem, 3vw, 1.9rem);
		color: var(--bubblegum);
	}

	.muted {
		color: var(--smog);
	}

	.muted a {
		text-decoration: underline;
	}

	/* ---------- Contribution calendar: the page's one loud element ---------- */

	.calendar-scroll {
		overflow-x: auto;
		padding-bottom: 0.5rem;
		scrollbar-color: var(--smog) transparent;
	}

	/* Cells share the full width; below ~14px each, the strip scrolls instead */
	.calendar {
		display: grid;
		grid-template-columns: 2.25rem repeat(var(--weeks), minmax(0, 1fr));
		grid-template-rows: 1.25rem;
		grid-auto-rows: auto;
		gap: 3px;
		width: 100%;
		min-width: calc(2.25rem + var(--weeks) * 14px);
	}

	.month,
	.weekday {
		font-size: 0.7rem;
		color: var(--smog);
		white-space: nowrap;
	}

	.month {
		grid-row: 1;
	}

	.weekday {
		grid-column: 1;
		align-self: center;
	}

	.cell {
		aspect-ratio: 1;
		background: rgb(255 255 255 / 0.07);
	}

	.cell:hover {
		outline: 2px solid var(--haze);
		outline-offset: 1px;
	}

	.cell[data-level='1'] {
		background: color-mix(in srgb, var(--sky) 70%, var(--bruise));
	}
	.cell[data-level='2'] {
		background: var(--sky);
	}
	.cell[data-level='3'] {
		background: var(--bubblegum);
	}
	.cell[data-level='4'] {
		background: var(--haze);
	}

	.readout {
		min-height: 1.5rem;
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: var(--smog);
	}

	/* ---------- Repositories ---------- */

	.repos {
		display: grid;
		gap: 0 2.5rem;
	}

	@media (min-width: 48rem) {
		.repos {
			grid-template-columns: 1fr 1fr;
		}
	}

	.repos li {
		position: relative;
	}

	/* Torn-paper divider, same as the landing page */
	.repos li::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 5px;
		background: color-mix(in srgb, var(--smog) 45%, transparent);
		clip-path: polygon(
			0 30%,
			7% 0,
			13% 55%,
			22% 20%,
			30% 70%,
			38% 10%,
			47% 45%,
			55% 0,
			61% 60%,
			70% 25%,
			78% 75%,
			86% 5%,
			93% 50%,
			100% 20%,
			100% 100%,
			0 100%
		);
	}

	.repo {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1.4rem 0;
	}

	.repo-name {
		font-size: 1.15rem;
		font-weight: 700;
		overflow-wrap: anywhere;
	}

	.repo:hover .repo-name {
		color: var(--sky);
	}

	.repo-desc {
		line-height: 1.5;
	}

	.repo-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1.25rem;
		font-size: 0.85rem;
		color: var(--smog);
	}

	/* ---------- Experience timeline ---------- */

	.timeline {
		position: relative;
		max-width: 46rem;
		padding-left: 2rem;
		border-left: 2px solid color-mix(in srgb, var(--smog) 40%, transparent);
	}

	.timeline > li {
		position: relative;
		padding-bottom: 2.75rem;
	}

	.timeline > li:last-child {
		padding-bottom: 0;
	}

	/* Square marker on the line, a pixel to match the calendar */
	.timeline > li::before {
		content: '';
		position: absolute;
		top: 0.3rem;
		left: calc(-2rem - 7px);
		width: 12px;
		height: 12px;
		background: var(--bubblegum);
	}

	.timeline > li:last-child::before {
		background: var(--sky);
	}

	.dates {
		margin-bottom: 0.25rem;
		font-size: 0.85rem;
		color: var(--smog);
	}

	h3 {
		font-size: 1.15rem;
		font-weight: 700;
	}

	.org {
		margin-bottom: 0.75rem;
		color: var(--smog);
	}

	.points {
		display: grid;
		gap: 0.5rem;
		padding-left: 1.1rem;
		list-style: square;
		line-height: 1.55;
	}

	.points li::marker {
		color: var(--bubblegum);
	}

	/* ---------- Skills ---------- */

	.skills {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.25rem 2rem;
		max-width: 52rem;
	}

	.skills dt {
		font-weight: 700;
	}

	.skills dd {
		margin-bottom: 1.25rem;
		line-height: 1.6;
		color: var(--smog);
	}

	@media (min-width: 40rem) {
		.skills {
			grid-template-columns: 9rem 1fr;
		}
	}

	/* ---------- Texture ---------- */

	.grain {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		opacity: 0.16;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
</style>
