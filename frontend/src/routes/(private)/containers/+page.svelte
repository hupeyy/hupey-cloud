<script>
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	const services = $derived(data.containers.filter((c) => c.listed));
	const others = $derived(data.containers.filter((c) => !c.listed && c.state === 'running'));
	const host = $derived(data.host);
	let copied = $state(null);

	// Refresh every 10s while the page is open
	$effect(() => {
		const timer = setInterval(invalidateAll, 10000);
		return () => clearInterval(timer);
	});

	async function copy(address) {
		await navigator.clipboard.writeText(address);
		copied = address;
		setTimeout(() => (copied = null), 1500);
	}

	function bytes(n) {
		if (n == null) return 'n/a';
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let i = 0;
		while (n >= 1024 && i < units.length - 1) {
			n /= 1024;
			i++;
		}
		return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
	}

	function duration(seconds) {
		if (seconds == null) return '—';
		const d = Math.floor(seconds / 86400);
		const h = Math.floor((seconds % 86400) / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		if (d) return `${d}d ${h}h`;
		if (h) return `${h}h ${m}m`;
		return `${m}m`;
	}

	const since = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 1000 : null);
	const pct = (n) => (n == null ? 'n/a' : `${n.toFixed(1)}%`);

	// Dot colour: health check wins over plain state
	function dot(c) {
		if (c.state !== 'running') return 'bg-red-400';
		if (c.health === 'unhealthy') return 'bg-red-400';
		if (c.health === 'starting') return 'bg-amber-400';
		return 'bg-emerald-400';
	}

	function stateLabel(c) {
		if (c.state !== 'running') return c.exitCode != null ? `${c.state} (${c.exitCode})` : c.state;
		return c.health ?? 'running';
	}

	const level = (value, warn, crit) =>
		value == null ? '' : value >= crit ? 'bg-red-400' : value >= warn ? 'bg-amber-400' : 'bg-white';
</script>

