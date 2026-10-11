<script>
	import '../app.css';
	import Hamburger from '$lib/components/Hamburger.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<!-- Silkscreen: the pixel display face used for page headlines -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet" />
</svelte:head>

<Hamburger session={data.session} />
{@render children()}

