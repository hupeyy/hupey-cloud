import { redirect } from '@sveltejs/kit';

// Every page inside the (private) group requires a signed-in user.
export async function load(event) {
	const session = await event.locals.auth();
	if (!session?.user) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
	}
	return { session };
}
