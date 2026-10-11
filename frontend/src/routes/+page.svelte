<script>
	import ModelViewer from '$lib/components/ModelViewer.svelte';

	let { data } = $props();
	const user = $derived(data.session?.user);

	// Where the second hero button goes depends on who is looking
	const memberLink = $derived(
		user?.isAdmin
			? { href: '/containers', label: 'Open containers' }
			: user
				? { href: '/account', label: 'Your account' }
				: { href: '/login', label: 'Sign in' }
	);

	const servers = [
		{ name: 'Minecraft', address: 'hupey.cloud:25565' },
		{ name: 'Terraria', address: 'hupey.cloud:7777' }
	];
	let copied = $state(null);

	// Fog drifts sideways as the page scrolls: 0 at the top, 1 once the hero is scrolled past
	let scrollY = $state(0);
	let innerHeight = $state(1);
	let still = $state(false);
	const drift = $derived(still ? 0 : Math.min(scrollY / innerHeight, 1));

	$effect(() => {
		const query = matchMedia('(prefers-reduced-motion: reduce)');
		still = query.matches;
		const update = () => (still = query.matches);
		query.addEventListener('change', update);
		return () => query.removeEventListener('change', update);
	});

	let copiedTimer;
	async function copy(address) {
		try {
			await navigator.clipboard.writeText(address);
		} catch {
			return; // Clipboard unavailable or denied; the address is on screen to copy by hand
		}
		copied = address;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = null), 2000);
	}

</script>

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
	<title>hupey.cloud</title>
</svelte:head>

<!-- Knocks small holes out of the headline so it reads as worn print -->
<svg class="absolute h-0 w-0" aria-hidden="true">
	<filter id="worn">
		<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="7" result="speck" />
		<feColorMatrix
			in="speck"
			values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -22 13.2"
			result="holes"
		/>
		<feComposite in="SourceGraphic" in2="holes" operator="in" />
	</filter>
	<filter id="worn-light">
		<feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" seed="7" result="speck" />
		<feColorMatrix
			in="speck"
			values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -22 15.4"
			result="holes"
		/>
		<feComposite in="SourceGraphic" in2="holes" operator="in" />
	</filter>
</svg>

