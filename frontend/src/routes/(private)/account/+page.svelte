<script>
	let { data } = $props();
	const user = $derived(data.session.user);
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[var(--blue)] to-[var(--pink)] px-4 text-white"
>
	<div class="w-full max-w-md rounded-2xl bg-white/15 p-8 text-center shadow-xl backdrop-blur">
		{#if user.image}
			<img src={user.image} alt="" class="mx-auto mb-4 h-20 w-20 rounded-full" />
		{/if}
		<h1 class="mb-1 text-3xl">Hi, {user.name ?? 'there'}</h1>
		<p class="mb-6 text-white/80">{user.email}</p>
		<a
			href="https://auth.hupey.cloud/if/user/"
			class="inline-block rounded-md bg-white px-4 py-2 text-[var(--pink)] hover:bg-white/90"
		>
			Manage account
		</a>
	</div>
</div>
