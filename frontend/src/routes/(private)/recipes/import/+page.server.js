import { error, fail } from '@sveltejs/kit';
import { fetchPost, checkUrl } from '$lib/server/social.js';
import { createRecipe } from '$lib/server/mealie.js';
import { parseCaption, restoreLineBreaks } from '$lib/recipe-caption.js';

// Recipes are written to Mealie with one shared token, so only admins import.
async function requireAdmin(event) {
	const session = await event.locals.auth();
	if (!session?.user?.isAdmin) error(403, 'Admins only');
}

export async function load(event) {
	const { session } = await event.parent();
	if (!session.user.isAdmin) error(403, 'Admins only');
}

export const actions = {
	// Look up a post and return its caption, with line breaks restored, for editing
	fetch: async (event) => {
		await requireAdmin(event);
		const url = String((await event.request.formData()).get('url') ?? '');
		try {
			const post = await fetchPost(url);
			return { post, text: restoreLineBreaks(post.caption) };
		} catch (err) {
			return fail(400, { url, error: err.message });
		}
	},

	// Parse the (possibly edited) caption and create the recipe in Mealie
	save: async (event) => {
		await requireAdmin(event);
		const form = await event.request.formData();
		const text = String(form.get('text') ?? '');
		const name = String(form.get('name') ?? '').trim();
		const thumbnail = String(form.get('thumbnail') ?? '') || null;

		let sourceUrl;
		try {
			sourceUrl = checkUrl(String(form.get('url') ?? ''));
		} catch (err) {
			return fail(400, { error: err.message });
		}

		const recipe = parseCaption(text);
		if (name) recipe.name = name;
		if (!recipe.name) return fail(400, { error: 'The recipe needs a name.' });
		if (!recipe.ingredients.length && !recipe.steps.length) {
			return fail(400, { error: 'No ingredients or steps were found in the caption.' });
		}

		// Only fetch thumbnails from the platforms' own CDNs
		const imageUrl =
			thumbnail &&
			/^https:\/\/[^/]+\.(tiktokcdn(-us)?\.com|cdninstagram\.com|fbcdn\.net)\//.test(thumbnail)
				? thumbnail
				: null;

		try {
			const link = await createRecipe(recipe, { sourceUrl, imageUrl });
			return { saved: { name: recipe.name, link } };
		} catch (err) {
			console.error('mealie import:', err);
			return fail(502, { error: 'Mealie did not accept the recipe. Try again in a moment.' });
		}
	}
};
