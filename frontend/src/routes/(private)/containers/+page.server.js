import { error } from '@sveltejs/kit';
import { listContainers } from '$lib/server/docker.js';
import { hostStats } from '$lib/server/host.js';

export async function load({ parent }) {
	const { session } = await parent();
	if (!session.user.isAdmin) error(403, 'Admins only');

	const [containers, host] = await Promise.allSettled([listContainers(), hostStats()]);
	if (containers.status === 'rejected') console.error('containers: ', containers.reason);
	if (host.status === 'rejected') console.error('host stats: ', host.reason);

	return {
		containers: containers.value ?? [],
		host: host.value ?? null,
		loadError: containers.status === 'rejected' ? 'Could not reach Docker.' : null
	};
}