<main>
	<section class="hero">
		<div class="fog fog-back" style="translate: {drift * -18}% 0" aria-hidden="true"></div>

		<div class="model">
			<ModelViewer
				modelURL="/models/hupey-cloud.gltf"
				previewImage="/images/previews/hupey-cloud.png"
				scale={2}
				cameraPosition={[7, 7, 7]}
				rotationY={Math.PI}
				alt="hupey.cloud 3D model"
			/>
		</div>

		<div class="fog fog-front" style="translate: {drift * 20}% 0" aria-hidden="true"></div>

		<div class="intro">
			<h1>Take to the skies</h1>
			<p class="lede">
				A Raspberry Pi in a closet, running this site, two game servers, and the house's DNS.
			</p>
			<div class="actions">
				<a href="/portfolio" class="btn btn-solid">See my work</a>
				<a href={memberLink.href} class="btn">{memberLink.label}</a>
			</div>
		</div>
	</section>

	<section class="running" aria-labelledby="running-heading">
		<div class="stains" aria-hidden="true"></div>
		<h2 id="running-heading">Running up here</h2>

		<ul>
			<li>
				<span class="name">Portfolio</span>
				<span class="what">GitHub activity, pinned repos, and experience</span>
				<a href="/portfolio" class="btn btn-small">See my work</a>
			</li>
			{#each servers as s}
				<li>
					<span class="name">{s.name}</span>
					<code class="what">{s.address}</code>
					<button class="btn btn-small" onclick={() => copy(s.address)}>
						{copied === s.address ? 'Copied' : 'Copy address'}
					</button>
				</li>
			{/each}
		</ul>
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
		background: var(--bruise);
		color: var(--haze);
	}

	/* ---------- Hero ---------- */

	.hero {
		position: relative;
		display: flex;
		min-height: 100svh;
		flex-direction: column;
		justify-content: flex-end;
		padding: 6rem 1.5rem 3.5rem;
		background: linear-gradient(
			to bottom,
			var(--sky),
			color-mix(in srgb, var(--sky) 45%, var(--bubblegum)) 55%,
			var(--bubblegum) 85%,
			var(--bruise)
		);
	}

	.model {
		position: absolute;
		inset: 8% 0 auto;
		z-index: 1;
		height: min(28rem, 48svh);
	}

	.intro {
		position: relative;
		z-index: 3;
		max-width: 72rem;
		width: 100%;
		margin: 0 auto;
	}

	h1 {
		max-width: 9ch;
		margin-bottom: 1.5rem;
		font-family: var(--pixel);
		font-size: clamp(3.25rem, 11vw, 9rem);
		font-weight: 400;
		line-height: 0.9;
		letter-spacing: -0.02em;
		color: var(--haze);
		filter: url(#worn);
		/* The bottom of the letters sinks into the fog */
		mask-image: linear-gradient(to bottom, black 55%, rgb(0 0 0 / 0.35));
	}

	.lede {
		max-width: 34rem;
		margin-bottom: 2rem;
		font-size: 1rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	/* ---------- Fog ----------
	   Each layer is wider than the screen. On load the two banks roll in from
	   opposite sides (transform); scrolling then pushes them apart (translate,
	   set inline), with the nearer bank moving faster. */

	.fog {
		position: absolute;
		inset: 0 -40%;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'%3E%3Cfilter id='f' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.003 0.009' numOctaves='5' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.93 0 0 0 0 0.94 0 0 0 0 0.96 1.8 0 0 0 -0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
		background-size: max(1200px, 100vw) 100%;
		animation-duration: 3.2s;
		animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
		animation-fill-mode: both;
		will-change: transform, translate;
	}

	.fog-back {
		opacity: 0.6;
		mask-image: linear-gradient(to bottom, black 40%, transparent);
		animation-name: roll-in-left;
	}

	.fog-front {
		z-index: 2;
		opacity: 0.85;
		background-position: 60% 0;
		mask-image: linear-gradient(to bottom, transparent 50%, black 78%, transparent);
		animation-name: roll-in-right;
	}

	@keyframes roll-in-left {
		from {
			opacity: 0;
			transform: translateX(-30%);
		}
	}

	@keyframes roll-in-right {
		from {
			opacity: 0;
			transform: translateX(30%);
		}
	}

	/* ---------- What's running ---------- */

	.running {
		position: relative;
		max-width: 72rem;
		margin: 0 auto;
		padding: 5rem 1.5rem 7rem;
	}

	h2 {
		position: relative;
		margin-bottom: 2.5rem;
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--bubblegum);
	}

	ul {
		position: relative;
	}

	li {
		position: relative;
		display: grid;
		grid-template-columns: 10rem 1fr auto;
		align-items: center;
		gap: 0.5rem 1.5rem;
		padding: 1.5rem 0;
	}

	/* Torn-paper divider above each row */
	li::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 5px;
		background: color-mix(in srgb, var(--smog) 45%, transparent);
		clip-path: var(--tear);
	}

	.name {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.what {
		color: var(--smog);
	}

	@media (max-width: 40rem) {
		li {
			grid-template-columns: 1fr auto;
		}

		.what {
			grid-row: 2;
			grid-column: 1 / -1;
		}
	}

	/* ---------- Buttons ---------- */

	.btn {
		display: inline-block;
		padding: 0.8rem 1.4rem;
		border: 2px solid var(--haze);
		font-size: 0.95rem;
		color: var(--haze);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.btn:hover {
		background: var(--haze);
		color: var(--bruise);
	}

	.btn:focus-visible {
		outline: 3px solid var(--sky);
		outline-offset: 3px;
	}

	.btn-solid {
		background: var(--haze);
		color: var(--bruise);
	}

	.btn-solid:hover {
		background: var(--sky);
		border-color: var(--sky);
	}

	.btn-small {
		padding: 0.5rem 1rem;
		border-color: color-mix(in srgb, var(--haze) 60%, transparent);
		font-size: 0.875rem;
		white-space: nowrap;
	}

	/* ---------- Texture ---------- */

	.stains {
		position: absolute;
		inset: 0 -50vw;
		pointer-events: none;
		opacity: 0.5;
		mix-blend-mode: multiply;
		mask-image: linear-gradient(to bottom, transparent, black 12rem);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700'%3E%3Cfilter id='s' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.08 0 0 0 0 0.22 0 0 0 -2.4 1.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E");
	}

	.grain {
		position: absolute;
		inset: 0;
		z-index: 4;
		pointer-events: none;
		opacity: 0.18;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	/* Small type can't lose as much ink and stay readable */
	@media (max-width: 40rem) {
		h1 {
			filter: url(#worn-light);
			mask-image: linear-gradient(to bottom, black 70%, rgb(0 0 0 / 0.6));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.fog {
			animation: none;
		}
	}
</style>
