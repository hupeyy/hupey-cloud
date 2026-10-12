import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const HOSTS = ['tiktok.com', 'instagram.com'];

/** Throws unless the link is an Instagram or TikTok post. */
export function checkUrl(input) {
	let url;
	try {
		url = new URL(input.trim());
	} catch {
		throw new Error('That is not a valid link.');
	}
	const host = url.hostname.replace(/^(www|m|vm|vt)\./, '');
	if (url.protocol !== 'https:' || !HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
		throw new Error('Paste an Instagram or TikTok link.');
	}
	// Share links carry tracking parameters that yt-dlp does not need
	url.search = '';
	return url.toString();
}

/**
 * Fetch a post's caption and thumbnail without downloading the video.
 * Returns { url, title, caption, author, thumbnail }.
 */
export async function fetchPost(input) {
	const url = checkUrl(input);
	if (new URL(url).hostname.endsWith('tiktok.com')) {
		const post = await tiktokOembed(url).catch((err) =>
			console.error('tiktok oembed:', err.message)
		);
		if (post) return post;
	}
	return ytDlp(url);
}

// TikTok's public oEmbed endpoint returns the full caption and is steadier than
// scraping the video page, which TikTok often answers with a bot check.
async function tiktokOembed(url) {
	const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
		signal: AbortSignal.timeout(15_000)
	});
	if (!res.ok) throw new Error(`status ${res.status}`);
	const info = await res.json();
	if (!info.title) return null;
	return {
		url,
		title: info.title,
		caption: info.title,
		author: info.author_name || '',
		thumbnail: info.thumbnail_url || null
	};
}

async function ytDlp(url) {
	let stdout;
	try {
		({ stdout } = await run(
			'yt-dlp',
			['--dump-single-json', '--skip-download', '--no-playlist', '--no-warnings', '--', url],
			{ timeout: 45_000, maxBuffer: 20 * 1024 * 1024 }
		));
	} catch (err) {
		const reason =
			String(err.stderr || err.message)
				.split('\n')
				.find((l) => l.includes('ERROR')) ?? '';
		console.error('yt-dlp failed:', url, reason || err.message);
		throw new Error(
			/login|private|rate.?limit/i.test(reason)
				? 'The post is private or the site asked for a login. Paste the caption instead.'
				: 'Could not read that post. Check the link, or paste the caption instead.'
		);
	}

	const info = JSON.parse(stdout);
	return {
		url: info.webpage_url || url,
		title: info.title || '',
		caption: info.description || info.title || '',
		author: info.uploader || info.channel || '',
		thumbnail: info.thumbnail || null
	};
}
