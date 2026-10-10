<script>
	import { page } from '$app/state';
	import { signIn } from '@auth/sveltekit/client';
	import Button from '$lib/components/ui/button/button.svelte';

	const redirectTo = $derived(page.url.searchParams.get('redirectTo') || '/account');
	const error = $derived(page.url.searchParams.get('error'));
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[var(--blue)] to-[var(--pink)] px-4 text-white"
>
	<div class="w-full max-w-sm rounded-2xl bg-white/15 p-8 text-center shadow-xl backdrop-blur">
		<h1 class="mb-2 text-3xl">Sign in</h1>
		<p class="mb-8 text-white/80">Use your hupey.cloud account</p>
		{#if error}
			<p class="mb-4 rounded-md bg-white/90 px-3 py-2 text-sm text-[var(--pink)]">
				Sign-in failed. Please try again.
			</p>
		{/if}
		<Button
			size="lg"
			class="w-full bg-white text-[var(--pink)] hover:bg-white/90"
			onclick={() => signIn('authentik', { redirectTo })}
		>
			Continue
		</Button>
	</div>
</div>
