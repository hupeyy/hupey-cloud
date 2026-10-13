<script>
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';
	import { signOut } from '@auth/sveltekit/client';

	let { session = null } = $props();

	// The menu is always in the page and opens with a CSS transform, so opening it
	// costs no layout work and the phone/desktop layouts come from media queries.
	// Before the app has loaded, the script in app.html opens and closes it.
	let isOpen = $state(false);

	const links = $derived([
		{ href: '/', label: 'Home' },
		{ href: '/portfolio', label: 'Portfolio' },
		...(session?.user
			? [
					{ href: '/account', label: 'Account' },
					...(session.user.isAdmin
						? [
								{ href: '/containers', label: 'Containers' },
								{ href: '/recipes/import', label: 'Import recipe' }
							]
						: [])
				]
			: [{ href: '/login', label: 'Sign in' }])
	]);

	onMount(() => {
		// Take over from app.html, keeping the menu open if it was opened while loading
		isOpen = window.__menuOpen === true;
		window.__menuReady = true;
	});

	const close = () => (isOpen = false);

	function handleSignOut() {
		close();
		signOut({ redirectTo: '/' });
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && close()} />

<div class="fixed top-0 z-50 flex h-20 w-full flex-row-reverse bg-transparent px-8 py-6">
	<Button
		variant="cloud"
		onclick={() => (isOpen = !isOpen)}
		data-menu-toggle
		class="group relative z-50"
		aria-label="Toggle navigation menu"
		aria-controls="site-menu"
		aria-expanded={isOpen}
	>
		<!-- Animated hamburger icon, driven by aria-expanded so it also works before the app loads -->
		<div class="relative flex h-6 w-6 flex-col items-center justify-center">
			<span
				class="absolute h-0.5 w-6 -translate-y-2 bg-current transition-transform duration-200 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45"
			></span>
			<span
				class="absolute h-0.5 w-6 bg-current transition-opacity duration-200 group-aria-expanded:opacity-0"
			></span>
			<span
				class="absolute h-0.5 w-6 translate-y-2 bg-current transition-transform duration-200 group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45"
			></span>
		</div>
	</Button>
</div>

<div id="site-menu" class="site-menu" data-open={isOpen}>
	<!-- Desktop only: dims the page and closes the menu when clicked -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="backdrop fixed inset-0 z-40 bg-black/50"
		data-menu-close
		onclick={close}
		aria-hidden="true"
	></div>

	<nav
		class="panel fixed top-0 right-0 left-0 z-40 bg-white pt-20 text-[var(--pink)] shadow-lg md:left-auto md:h-full md:w-80 md:pt-0 md:shadow-2xl"
		aria-label="Site"
	>
		<h2 class="border-b border-gray-200 px-6 py-4 text-xl font-bold text-black md:p-8">Menu</h2>
		<div class="flex flex-col py-2 md:gap-4 md:p-8">
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={close}
					class="px-6 py-4 transition-colors hover:bg-gray-100 md:rounded-lg md:px-4 md:py-3"
				>
					{link.label}
				</a>
			{/each}
			{#if session?.user}
				<button
					onclick={handleSignOut}
					class="px-6 py-4 text-left transition-colors hover:bg-gray-100 md:rounded-lg md:px-4 md:py-3"
				>
					Sign out
				</button>
			{/if}
		</div>
	</nav>
</div>

<style>
	/* Closed: the panel sits just off screen (above on phones, right on desktop) and
	   is hidden once it has slid away, so its links can't be tabbed to. */
	.panel {
		visibility: hidden;
		transform: translateY(-100%);
		transition:
			transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
			visibility 0s linear 200ms;
		will-change: transform;
	}

	.backdrop {
		display: none;
		opacity: 0;
		pointer-events: none;
		transition: opacity 200ms ease-out;
	}

	.site-menu[data-open='true'] .panel {
		visibility: visible;
		transform: none;
		transition-delay: 0s;
	}

	.site-menu[data-open='true'] .backdrop {
		opacity: 1;
		pointer-events: auto;
	}

	@media (min-width: 768px) {
		.panel {
			transform: translateX(100%);
		}

		.backdrop {
			display: block;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel,
		.backdrop {
			transition: none;
		}
	}
</style>
