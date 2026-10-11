<script>
	import ModelViewer from '$lib/components/ModelViewer.svelte';

	let { data } = $props();
	const user = $derived(data.session?.user);

	const servers = [
		{ name: 'Minecraft', address: 'hupey.cloud:25565' },
		{ name: 'Terraria', address: 'hupey.cloud:7777' }
	];
	let copied = $state(null);

	async function copy(address) {
		await navigator.clipboard.writeText(address);
		copied = address;
		setTimeout(() => (copied = null), 1500);
	}
</script>

<svelte:head>
	<title>hupey.cloud</title>
</svelte:head>

<!-- Filters for the worn, inked text -->
<svg class="absolute h-0 w-0" aria-hidden="true">
	<filter id="grunge">
		<feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="7" result="speck" />
		<feColorMatrix
			in="speck"
			values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 9.6"
			result="holes"
		/>
		<feComposite in="SourceGraphic" in2="holes" operator="in" result="worn" />
		<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="warp" />
		<feDisplacementMap in="worn" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" />
	</filter>
</svg>

<main class="overflow-hidden text-white">
	<!-- Hero -->
	<section
		class="sky relative flex min-h-svh flex-col items-center justify-center px-4 pt-20 pb-24"
	>
		<div class="fog fog-back" aria-hidden="true"></div>

		<div class="relative z-10 h-56 w-full max-w-4xl sm:h-72 md:h-96">
			<ModelViewer
				modelURL="/models/hupey-cloud.gltf"
				previewImage="/images/previews/hupey-cloud.png"
				scale={2}
				cameraPosition={[7, 7, 7]}
				rotationY={Math.PI}
				oscillator
				alt="hupey.cloud 3D model"
			/>
		</div>

		<div class="relative z-10 text-center">
			<p class="mb-3 text-xs tracking-[0.4em] text-white/80 uppercase sm:text-sm">
				Self-hosted on a Raspberry Pi
			</p>
			<h1 class="inked text-4xl tracking-tight uppercase sm:text-6xl md:text-7xl">
				Take to the skies
			</h1>

			<div class="mt-10 flex flex-wrap justify-center gap-4">
				<a href="/portfolio" class="stamp stamp-solid">Portfolio</a>
				{#if user?.isAdmin}
					<a href="/containers" class="stamp">Containers</a>
				{:else if user}
					<a href="/account" class="stamp">Account</a>
				{:else}
					<a href="/login" class="stamp">Sign in</a>
				{/if}
			</div>
		</div>

		<div class="fog fog-front" aria-hidden="true"></div>
		<p
			class="absolute bottom-6 z-10 animate-pulse text-xs tracking-[0.3em] text-white/70 uppercase"
		>
			↓ drift down
		</p>
	</section>

	<!-- What lives up here -->
	<section class="haze relative -mt-40 px-4 pt-64 pb-10 sm:px-8">
		<div class="fog fog-low" aria-hidden="true"></div>
		<div class="stains" aria-hidden="true"></div>
		<div class="relative z-10 mx-auto max-w-5xl">
			<h2 class="inked mb-2 text-3xl uppercase sm:text-4xl">What's up here</h2>
			<p class="mb-12 max-w-xl text-white/80">
				One small computer in a closet, serving this site, a couple of game worlds, and the house's
				DNS.
			</p>

			<div class="grid gap-6 md:grid-cols-3">
				<a href="/portfolio" class="scrap group">
					<span class="tape" aria-hidden="true"></span>
					<p class="scrap-label">01 / Work</p>
					<h3 class="mb-2 text-2xl">Portfolio</h3>
					<p class="text-white/80">Projects, models, and a resume.</p>
					<p class="mt-auto pt-6 text-sm group-hover:underline">Have a look →</p>
				</a>

				<div class="scrap">
					<span class="tape" aria-hidden="true"></span>
					<p class="scrap-label">02 / Play</p>
					<h3 class="mb-2 text-2xl">Game servers</h3>
					<p class="mb-4 text-white/80">Click an address to copy it.</p>
					<div class="mt-auto space-y-2">
						{#each servers as s}
							<button onclick={() => copy(s.address)} class="server">
								<span>{s.name}</span>
								<span class="text-white/70">{copied === s.address ? 'copied!' : s.address}</span>
							</button>
						{/each}
					</div>
				</div>

				<a href={user ? '/account' : '/login'} class="scrap group">
					<span class="tape" aria-hidden="true"></span>
					<p class="scrap-label">03 / Members</p>
					<h3 class="mb-2 text-2xl">{user ? `Hey, ${user.name ?? 'you'}` : 'Sign in'}</h3>
					<p class="text-white/80">
						{user
							? 'Your account and anything private.'
							: 'Got an account? The private side is in here.'}
					</p>
					<p class="mt-auto pt-6 text-sm group-hover:underline">
						{user ? 'Go to account →' : 'Sign in →'}
					</p>
				</a>
			</div>
		</div>

		<footer
			class="relative z-10 mt-24 text-center text-xs tracking-[0.3em] text-white/60 uppercase"
		>
			hupey.cloud · running on hupi
		</footer>
	</section>

	<div class="grain" aria-hidden="true"></div>
</main>

<style>
	/* Base sky: the site's blue fading into pink, with a dusky vignette */
	.sky {
		background:
			radial-gradient(ellipse at center, transparent 40%, rgb(40 20 60 / 0.45) 100%),
			linear-gradient(
				to bottom,
				var(--blue),
				color-mix(in srgb, var(--blue) 40%, var(--pink)) 70%,
				var(--pink)
			);
	}

	/* Starts transparent so it fades out of the hero instead of meeting it at an edge */
	.haze {
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--pink) 75%, white) 10rem,
			var(--pink) 22rem,
			color-mix(in srgb, var(--pink) 55%, #3a1d45)
		);
	}

	/* Fog: tiled fractal noise, twice as wide as the screen, sliding sideways forever */
	.fog {
		position: absolute;
		inset: 0 auto 0 0;
		width: 200%;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cfilter id='f' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.003 0.008' numOctaves='5' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.8 0 0 0 -0.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
		background-size: 50% 100%;
		background-repeat: repeat-x;
	}

	.fog-back {
		opacity: 0.55;
		animation: drift 90s linear infinite;
	}

	.fog-front {
		z-index: 20;
		opacity: 0.5;
		mask-image: linear-gradient(to bottom, transparent 45%, black 80%, transparent);
		animation: drift 55s linear infinite reverse;
	}

	.fog-low {
		opacity: 0.45;
		mask-image: linear-gradient(to bottom, transparent, black 10rem, transparent 60%);
		animation: drift 120s linear infinite;
	}

	/* Blotchy water-stain texture */
	.stains {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.35;
		mix-blend-mode: multiply;
		mask-image: linear-gradient(to bottom, transparent 8rem, black 20rem);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='700'%3E%3Cfilter id='s' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='4' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.15 0 0 0 0 0.4 0 0 0 -2.2 1.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E");
	}

	@keyframes drift {
		to {
			transform: translateX(-50%);
		}
	}

	/* Film grain over everything */
	.grain {
		position: fixed;
		inset: -50%;
		z-index: 30;
		pointer-events: none;
		opacity: 0.16;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		animation: jitter 0.6s steps(3) infinite;
	}

	@keyframes jitter {
		0% {
			transform: translate(0, 0);
		}
		33% {
			transform: translate(-3%, 2%);
		}
		66% {
			transform: translate(2%, -3%);
		}
		100% {
			transform: translate(-1%, 1%);
		}
	}

	/* Worn, slightly misprinted lettering */
	.inked {
		filter: url(#grunge);
		text-shadow:
			3px 2px 0 color-mix(in srgb, var(--pink) 80%, black),
			-2px -1px 0 var(--blue);
	}

	/* Rough rubber-stamp buttons */
	.stamp {
		border: 2px solid transparent;
		padding: 0.75rem 1.75rem;
		font-size: 0.875rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		position: relative;
		transition:
			transform 0.2s,
			background-color 0.2s;
	}

	.stamp::before {
		content: '';
		position: absolute;
		inset: -2px;
		border: 2px solid white;
		filter: url(#grunge);
		pointer-events: none;
	}

	.stamp:hover {
		transform: rotate(-2deg) scale(1.05);
		background: rgb(255 255 255 / 0.15);
	}

	.stamp-solid {
		background: white;
		color: color-mix(in srgb, var(--pink) 85%, black);
	}

	.stamp-solid:hover {
		background: rgb(255 255 255 / 0.85);
	}

	/* Taped-up paper scraps */
	.scrap {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 2rem 1.5rem 1.5rem;
		border: 1px dashed rgb(255 255 255 / 0.45);
		background: rgb(255 255 255 / 0.08);
		backdrop-filter: blur(6px);
		box-shadow: 6px 6px 0 rgb(40 20 60 / 0.25);
		transition: transform 0.2s;
	}

	.scrap:nth-child(1) {
		transform: rotate(-1deg);
	}
	.scrap:nth-child(2) {
		transform: rotate(0.6deg);
	}
	.scrap:nth-child(3) {
		transform: rotate(-0.4deg);
	}

	a.scrap:hover {
		transform: rotate(0deg) translateY(-4px);
	}

	.scrap-label {
		margin-bottom: 1rem;
		font-size: 0.75rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.6);
	}

	.tape {
		position: absolute;
		top: -0.75rem;
		left: 50%;
		width: 5.5rem;
		height: 1.5rem;
		translate: -50% 0;
		rotate: -3deg;
		background: rgb(255 255 255 / 0.35);
		clip-path: polygon(3% 0, 97% 8%, 100% 92%, 0 100%);
	}

	.server {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid rgb(255 255 255 / 0.3);
		font-size: 0.875rem;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.server:hover {
		background: rgb(255 255 255 / 0.15);
	}

	@media (prefers-reduced-motion: reduce) {
		.fog,
		.grain {
			animation: none;
		}
	}
</style>