{#snippet meter(label, value, detail, percent, color)}
	<div class="rounded-2xl bg-white/15 p-4 shadow-lg backdrop-blur">
		<p class="text-sm text-white/70">{label}</p>
		<p class="text-2xl">{value}</p>
		{#if percent != null}
			<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
				<div class="h-full rounded-full {color}" style="width: {Math.min(percent, 100)}%"></div>
			</div>
		{/if}
		{#if detail}<p class="mt-1 truncate text-xs text-white/70">{detail}</p>{/if}
	</div>
{/snippet}

<div
	class="min-h-screen bg-linear-to-b from-[var(--blue)] to-[var(--pink)] px-4 pt-24 pb-12 text-white sm:px-8"
>
	<div class="mx-auto max-w-5xl">
		<h1 class="mb-1 text-3xl sm:text-4xl">Containers</h1>
		<p class="mb-8 text-white/80">Services running on hupi</p>

		{#if host}
			{@const memPct = (host.memory.used / host.memory.total) * 100}
			{@const diskPct = (host.disk.used / host.disk.total) * 100}
			<div class="mb-10 grid grid-cols-2 gap-3 md:grid-cols-5">
				{@render meter(
					'Temperature',
					host.temp != null ? `${host.temp.toFixed(0)}°C` : 'n/a',
					'throttles at 85°C',
					host.temp != null ? (host.temp / 85) * 100 : null,
					level(host.temp, 70, 80)
				)}
				{@render meter(
					'CPU',
					pct(host.cpu),
					`load ${host.load.map((l) => l.toFixed(2)).join(' ')}`,
					host.cpu,
					level(host.cpu, 70, 90)
				)}
				{@render meter(
					'Memory',
					pct(memPct),
					`${bytes(host.memory.used)} / ${bytes(host.memory.total)}`,
					memPct,
					level(memPct, 80, 90)
				)}
				{@render meter(
					'Disk',
					pct(diskPct),
					`${bytes(host.disk.used)} / ${bytes(host.disk.total)}`,
					diskPct,
					level(diskPct, 80, 90)
				)}
				{@render meter('Uptime', duration(host.uptime), null, null, null)}
			</div>
		{/if}

		{#if data.loadError}
			<p class="mb-6 rounded-md bg-white/90 px-4 py-3 text-[var(--pink)]">{data.loadError}</p>
		{/if}

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each services as c (c.id)}
				{@const running = c.state === 'running'}
				{@const card =
					'flex flex-col rounded-2xl bg-white/15 p-5 shadow-lg backdrop-blur transition-all'}
				{#snippet body()}
					<div class="mb-1 flex items-center justify-between gap-2">
						<h2 class="truncate text-xl">{c.name}</h2>
						<span class="flex shrink-0 items-center gap-2 text-sm text-white/80">
							<span class="h-2.5 w-2.5 rounded-full {dot(c)}"></span>
							{stateLabel(c)}
						</span>
					</div>
					<p class="mb-4 truncate text-sm text-white/70">{c.image}</p>

					<dl class="mb-4 grid grid-cols-4 gap-2 text-center text-xs">
						<div>
							<dt class="text-white/60">CPU</dt>
							<dd class="text-sm">{running ? pct(c.cpu) : '—'}</dd>
						</div>
						<div>
							<dt class="text-white/60">Memory</dt>
							<dd class="text-sm">{running ? bytes(c.memory) : '—'}</dd>
						</div>
						<div>
							<dt class="text-white/60">Up</dt>
							<dd class="text-sm">{duration(since(c.startedAt))}</dd>
						</div>
						<div>
							<dt class="text-white/60">Restarts</dt>
							<dd class="text-sm {c.restarts ? 'text-amber-200' : ''}">{c.restarts ?? '—'}</dd>
						</div>
					</dl>

					<p class="mt-auto truncate text-sm">
						{#if c.url}
							{c.url.replace(/^https?:\/\//, '')} →
						{:else if c.address}
							{copied === c.address ? 'Copied!' : `${c.address} · click to copy`}
						{:else}
							{c.status}
						{/if}
					</p>
				{/snippet}

				{#if c.url && running}
					<a
						href={c.url}
						target="_blank"
						rel="noopener"
						class="{card} hover:scale-[1.02] hover:bg-white/25"
					>
						{@render body()}
					</a>
				{:else if c.address && running}
					<button
						onclick={() => copy(c.address)}
						class="{card} text-left hover:scale-[1.02] hover:bg-white/25"
					>
						{@render body()}
					</button>
				{:else}
					<div class="{card} opacity-60">{@render body()}</div>
				{/if}
			{/each}
		</div>

		{#if others.length}
			<h2 class="mt-10 mb-3 text-xl">Other running containers</h2>
			<div class="overflow-x-auto rounded-2xl bg-white/10 backdrop-blur">
				<table class="w-full text-left text-sm">
					<thead class="text-white/60">
						<tr>
							<th class="px-5 py-3 font-normal">Container</th>
							<th class="px-3 py-3 font-normal">Health</th>
							<th class="px-3 py-3 font-normal">CPU</th>
							<th class="px-3 py-3 font-normal">Memory</th>
							<th class="px-3 py-3 font-normal">Up</th>
							<th class="px-5 py-3 font-normal">Ports</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/20">
						{#each others as c (c.id)}
							<tr>
								<td class="px-5 py-3">{c.container}</td>
								<td class="px-3 py-3">
									<span class="flex items-center gap-2">
										<span class="h-2 w-2 rounded-full {dot(c)}"></span>{stateLabel(c)}
									</span>
								</td>
								<td class="px-3 py-3">{pct(c.cpu)}</td>
								<td class="px-3 py-3">{bytes(c.memory)}</td>
								<td class="px-3 py-3">{duration(since(c.startedAt))}</td>
								<td class="px-5 py-3 text-white/70">{c.ports.join(', ') || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
