<script>
	import { slide, fly } from 'svelte/transition';
	import Button from './ui/button/button.svelte';

	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeMenu();
		}
	}
</script>

<!-- Header with Hamburger Button -->
<div class="fixed top-0 z-50 flex h-20 w-full flex-row-reverse bg-transparent px-8 py-6">
	<Button
		variant="cloud"
		onclick={toggleMenu}
		class="relative z-50"
		aria-label="Toggle navigation menu"
	>
		<!-- Animated Hamburger Icon -->
		<div class="relative flex h-6 w-6 flex-col items-center justify-center">
			<span
				class="absolute h-0.5 w-6 bg-current transition-all duration-300 {isOpen
					? 'rotate-45'
					: '-translate-y-2'}"
			></span>
			<span
				class="absolute h-0.5 w-6 bg-current transition-all duration-300 {isOpen
					? 'opacity-0'
					: 'opacity-100'}"
			></span>
			<span
				class="absolute h-0.5 w-6 bg-current transition-all duration-300 {isOpen
					? '-rotate-45'
					: 'translate-y-2'}"
			></span>
		</div>
	</Button>
</div>

{#if isOpen}
	<!-- Mobile Dropdown Menu - Slides down -->
	<nav
		class="fixed left-0 right-0 top-0 z-40 overflow-hidden bg-white pt-20 text-[var(--pink)] shadow-lg md:hidden"
		transition:slide={{ duration: 300 }}
	>
		<div class="block border-b border-gray-200 px-6 py-4">
			<h2 class="text-xl font-bold text-black">Menu</h2>
			<a href="/" class="block px-6 py-4 transition-colors hover:bg-gray-100" on:click={closeMenu}
				>Home</a
			>
			<a
				href="/portfolio"
				class="block px-6 py-4 transition-colors hover:bg-gray-100"
				on:click={closeMenu}>Portfolio</a
			>
		</div>
	</nav>

	<!-- Desktop Sidebar with Backdrop -->
	<div class="hidden md:block">
		<!-- Backdrop for desktop -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-40 bg-black/50" on:click={handleBackdropClick}></div>

		<!-- Menu Panel - Slides in from right -->
		<div
			class="fixed right-0 top-0 z-40 h-full w-80 bg-white text-[var(--pink)] shadow-2xl"
			transition:fly={{ x: 320, duration: 300 }}
		>
			<!-- Menu Header -->
			<div class="flex items-center justify-between border-b border-gray-200 p-8 text-black">
				<h2 class="text-xl font-bold">Menu</h2>
			</div>

			<!-- Navigation Links -->
			<nav class="flex flex-col space-y-4 p-8">
				<a
					href="/"
					class="rounded-lg px-4 py-3 text-base transition-colors hover:bg-gray-100"
					on:click={closeMenu}
				>
					Home
				</a>
				<a
					href="/portfolio"
					class="rounded-lg px-4 py-3 text-base transition-colors hover:bg-gray-100"
					on:click={closeMenu}
				>
					Portfolio
				</a>
			</nav>
		</div>
	</div>
{/if}

<!-- Global keyboard handler -->
<svelte:window on:keydown={(e) => e.key === 'Escape' && closeMenu()} />
