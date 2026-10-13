<script>
	import '../app.css';
	import Hamburger from '$lib/components/Hamburger.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<!-- Fetch the fonts alongside the CSS instead of after it (faces are in app.css) -->
	<link
		rel="preload"
		href="/fonts/JetBrainsMono-Regular.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/Silkscreen-Regular.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<Hamburger session={data.session} />
{@render children()}
