<script>
	import '../app.css';
	import Hamburger from '$lib/components/Hamburger.svelte';

	let { children, data } = $props();
</script>

<Hamburger session={data.session} />
{@render children()}

