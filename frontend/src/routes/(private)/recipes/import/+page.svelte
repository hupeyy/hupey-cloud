<script>
	import { enhance } from '$app/forms';
	import { parseCaption } from '$lib/recipe-caption.js';

	let url = $state('');
	let post = $state(null); // { url, title, caption, author, thumbnail }
	let text = $state('');
	let name = $state('');
	let saved = $state(null); // { name, link }
	let error = $state('');
	let busy = $state(false);

	// The preview follows the caption as it is edited
	const recipe = $derived(parseCaption(text));

	function reset() {
		post = null;
		saved = null;
		text = name = url = error = '';
	}

	// Keep the page's own state in step with each action's result
	const submit =
		() =>
		async ({ result, update }) => {
			busy = false;
			error = result.type === 'failure' ? (result.data?.error ?? 'Something went wrong.') : '';
			if (result.type === 'success' && result.data?.post) {
				post = result.data.post;
				text = result.data.text;
				name = parseCaption(text).name;
			}
			if (result.type === 'success' && result.data?.saved) saved = result.data.saved;
			await update({ reset: false });
		};
</script>

<svelte:head>
	<title>Import recipe · hupey.cloud</title>
</svelte:head>

<div
	class="min-h-screen bg-linear-to-b from-[var(--blue)] to-[var(--pink)] px-4 pt-24 pb-12 text-white sm:px-8"
>
	<div class="mx-auto max-w-5xl">
		<h1 class="mb-1 text-3xl sm:text-4xl">Import recipe</h1>
		<p class="mb-8 text-white/80">
			From an Instagram or TikTok caption into <a
				href="https://recipes.hupey.cloud"
				class="underline underline-offset-2 hover:text-white">Mealie</a
			>
		</p>

		{#if error}
			<p class="mb-6 rounded-md bg-white/90 px-4 py-3 text-[var(--pink)]" role="alert">{error}</p>
		{/if}

		{#if saved}
			<div class="rounded-2xl bg-white/15 p-6 shadow-lg backdrop-blur">
				<p class="mb-4 text-xl">Added “{saved.name}” to Mealie.</p>
				<div class="flex flex-wrap gap-3">
					<a
						href={saved.link}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-md bg-white px-4 py-2 text-[var(--pink)] hover:bg-white/90"
						>Open in Mealie</a
					>
					<button
						type="button"
						onclick={reset}
						class="rounded-md border border-white/60 px-4 py-2 hover:bg-white/10"
					>
						Import another
					</button>
				</div>
			</div>
		{:else if !post}
			<form
				method="POST"
				action="?/fetch"
				use:enhance={() => {
					busy = true;
					return submit();
				}}
				class="flex flex-col gap-3 rounded-2xl bg-white/15 p-5 shadow-lg backdrop-blur sm:flex-row"
			>
				<label class="sr-only" for="url">Post link</label>
				<input
					id="url"
					name="url"
					type="url"
					required
					bind:value={url}
					placeholder="https://www.instagram.com/reel/… or https://www.tiktok.com/@…/video/…"
					class="min-w-0 flex-1 rounded-md bg-white/90 px-3 py-2 text-gray-900 placeholder:text-gray-500"
				/>
				<button
					disabled={busy}
					class="rounded-md bg-white px-4 py-2 text-[var(--pink)] hover:bg-white/90 disabled:opacity-60"
				>
					{busy ? 'Reading post…' : 'Read caption'}
				</button>
			</form>
		{:else}
			<form
				method="POST"
				action="?/save"
				use:enhance={() => {
					busy = true;
					return submit();
				}}
				class="grid gap-6 lg:grid-cols-2"
			>
				<input type="hidden" name="url" value={post.url} />
				<input type="hidden" name="thumbnail" value={post.thumbnail ?? ''} />

				<section class="flex flex-col gap-4 rounded-2xl bg-white/15 p-5 shadow-lg backdrop-blur">
					<div class="flex items-center gap-3">
						{#if post.thumbnail}
							<img
								src={post.thumbnail}
								alt=""
								referrerpolicy="no-referrer"
								class="h-16 w-16 rounded-md object-cover"
							/>
						{/if}
						<div class="min-w-0">
							<p class="truncate text-sm text-white/70">{post.author}</p>
							<a href={post.url} class="block truncate text-sm underline underline-offset-2"
								>{post.url}</a
							>
						</div>
					</div>

					<label class="flex flex-col gap-1">
						<span class="text-sm text-white/80">Name</span>
						<input
							name="name"
							bind:value={name}
							required
							class="rounded-md bg-white/90 px-3 py-2 text-gray-900"
						/>
					</label>

					<label class="flex flex-1 flex-col gap-1">
						<span class="text-sm text-white/80">
							Caption — one ingredient or step per line. Edit it until the preview looks right.
						</span>
						<textarea
							name="text"
							bind:value={text}
							rows="18"
							class="flex-1 rounded-md bg-white/90 px-3 py-2 font-mono text-sm text-gray-900"
						></textarea>
					</label>

					<div class="flex flex-wrap gap-3">
						<button
							disabled={busy || (!recipe.ingredients.length && !recipe.steps.length)}
							class="rounded-md bg-white px-4 py-2 text-[var(--pink)] hover:bg-white/90 disabled:opacity-60"
						>
							{busy ? 'Saving…' : 'Add to Mealie'}
						</button>
						<button
							type="button"
							onclick={reset}
							class="rounded-md border border-white/60 px-4 py-2 hover:bg-white/10"
						>
							Start over
						</button>
					</div>
				</section>

				<section class="rounded-2xl bg-white/15 p-5 shadow-lg backdrop-blur" aria-live="polite">
					<p class="mb-1 text-sm text-white/70">Preview</p>
					<h2 class="mb-2 text-2xl">{name || recipe.name || 'Untitled'}</h2>
					{#if recipe.description}<p class="mb-4 text-white/85">{recipe.description}</p>{/if}

					<h3 class="mt-4 mb-2 text-lg">Ingredients ({recipe.ingredients.length})</h3>
					{#if recipe.ingredients.length}
						<ul class="space-y-1">
							{#each recipe.ingredients as item, i (i)}
								{#if item.title}<li class="pt-2 font-semibold text-white/90">{item.title}</li>{/if}
								<li class="flex gap-2"><span class="text-white/50">•</span>{item.note}</li>
							{/each}
						</ul>
					{:else}
						<p class="text-white/70">None found.</p>
					{/if}

					<h3 class="mt-6 mb-2 text-lg">Steps ({recipe.steps.length})</h3>
					{#if recipe.steps.length}
						<ol class="space-y-2">
							{#each recipe.steps as step, i (i)}
								{#if step.title}<li class="pt-2 font-semibold text-white/90">{step.title}</li>{/if}
								<li class="flex gap-2"><span class="text-white/50">{i + 1}.</span>{step.text}</li>
							{/each}
						</ol>
					{:else}
						<p class="text-white/70">None in the caption. You can add them in Mealie afterwards.</p>
					{/if}

					{#if recipe.notes.length}
						<h3 class="mt-6 mb-2 text-lg">Notes</h3>
						<ul class="space-y-1">
							{#each recipe.notes as note, i (i)}
								<li><span class="text-white/70">{note.title}:</span> {note.text}</li>
							{/each}
						</ul>
					{/if}
				</section>
			</form>
		{/if}
	</div>
</div>
