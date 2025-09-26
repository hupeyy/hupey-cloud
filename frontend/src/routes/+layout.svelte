<script>
	import '../app.css';
	import Hamburger from '$lib/components/Hamburger.svelte';

	let { children } = $props();
</script>

<Hamburger />
{@render children()}

