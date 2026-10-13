// Public GitHub data for the portfolio page. Nothing here needs a token:
// the contribution calendar and profile page are public HTML, and the repo list
// uses the unauthenticated REST API (60 requests/hour), so results are cached.

const USER = 'hupeyy';
const TTL = 60 * 60 * 1000;
const cache = new Map();

const RETRY = 5 * 60 * 1000;
const TIMEOUT = 5000;

// Stale-while-revalidate: once anything is cached, callers get it immediately and
// an expired entry is refreshed in the background, so a page view never waits on
// GitHub. Only the very first load (no cached value yet) is awaited. Concurrent
// callers share one in-flight load. A failed refresh keeps the stale value and
// waits RETRY before trying GitHub again, so an outage or rate limit doesn't turn
// every page view into fresh (quota-burning) requests.
function cached(key, load) {
	const hit = cache.get(key);
	if (hit?.pending) return 'value' in hit ? hit.value : hit.pending;
	if (hit && Date.now() - hit.at < TTL) return hit.value;
	const pending = load().then(
		(value) => {
			cache.set(key, { at: Date.now(), value });
			return value;
		},
		(err) => {
			if (!hit) {
				cache.delete(key);
				throw err;
			}
			cache.set(key, { at: Date.now() - TTL + RETRY, value: hit.value });
			return hit.value;
		}
	);
	cache.set(key, { ...hit, pending });
	return hit ? hit.value : pending;
}

async function text(url) {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'hupey.cloud' },
		signal: AbortSignal.timeout(TIMEOUT)
	});
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
			const date = tag.match(/data-date="([^"]+)"/)?.[1];
			const id = tag.match(/id="([^"]+)"/)?.[1];
			const pos = id?.match(/-(\d+)-(\d+)$/);
			if (!date || !pos) continue;
			const [, row, col] = pos.map(Number);
			const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
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
	return cached(`repos:${limit}`, async () => {
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
