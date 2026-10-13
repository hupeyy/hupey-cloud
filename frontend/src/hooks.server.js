import { building, dev } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from './auth';
import { contributions, topRepos } from '$lib/server/github.js';

// Fill the GitHub cache at startup so the first portfolio visit doesn't wait on GitHub
if (!building) {
	contributions().catch((err) => console.error('github warm-up:', err.message));
	topRepos().catch((err) => console.error('github warm-up:', err.message));
}

const devUser = {
	name: 'Dev admin',
	email: 'dev@localhost',
	groups: ['authentik Admins'],
	isAdmin: true
};

// Under `vite dev` only: with no real session, act as a signed-in admin so the
// private pages can be worked on without Authentik. Production builds skip this.
const devAdmin = async ({ event, resolve }) => {
	const auth = event.locals.auth;
	event.locals.auth = async () => {
		const session = await auth().catch(() => null);
		return session ?? { user: devUser, expires: new Date(Date.now() + 86400000).toISOString() };
	};
	return resolve(event);
};

export const handle = dev ? sequence(authHandle, devAdmin) : authHandle;
