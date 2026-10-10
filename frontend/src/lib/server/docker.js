import { env } from '$env/dynamic/private';

// Lists containers through the read-only docker-socket-proxy.
// Labels used: cloud.name, cloud.url (clickable link), cloud.address (copyable host:port).

async function api(path) {
	const res = await fetch(`${env.DOCKER_API}${path}`);
	if (!res.ok) throw new Error(`Docker API ${path} returned ${res.status}`);
	return res.json();
}

// Health check status, restart count and start time
async function inspect(id) {
	const j = await api(`/containers/${id}/json`);
	return {
		health: j.State.Health?.Status ?? null,
		restarts: j.RestartCount,
		startedAt: j.State.Running ? j.State.StartedAt : null,
		exitCode: j.State.Running ? null : j.State.ExitCode
	};
}

// CPU as % of the whole host; memory is null when the kernel has memory cgroups disabled
async function stats(id) {
	const s = await api(`/containers/${id}/stats?stream=false`);
	const cpuDelta = s.cpu_stats.cpu_usage.total_usage - s.precpu_stats.cpu_usage.total_usage;
	const sysDelta = s.cpu_stats.system_cpu_usage - s.precpu_stats.system_cpu_usage;
	const m = s.memory_stats;
	return {
		cpu: sysDelta > 0 ? (cpuDelta / sysDelta) * 100 : 0,
		memory: m.usage != null ? m.usage - (m.stats?.inactive_file ?? 0) : null
	};
}

export async function listContainers() {
	const raw = await api('/containers/json?all=1');

	return (
		await Promise.all(
			raw.map(async (c) => {
				const labels = c.Labels ?? {};
				const running = c.State === 'running';
				const [details, usage] = await Promise.all([
					inspect(c.Id).catch(() => ({})),
					running ? stats(c.Id).catch(() => null) : null
				]);
				const ports = [
					...new Set(
						(c.Ports ?? []).filter((p) => p.PublicPort).map((p) => `${p.PublicPort}/${p.Type}`)
					)
				];
				return {
					id: c.Id.slice(0, 12),
					name: labels['cloud.name'] ?? c.Names[0].replace(/^\//, ''),
					container: c.Names[0].replace(/^\//, ''),
					image: c.Image,
					state: c.State,
					status: c.Status,
					url: labels['cloud.url'] ?? null,
					address: labels['cloud.address'] ?? null,
					listed: 'cloud.name' in labels,
					ports,
					...details,
					cpu: usage?.cpu ?? null,
					memory: usage?.memory ?? null
				};
			})
		)
	).sort((a, b) => a.name.localeCompare(b.name));
}
