// Public GitHub data for the portfolio page. Nothing here needs a token:
// the contribution calendar and profile page are public HTML, and the repo list
// uses the unauthenticated REST API (60 requests/hour), so results are cached.

const USER = 'hupeyy';
const TTL = 60 * 60 * 1000;
const cache = new Map();

async function cached(key, load) {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < TTL) return hit.value;
	try {
		const value = await load();
		cache.set(key, { at: Date.now(), value });
		return value;
	} catch (err) {
		// Serve stale data rather than nothing if GitHub is down
		if (hit) return hit.value;
		throw err;
	}
}

async function text(url) {
	const res = await fetch(url, { headers: { 'User-Agent': 'hupey.cloud' } });
	if (!res.ok) throw new Error(`${url} returned ${res.status}`);
	return res.text();
}

// Weeks of days, oldest first: [{ date, level 0-4, count }] with 7 rows per week
export function contributions() {
	return cached('contributions', async () => {
		const html = await text(`https://github.com/users/${USER}/contributions`);

		const counts = new Map();
		for (const [, id, label] of html.matchAll(
			/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
		)) {
			counts.set(id, parseInt(label) || 0);
		}

		const weeks = [];
		for (const [tag] of html.matchAll(/<td[^>]*data-date="[^"]*"[^>]*>/g)) {
			const date = tag.match(/data-date="([^"]+)"/)[1];
			const id = tag.match(/id="([^"]+)"/)[1];
			const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
			const [, row, col] = id.match(/-(\d+)-(\d+)$/).map(Number);
			(weeks[col] ??= [])[row] = { date, level, count: counts.get(id) ?? 0 };
		}

		const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
		return {
			total: total ? Number(total[1].replace(/,/g, '')) : null,
			weeks: weeks.filter(Boolean)
		};
	});
}

// The repos pinned on the profile, in pinned order; falls back to most starred
export function topRepos(limit = 6) {
	return cached('repos', async () => {
		const [profile, reposJson] = await Promise.all([
			text(`https://github.com/${USER}`),
			text(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`)
		]);
		const repos = JSON.parse(reposJson).filter((r) => !r.fork);

		const pinned = [
			...profile.matchAll(
				new RegExp(`pinned-item-list-item-content[\\s\\S]*?href="/${USER}/([^"/]+)"`, 'g')
			)
		].map((m) => m[1]);

		const chosen = pinned.length
			? pinned.map((name) => repos.find((r) => r.name === name)).filter(Boolean)
			: repos.sort(
					(a, b) =>
						b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)
				);

		return chosen.slice(0, limit).map((r) => ({
			name: r.name,
			url: r.html_url,
			description: r.description,
			language: r.language,
			stars: r.stargazers_count,
			pushedAt: r.pushed_at
		}));
	});
}
