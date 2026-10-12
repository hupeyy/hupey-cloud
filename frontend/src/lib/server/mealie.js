import { env } from '$env/dynamic/private';

// Mealie's API, reached over the Docker network. The token belongs to a Mealie
// user, so recipes created here are owned by that user.
const base = () => (env.MEALIE_API ?? 'http://mealie:9000').replace(/\/$/, '');
export const mealieUrl = () => (env.MEALIE_URL ?? 'https://recipes.hupey.cloud').replace(/\/$/, '');

async function call(method, path, body) {
	if (!env.MEALIE_API_TOKEN) throw new Error('MEALIE_API_TOKEN is not set.');
	const res = await fetch(`${base()}/api${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${env.MEALIE_API_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: body === undefined ? undefined : JSON.stringify(body),
		signal: AbortSignal.timeout(20_000)
	});
	if (!res.ok) {
		const detail = (await res.text()).slice(0, 300);
		throw new Error(`Mealie ${method} ${path} returned ${res.status}: ${detail}`);
	}
	const text = await res.text();
	return text ? JSON.parse(text) : null;
}

/**
 * Create a recipe from parsed caption data and return its URL in Mealie.
 * recipe: { name, description, ingredients: [{ title, note }], steps: [{ title, text }], notes: [{ title, text }] }
 */
export async function createRecipe(recipe, { sourceUrl, imageUrl }) {
	const slug = await call('POST', '/recipes', { name: recipe.name });
	const current = await call('GET', `/recipes/${slug}`);

	const saved = await call('PUT', `/recipes/${slug}`, {
		...current,
		description: recipe.description,
		orgURL: sourceUrl,
		recipeIngredient: recipe.ingredients.map((i) => ({
			title: i.title,
			note: i.note,
			display: i.note,
			quantity: 0,
			unit: null,
			food: null,
			referenceId: crypto.randomUUID()
		})),
		recipeInstructions: recipe.steps.map((s) => ({
			id: crypto.randomUUID(),
			title: s.title,
			summary: '',
			text: s.text,
			ingredientReferences: []
		})),
		notes: recipe.notes
	});

	// The thumbnail is a nice-to-have; a failure here should not lose the recipe
	if (imageUrl) {
		await call('POST', `/recipes/${saved.slug}/image`, { url: imageUrl }).catch((err) =>
			console.error('mealie image:', err.message)
		);
	}

	const { groupSlug } = await call('GET', '/users/self');
	return `${mealieUrl()}/g/${groupSlug}/r/${saved.slug}`;
}
