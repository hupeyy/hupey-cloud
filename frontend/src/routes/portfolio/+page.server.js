import { contributions, topRepos } from '$lib/server/github.js';

export async function load() {
	const [calendar, repos] = await Promise.allSettled([contributions(), topRepos()]);
	if (calendar.status === 'rejected') console.error('github contributions: ', calendar.reason);
	if (repos.status === 'rejected') console.error('github repos: ', repos.reason);

	return {
		calendar: calendar.value ?? null,
		repos: repos.value ?? null
	};
}
